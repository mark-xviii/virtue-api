import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { VirtuesService } from './virtues.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ExtractJwtContext } from '../auth/decorators/jwt.decorator';
import { JwtContextType } from 'src/types/jwt-context.type';
import { CreateVirtueDTO } from './dtos/create-virtue.dto';
import { UpdateVirtueDTO } from './dtos/update-virtue.dto';

@Controller('virtues')
export class VirtuesController {
  constructor(
    @Inject(VirtuesService) private readonly virtuesService: VirtuesService,
  ) {}

  @UseGuards(new JwtAuthGuard())
  @Get('/user/:publicTag')
  getVirtuesByPublicTag(
    @ExtractJwtContext() context: JwtContextType,
    @Param('publicTag') publicTag: string,
  ) {
    return this.virtuesService.getByPublicTag(context, publicTag);
  }

  @UseGuards(new JwtAuthGuard())
  @Get('/feed')
  getFeed(@ExtractJwtContext() context: JwtContextType) {
    return this.virtuesService.getFeed(context);
  }

  @UseGuards(new JwtAuthGuard())
  @Post('/')
  postVirtue(
    @ExtractJwtContext() context: JwtContextType,
    @Body() body: CreateVirtueDTO,
  ) {
    return this.virtuesService.create(context, body);
  }

  @UseGuards(new JwtAuthGuard())
  @Put('/:virtueId')
  updateVirtue(
    @ExtractJwtContext() context: JwtContextType,
    @Param('virtueId') virtueId: string,
    @Body() body: UpdateVirtueDTO,
  ) {
    return this.virtuesService.update(context, virtueId, body);
  }

  @UseGuards(new JwtAuthGuard())
  @Delete('/:virtueId')
  deleteVirtue(
    @ExtractJwtContext() context: JwtContextType,
    @Param('virtueId') virtueId: string,
  ) {
    return this.virtuesService.delete(context, virtueId);
  }
}
