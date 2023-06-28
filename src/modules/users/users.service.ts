import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { Repository } from 'typeorm';
import Utils from 'src/utils';
import { JwtContextType } from 'src/types/jwt-context.type';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async findOneByPublicTag(publicTag: string) {
    const user = await this.usersRepository.findOne({
      where: { publicTag },
    });

    if (!user) {
      throw new HttpException(
        `User not found! :: ${publicTag}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async findOneById(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException(
        `User not found! :: ${userId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async updateMe(
    context: JwtContextType,
    { publicTag, password, displayName }: UpdateUserDTO,
  ) {
    let newPasswordHash;

    if (password) {
      newPasswordHash = Utils.Crypto.hashify(password);
    }

    // TODO
    // Let's hope users are not going to abuse this little exploit >)
    // JwtService.unsignSmth(...) or add to list of invalidated tokens.
    // Also we can just programmatically remove jwt from the local storage on
    // the client's side.

    return await this.usersRepository.update(context.id, {
      ...(publicTag && { publicTag }),
      ...(displayName && { displayName }),
      ...(password && { passwordHash: newPasswordHash }),
    });
  }

  async deleteMe(context: JwtContextType) {
    return await this.usersRepository.softDelete(context.id);
  }

  // There was no requirement for implementation of unsibscribing or showing
  // the list of current subsribers of a user in the tech assignment. This is
  // what you get.

  async subscribeMeTo(context: JwtContextType, userPublicTag: string) {
    console.log(context, userPublicTag);

    if (context.publicTag === userPublicTag) {
      throw new HttpException(
        `Can't subscribe to yourself!`,
        HttpStatus.CONFLICT,
      );
    }

    const currentUser = await this.usersRepository.findOne({
      where: { id: context.id },
      relations: { subscriptions: true },
    });

    const userToSubscribe = await this.usersRepository.findOne({
      where: { publicTag: userPublicTag },
    });

    if (!userToSubscribe) {
      throw new HttpException(
        `No such user for subscription found! :: ${userPublicTag}`,
        HttpStatus.NOT_FOUND,
      );
    }

    const isAlreadySubscribed = !!currentUser.subscriptions.find(
      (u) => u.publicTag === userPublicTag,
    );

    if (isAlreadySubscribed) {
      throw new HttpException(`Already subscribed!`, HttpStatus.CONFLICT);
    }

    currentUser.subscriptions.push(userToSubscribe);

    await currentUser.save();
  }

  async createUser(
    publicTag: string,
    displayName: string,
    password: string,
  ): Promise<UsersEntity | undefined> {
    const candidate = await this.usersRepository.findOne({
      where: { publicTag: publicTag },
    });

    if (candidate) {
      throw new HttpException(`Such user already exists`, HttpStatus.CONFLICT);
    }

    const newUser = this.usersRepository.create({
      publicTag,
      displayName,
      passwordHash: Utils.Crypto.hashify(password),
    });

    return await this.usersRepository.save(newUser);
  }

  async loginUser(
    publicTag: string,
    password: string,
  ): Promise<UsersEntity | undefined> {
    return await this.usersRepository.findOne({
      where: {
        publicTag: publicTag,
        passwordHash: Utils.Crypto.hashify(password),
      },
    });
  }
}
