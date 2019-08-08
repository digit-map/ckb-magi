import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlocksModule } from './blocks/blocks.module';
import { MongooseModule } from '@nestjs/mongoose';

const dbPath = process.env.DB || 'mongodb://localhost/ckb_magi';

@Module({
  imports: [MongooseModule.forRoot(dbPath), BlocksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
