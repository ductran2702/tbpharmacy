import { Medicine } from './medicine.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { GetMedicinesFilterDto } from './dto/get-medicines-filter.dto';
import { User } from '../auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { MedicineStatus } from 'src/common/constants';

@EntityRepository(Medicine)
export class MedicineRepository extends Repository<Medicine> {
  private logger = new Logger('MedicineRepository');

  async getMedicines(
    filterDto: GetMedicinesFilterDto,
  ): Promise<Medicine[]> {
    const { status, search, page, limit } = filterDto;
    const query = this.createQueryBuilder('medicine')
      .skip((page - 1) * limit)
      .limit(limit);

    if (status) {
      query.andWhere('medicine.status = :status', { status });
    }

    if (search) {
      query.andWhere('(medicine.name LIKE :search OR medicine.description LIKE :search)', { search: `%${search}%` });
    }

    try {
      const medicines = await query.getMany();
      return medicines;
    } catch (error) {
      this.logger.error(`Failed to get medicines. Filters: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createMedicine(
    createMedicineDto: CreateMedicineDto,
    user: User,
  ): Promise<Medicine> {
    const { name, description } = createMedicineDto;

    const medicine = new Medicine();
    medicine.name = name;
    medicine.description = description;
    medicine.status = MedicineStatus.NEW;
    medicine.user = user;

    try {
      await medicine.save();
    } catch (error) {
      this.logger.error(`Failed to create a medicine for user "${user.username}". Data: ${createMedicineDto}`, error.stack);
      throw new InternalServerErrorException();
    }

    delete medicine.user;
    return medicine;
  }
}
