import { Test, TestingModule } from '@nestjs/testing';
import { BlocksService } from './blocks.service';

describe.skip('BlocksService', () => {
  let service: BlocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlocksService],
    }).compile();

    service = module.get<BlocksService>(BlocksService);
  });
});
