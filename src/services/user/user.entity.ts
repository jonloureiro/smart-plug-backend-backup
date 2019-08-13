import {
  Entity, Unique, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn,
  UpdateDateColumn, BeforeInsert, ManyToOne, ObjectType, BeforeUpdate,
} from 'typeorm';
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
  email!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 255 })
  password!: string;

  @Column('bool')
  admin!: boolean;

  @ManyToOne(
    (): ObjectType<ResidenceEntity> => ResidenceEntity,
    (residence): User[] => residence.users,
    {
      onDelete: 'SET NULL',
    },
  )
  residence?: ResidenceEntity;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @BeforeInsert()
  private async encryptPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }

  @BeforeInsert()
  private setAdminFalse(): void {
    this.admin = false;
  }

  @BeforeUpdate()
  private updateAdmin(): void {
    // TODO checar se tem residence, caso não tenha, colocar admin como false
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
