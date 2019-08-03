import {
  Entity, Unique, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn,
  UpdateDateColumn, BeforeInsert,
} from 'typeorm';

import { hash } from 'bcrypt';


@Entity()
@Unique(['email'])
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 255 })
  email!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('text')
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
