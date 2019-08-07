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
      nullable: false,
    },
  )
  admin!: UserEntity;

  @OneToMany(
    (): ObjectType<UserEntity> => UserEntity,
    (user): Residence | undefined => user.residence,
    {
      eager: true,
      onDelete: 'RESTRICT',
      nullable: false,
    },
  )
  users!: UserEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  private async hashingName(): Promise<void> {
    const hash = await hashVerified(this.name);
    this.name = `${this.name}#${hash}`;
  }
}


export = Residence;
