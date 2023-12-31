import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersEntity } from '../users/entities/users.entity';
import { VirtuesModule } from '../virtues/virtues.module';
import { VirtuesEntity } from '../virtues/entities/virtues.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      synchronize: true,
      entities: [UsersEntity, VirtuesEntity],
    }),
    AuthModule,
    UsersModule,
    VirtuesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
