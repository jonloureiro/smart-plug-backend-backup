/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  Entity, Unique, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

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
}

export = User;
