import Utils from 'src/utils';

import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class UsersEntity extends Utils.DatabaseEntities.BaseEntityExtended {
  @Column({ nullable: false, unique: true })
  publicTag: string;

  @Column({ nullable: false })
  displayName: string;

  @Column({ nullable: false })
  passwordHash: string;

  @ManyToMany(() => UsersEntity)
  @JoinTable({ name: 'subscriptions_entity' })
  subscriptions: UsersEntity[];
}
