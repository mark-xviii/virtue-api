import { UsersEntity } from 'src/modules/users/entities/users.entity';
import Utils from 'src/utils';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class VirtuesEntity extends Utils.DatabaseEntities.BaseEntityExtended {
  @ManyToOne(() => UsersEntity, (user) => user.virtues)
  @JoinColumn()
  user: UsersEntity;

  @Column({ nullable: false })
  text: string;
}
