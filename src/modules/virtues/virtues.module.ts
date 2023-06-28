import { Module } from '@nestjs/common';
import { VirtuesService } from './virtues.service';
import { VirtuesController } from './virtues.controller';

@Module({
  providers: [VirtuesService],
  controllers: [VirtuesController]
})
export class VirtuesModule {}
