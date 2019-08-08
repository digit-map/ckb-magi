import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockSchema } from './schema/block.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Block',
        schema: BlockSchema,
      },
    ]),
  ],
  providers: [BlocksService],
  controllers: [BlocksController],
})
export class BlocksModule {}
