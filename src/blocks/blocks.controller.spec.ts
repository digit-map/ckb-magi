import { Test, TestingModule } from '@nestjs/testing';
import { BlocksController } from './blocks.controller';

describe.skip('Blocks Controller', () => {
  let controller: BlocksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlocksController],
    }).compile();

    controller = module.get<BlocksController>(BlocksController);
  });
});
