import { Controller, Post, Body } from '@nestjs/common';
import { CreateBlockDto } from './dto/create-block.dto';

@Controller('blocks')
export class BlocksController {
  @Post()
  async createBlock(@Body() createBlockDto: CreateBlockDto) {
    console.log(createBlockDto);
    return createBlockDto;
    // todo
  }
}
