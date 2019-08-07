import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn,
  UpdateDateColumn, OneToMany, ObjectType,
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
}


export = Residence;
