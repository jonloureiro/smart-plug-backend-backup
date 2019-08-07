/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Entity, Unique, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn,
  UpdateDateColumn, BeforeInsert, ManyToOne,
} from 'typeorm';
import {
  IsEmail, IsString, MinLength, MaxLength,
} from 'class-validator';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secret, expiresIn } from '../../config';
import { ResidenceEntity } from '../residence';


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
  @MinLength(2, { message: 'Necessário um nome.' })
  @MaxLength(255, { message: 'Nome muito grande.' })
  name!: string;

  @Column('varchar', { length: 255 })
  @IsString()
  @MinLength(6, { message: 'Senha muito pequena.' })
  @MaxLength(255, { message: 'Senha muito grande.' })
  password!: string;

  @ManyToOne(() => ResidenceEntity, residence => residence.users, {
    onDelete: 'SET NULL',
  })
  residence?: ResidenceEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  private async encryptPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }

  async checkPassword(password: string): Promise<boolean> {
    const checkPassword = await compare(password, this.password);
    return checkPassword;
  }

  generateToken(): string {
    return jwt.sign({ id: this.id }, secret, { expiresIn });
  }

  static checkToken(token: string): string | object {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return 'Acesso negado';
    }
  }
}


export = User;
