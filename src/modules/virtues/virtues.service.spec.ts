import { Test, TestingModule } from '@nestjs/testing';
import { VirtuesService } from './virtues.service';

describe('VirtuesService', () => {
  let service: VirtuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VirtuesService],
    }).compile();

    service = module.get<VirtuesService>(VirtuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
