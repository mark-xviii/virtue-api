import { UsersEntity } from 'src/modules/users/entities/users.entity';

export class ReturnedUserExtended extends UsersEntity {
  amISubscribed?: boolean;
}
