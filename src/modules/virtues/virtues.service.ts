import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VirtuesEntity } from './entities/virtues.entity';
import { Repository } from 'typeorm';
import { JwtContextType } from 'src/types/jwt-context.type';
import { UsersService } from '../users/users.service';
import { CreateVirtueDTO } from './dtos/create-virtue.dto';

@Injectable()
export class VirtuesService {
  constructor(
    @InjectRepository(VirtuesEntity)
    private readonly virtuesRepository: Repository<VirtuesEntity>,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async getMine(context: JwtContextType) {
    return await this.virtuesRepository.find({
      where: { user: { id: context.id } },
      select: { user: { id: true } },
      relations: { user: true },
    });
  }

  async getByPublicTag(context: JwtContextType, publicTag: string) {
    const currentUser = await this.usersService.getOneById(context.id, true);

    // This one performs check if there is a target user
    await this.usersService.getOneByPublicTag(publicTag);

    const isSubscribed = !!currentUser.subscriptions.find(
      (s) => s.publicTag === publicTag,
    );

    if (!isSubscribed) {
      throw new HttpException(`Not subscribed!`, HttpStatus.CONFLICT);
    }

    const virtues = await this.virtuesRepository.find({
      where: { user: { publicTag } },
      select: { user: { id: true, publicTag: true, displayName: true } },
      relations: { user: true },
    });

    return virtues;
  }

  async getByUserId(context: JwtContextType, userId: string) {
    const currentUser = await this.usersService.getOneById(context.id, true);

    // This one performs check if there is a target user
    await this.usersService.getOneById(userId);

    const isSubscribed = !!currentUser.subscriptions.find(
      (s) => s.id === userId,
    );

    if (!isSubscribed) {
      throw new HttpException(`Not subscribed!`, HttpStatus.CONFLICT);
    }

    const virtues = await this.virtuesRepository.find({
      where: { user: { id: userId } },
      select: { user: { id: true } },
      relations: { user: true },
    });

    return virtues;
  }

  async create(context: JwtContextType, { text }: CreateVirtueDTO) {
    return await this.virtuesRepository
      .create({ text: text, user: { id: context.id } })
      .save();
  }

  async update(
    context: JwtContextType,
    virtueId: string,
    { text }: CreateVirtueDTO,
  ) {
    // With the request given below, there is no need to add a check if the
    // virtue belongs to the user. Because the search of a virtue is performed
    // both with a virtue's ID and user's ID from a JWT context.

    const currentVirtue = await this.virtuesRepository.findOne({
      where: { id: virtueId, user: { id: context.id } },
      select: { user: { id: true } },
      relations: { user: true },
    });

    if (!currentVirtue) {
      throw new HttpException(
        `No virtue found! :: ${virtueId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.virtuesRepository.update(virtueId, { ...(text && { text }) });

    return await this.virtuesRepository.findOne({ where: { id: virtueId } });
  }

  async delete(context: JwtContextType, virtueId: string) {
    const currentVirtue = await this.virtuesRepository.findOne({
      where: { id: virtueId, user: { id: context.id } },
      select: { user: { id: true } },
      relations: { user: true },
    });

    if (!currentVirtue) {
      throw new HttpException(
        `Virtue not found! :: ${virtueId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return await currentVirtue.softRemove();
  }
}
