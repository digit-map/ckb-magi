import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { core } from '../core';
import { BlockResponseInterceptor } from '../common/interceptors/blocks-response.interceptor';

@Controller('api/blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get()
  @UseInterceptors(BlockResponseInterceptor)
  async findAllBlocks(
    @Query('offset') offset: string = '0',
    @Query('limit') limit: string = '10',
  ) {
    return this.blocksService.findAll({
      offset: +offset,
      limit: +limit,
    });
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
    const savedBlocks = await this.blocksService.createBlocks(
      blocks.map(block => this.blocksService.transformBlock(block)),
    );

    return savedBlocks;
  }
  @Delete()
  async remoteBlocksSince(@Body('since') since: string) {
    return this.blocksService.removeBlocksSince(+since);
  }
}
