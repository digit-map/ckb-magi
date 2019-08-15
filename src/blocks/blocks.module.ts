import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { BlockEntity } from './entities/block.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BlockEntity])],
  providers: [BlocksService],
  controllers: [BlocksController],
})
export class BlocksModule {}
