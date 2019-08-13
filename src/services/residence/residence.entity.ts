import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn,
  UpdateDateColumn, OneToMany, ObjectType, Unique, BeforeInsert,
} from 'typeorm';
import { UserEntity } from '../user';
import { hashVerified } from './residence.utils';
import { McuEntity } from '../mcu';


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
      onDelete: 'RESTRICT',
    },
  )
  users!: UserEntity[];

  @OneToMany(
    (): ObjectType<McuEntity> => McuEntity,
    (mcu): Residence | undefined => mcu.residence,
    {
      eager: true,
      onDelete: 'SET NULL',
      nullable: true,
    },
  )
  mcus!: McuEntity[];

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
