import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MedicineStatus } from './medicine-status.enum';
import { User } from '../auth/user.entity';

@Entity()
export class Medicine extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: MedicineStatus;

  @ManyToOne(type => User, user => user.medicines, { eager: false })
  user: User;

  @Column()
  userId: number;
}
