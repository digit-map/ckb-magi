import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlocksModule } from './blocks/blocks.module';
import { TypeOrmModule } from '@nestjs/typeorm';

const dbPath = process.env.DB || 'mongodb://localhost/ckb_magi';

@Module({
  imports: [TypeOrmModule.forRoot(), BlocksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
