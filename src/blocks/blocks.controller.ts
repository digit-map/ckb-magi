import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { core } from '../core';
import { BlockResponseInterceptor } from '../common/interceptors/blocks-response.interceptor';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get()
  @UseInterceptors(BlockResponseInterceptor)
  async findAllBlocks() {
    return this.blocksService.findAll();
  }

  @Get(':hash')
  async findBlockByHash(@Param('hash') hash: string) {
    return this.blocksService.findByHash(hash);
  }

  @Post('sync')
  async sync(
    @Body('start') start: string = '0',
    @Body('end') end: string = '0',
  ) {
    const list = Array.from({ length: +end - +start }, (v, idx) => {
      return core.rpc.getBlockByNumber(start + idx);
    });
    const blocks = await Promise.all(list).then(bs => bs.filter(b => b));
    const savedBlocks = await this.blocksService.createBlocks(blocks);

    return savedBlocks;
  }
}
