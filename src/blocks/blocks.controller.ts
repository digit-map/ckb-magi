import { Controller, Post, Body, Get } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}
  @Post()
  async createBlock(@Body() createBlockDto: CreateBlockDto) {
    return this.blocksService.createBlock(createBlockDto);
  }

  @Get()
  async findAllBlocks() {
    return this.blocksService.findAll();
  }
}
