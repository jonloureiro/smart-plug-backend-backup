import {
  Entity, Unique, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn,
  UpdateDateColumn, BeforeInsert,
} from 'typeorm';
import {
  IsEmail, IsString, MinLength, MaxLength,
} from 'class-validator';


import { hash } from 'bcrypt';


@Entity()
@Unique(['email'])
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 255 })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email!: string;

  @Column('varchar', { length: 255 })
  @IsString()
  @MinLength(1, { message: 'Necessário um nome.' })
  @MaxLength(255, { message: 'Nome muito grande.' })
  name!: string;

  @Column('varchar', { length: 255 })
  @IsString()
  @MinLength(6, { message: 'Senha muito pequena.' })
  @MaxLength(255, { message: 'Senha muito grande.' })
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  private async encryptPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }
}


export = User;
