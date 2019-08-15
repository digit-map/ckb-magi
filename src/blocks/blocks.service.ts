import { Injectable, Logger } from '@nestjs/common';
import { Block } from './interface/block.interface';
import { core } from '../core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { BlockEntity } from './entities/block.entity';
import { BlockForkException } from '../common/exceptions/block-fork.exception';

@Injectable()
export class BlocksService {
  private isSyncingBlocks = false;
  constructor(
    @InjectRepository(BlockEntity)
    private readonly blockRepo: Repository<BlockEntity>,
  ) {
    setInterval(() => {
      this.syncBlock().then(num => {
        if (num !== undefined) {
          console.info(`block ${num} synced`);
        }
      });
    }, 1000);
  }

  async createBlock(blockData: Block) {
    const block = await this.blockRepo.save(blockData);
    return block;
  }

  async createBlocks(blocks: Block[]) {
    return await this.blockRepo.save(blocks);
  }

  async findAll({ offset = 0, limit = 10 } = { offset: 0, limit: 10 }) {
    return await this.blockRepo.find({
      order: {
        number: 'DESC',
      },
      skip: offset,
      take: limit,
    });
  }

  async findByHash(hash: string) {
    return await this.blockRepo.findOne(hash);
  }

  private async syncBlock() {
    if (this.isSyncingBlocks) return;

    const [tipBlockNumber, syncedBlockNumber] = await Promise.all([
      core.rpc.getTipBlockNumber(),
      this.blockRepo
        .find({
          order: {
            number: 'DESC',
          },
          take: 1,
        })
        .then(blocks => {
          if (blocks.length) {
            return blocks[0].number;
          }
          return '-1';
        }),
    ]);
    Logger.log(
      `tip: ${tipBlockNumber} => synced: ${syncedBlockNumber}`,
      'Block Service',
    );
    if (+tipBlockNumber > +syncedBlockNumber) {
      if (+tipBlockNumber - +syncedBlockNumber > 10) {
        this.syncBlocks(
          `${+syncedBlockNumber + 1}`,
          `${+syncedBlockNumber + 100}`,
        );
      } else {
        const newBlock = await core.rpc.getBlockByNumber(
          `${+syncedBlockNumber + 1}`,
        );
        const prevBlock = await this.blockRepo.findOne(
          newBlock.header.parentHash,
        );
        if (prevBlock.number + 1 !== +newBlock.header.number) {
          this.removeBlocksSince(prevBlock.number - 10);
          throw new BlockForkException(
            +newBlock.header.number,
            newBlock.header.hash,
          );
        }
        const savedBlock = await this.createBlock(
          this.transformBlock(newBlock),
        );
        return savedBlock.number;
      }
    }
  }

  public transformBlock = block => ({
    hash: block.header.hash,
    number: +block.header.number,
    parentHash: block.header.parentHash,
    difficulty: block.header.difficulty,
    timestamp: block.header.timestamp,
  });

  private async syncBlocks(start: string = '0', end: string = '0') {
    if (this.isSyncingBlocks) return;
    this.isSyncingBlocks = true;
    const list = Array.from({ length: +end - +start }, (v, idx) => {
      return core.rpc.getBlockByNumber(`${+start + idx}`);
    });
    const blocks = await Promise.all(list).then(bs => bs.filter(b => b));
    blocks.forEach(async (block, idx) => {
      if (idx === 0) {
        const prevBlock = await this.blockRepo.findOne(block.header.parentHash);
        if (!prevBlock || prevBlock.number + 1 !== +block.header.number) {
          this.removeBlocksSince(prevBlock.number - 100);
          throw new BlockForkException(+block.header.hash, block.header.hash);
        }
      } else {
        if (block.header.parentHash !== blocks[idx - 1].header.hash) {
          this.removeBlocksSince(prevBlock.number - 100);
          throw new BlockForkException(+block.header.hash, block.header.hash);
        }
      }
    });
    const savedBlocks = await this.createBlocks(
      blocks.map(block => this.transformBlock(block)),
    );
    this.isSyncingBlocks = false;
  }

  async removeBlocksSince(number: number) {
    await this.blockRepo.delete({ number: MoreThanOrEqual(number) });
    return { deleted: true };
  }
}
