import { Test, TestingModule } from '@nestjs/testing';
import { VirtuesController } from './virtues.controller';

describe('VirtuesController', () => {
  let controller: VirtuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VirtuesController],
    }).compile();

    controller = module.get<VirtuesController>(VirtuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
