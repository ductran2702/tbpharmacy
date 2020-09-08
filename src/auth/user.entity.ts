import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Medicine } from '../medicines/medicine.entity';
import { UserRole } from 'src/common/constants';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ 
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @OneToMany(type => Medicine, medicine => medicine.user, { eager: true })
  medicines: Medicine[];

  @BeforeInsert()
  async doBeforeInsertion() {
      // const errors = validateSync(this, { validationError: { target: false } });
      // if (errors.length > 0) {
      //     throw new CustomValidationError(errors)
      // }
      this.salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, this.salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
