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
import { JwtContextType } from 'src/types/jwt-context.type';
import { ExtractJwtContext } from '../auth/decorators/jwt.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Controller('/users')
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  @UseGuards(new JwtAuthGuard())
  @Get('/me')
  getMe(@ExtractJwtContext() context: JwtContextType) {
    return this.usersService.getOneById(context.id);
  }

  @Get('/:userId')
  getUser(@Param('userId') userId: string) {
    return this.usersService.getOneById(userId);
  }

  @UseGuards(new JwtAuthGuard())
  @Post('/subscribe/:publicTag')
  subscribeToUser(
    @ExtractJwtContext() context: JwtContextType,
    @Param('publicTag') publicTag: string,
  ) {
    return this.usersService.subscribeMeTo(context, publicTag);
  }

  @UseGuards(new JwtAuthGuard())
  @Delete('/me')
  deleteUser(@ExtractJwtContext() context: JwtContextType) {
    return this.usersService.deleteMe(context);
  }

  @UseGuards(new JwtAuthGuard())
  @Put('/me')
  updateUser(
    @ExtractJwtContext() context: JwtContextType,
    @Body() body: UpdateUserDTO,
  ) {
    return this.usersService.updateMe(context, body);
  }
}
