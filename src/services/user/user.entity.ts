/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  Entity, Unique, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['email'])
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column()
  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date;
}

export = User;
