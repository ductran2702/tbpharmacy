import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { User } from '../auth/user.entity';
import { MedicineStatus } from 'src/common/constants';

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

  @ManyToOne(type => User, user => user.medicines, { eager: false })
  user: User;

  @Column()
  userId: number;
}
