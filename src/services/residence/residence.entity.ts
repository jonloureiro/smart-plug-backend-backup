import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn,
  UpdateDateColumn, OneToMany, ObjectType, Unique, BeforeInsert,
} from 'typeorm';
import { UserEntity } from '../user';
import { hashVerified } from './residence.utils';


@Entity()
@Unique(['name'])
class Residence extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 255 })
  name!: string;

  @OneToMany(
    (): ObjectType<UserEntity> => UserEntity,
    (user): Residence | undefined => user.residence,
    {
      eager: true,
      onDelete: 'RESTRICT',
    },
  )
  users!: UserEntity[];

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @BeforeInsert()
  private async hashingName(): Promise<void> {
    const hash = await hashVerified(this.name);
    this.name = `${this.name}#${hash}`;
  }

  @BeforeInsert()
  private removeSpace(): void {
    this.name = this.name.replace(/(^[\s]+|[\s]+$)/g, '');
  }

  @BeforeInsert()
  private async addingAdmin(): Promise<void> {
    const user = this.users[0];
    user.admin = true;
    await user.save();
  }
}


export = Residence;
