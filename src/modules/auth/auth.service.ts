import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersEntity } from '../users/entities/users.entity';
import { LoginUserDto, RegisterUserDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import Utils from 'src/utils';
import { JwtContextType } from 'src/types/jwt-context.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async validateUser(publicTag: string, password: string): Promise<any> {
    const passwordHash = Utils.Crypto.hashify(password);

    const user = await this.usersService.getOneByPublicTag(publicTag);

    if (passwordHash === user.passwordHash) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async registerUser({ publicTag, displayName, password }: RegisterUserDto) {
    const userToRegister = await this.usersService.createUser(
      publicTag,
      displayName,
      password,
    );

    const payload = {
      id: userToRegister.id,
      publicTag: userToRegister.publicTag,
      displayName: userToRegister.displayName,
    };

    return {
      ...payload,
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async whoAmI(context: JwtContextType) {
    return context;
  }

  async loginUser({ publicTag, password }: LoginUserDto) {
    const userToLogin = await this.usersService.loginUser(publicTag, password);

    if (userToLogin) {
      const payload = {
        id: userToLogin.id,
        publicTag: userToLogin.publicTag,
        displayName: userToLogin.displayName,
      };

      return {
        ...payload,
        accessToken: this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET,
        }),
      };
    } else {
      throw new HttpException(
        `No such user! :: ${publicTag}`,
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
