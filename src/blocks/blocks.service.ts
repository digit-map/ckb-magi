import { CreateBlockDto } from './dto/create-block.dto';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Block } from './interface/block.interface';
import { core } from '../core';

@Injectable()
export class BlocksService {
  private isSyncingBlocks = false;
  constructor(@InjectModel('Block') private readonly blockModel: Model<Block>) {
    setInterval(() => {
      this.syncBlock().then(num => {
        if (num !== undefined) {
          console.info(`block ${num} synced`);
        }
      });
    }, 1000);
  }

  async createBlock(createBlockDto: CreateBlockDto) {
    const createdBlock = new this.blockModel(createBlockDto.header);
    return await createdBlock.save();
  }

  async createBlocks(blocks: CreateBlockDto[]) {
    return await this.blockModel.insertMany(blocks.map(block => block.header));
  }

  async findAll({ offset = 0, limit = 10 } = { offset: 0, limit: 10 }) {
    return await this.blockModel
      .find()
      .sort({ number: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findByHash(hash: string) {
    return await this.blockModel.find({ hash }).exec();
  }

  private async syncBlock() {
    if (this.isSyncingBlocks) return;

    const [tipBlockNumber, syncedBlockNumber] = await Promise.all([
      core.rpc.getTipBlockNumber(),
      this.blockModel
        .find()
        .sort({ number: -1 })
        .limit(1)
        .then(blocks => {
          if (blocks.length) {
            return blocks[0].number;
          }
          return '-1';
        }),
    ]);
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
        const savedBlock = await this.createBlock(newBlock);
        return savedBlock.number;
      }
    }
  }

  private async syncBlocks(start: string = '0', end: string = '0') {
    if (this.isSyncingBlocks) return;
    this.isSyncingBlocks = true;
    const list = Array.from({ length: +end - +start }, (v, idx) => {
      return core.rpc.getBlockByNumber(`${+start + idx}`);
    });
    const blocks = await Promise.all(list).then(bs => bs.filter(b => b));
    const savedBlocks = await this.createBlocks(blocks);
    this.isSyncingBlocks = false;
  }
}
