/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import {
  IsString, MinLength, MaxLength,
} from 'class-validator';
import { UserEntity } from '../user';


@Entity()
class Residence extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 255 })
  @IsString()
  @MinLength(2, { message: 'Necessário um nome.' })
  @MaxLength(255, { message: 'Nome muito grande.' })
  name!: string;

  @OneToMany(() => UserEntity, user => user.residence, {
    eager: true,
    onDelete: 'RESTRICT',
    nullable: false,
  })
  users!: UserEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


export = Residence;
