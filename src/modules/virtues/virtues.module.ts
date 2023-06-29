import { Module } from '@nestjs/common';
import { VirtuesService } from './virtues.service';
import { VirtuesController } from './virtues.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtuesEntity } from './entities/virtues.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([VirtuesEntity]), UsersModule],
  providers: [VirtuesService],
  controllers: [VirtuesController],
})
export class VirtuesModule {}
