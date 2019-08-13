import {
  BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, ObjectType, Entity, Unique,
} from 'typeorm';
import { ResidenceEntity } from '../residence';

@Entity()
@Unique(['mac'])
class Mcu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 50 })
  mac!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @ManyToOne(
    (): ObjectType<ResidenceEntity> => ResidenceEntity,
    (residence): Mcu[] => residence.mcus,
    {
      onDelete: 'CASCADE',
    },
  )
  residence!: ResidenceEntity;
}


export = Mcu;
