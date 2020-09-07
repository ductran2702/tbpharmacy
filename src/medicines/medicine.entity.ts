import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MedicineStatus } from './medicine-status.enum';

@Entity()
export class Medicine extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  status: MedicineStatus;
}
