import { CreateBlockDto } from './dto/create-block.dto';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Block } from './interface/block.interface';

@Injectable()
export class BlocksService {
  constructor(
    @InjectModel('Block') private readonly blockModel: Model<Block>,
  ) {}

  async createBlock(createBlockDto: CreateBlockDto) {
    const createdBlock = new this.blockModel(createBlockDto.header);
    return await createdBlock.save();
  }

  async findAll() {
    return await this.blockModel.find().exec();
  }
}
