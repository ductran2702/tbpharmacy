import { EntityRepository, Repository } from 'typeorm';
import { Medicine } from './medicine.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { MedicineStatus } from './medicine-status.enum';
import { GetMedicinesFilterDto } from './dto/get-medicines-filter.dto';

@EntityRepository(Medicine)
export class MedicineRepository extends Repository<Medicine> {
  async getMedicines(filterDTO: GetMedicinesFilterDto): Promise<Medicine[]> {
    const { status, search } = filterDTO;
    const query = this.createQueryBuilder('medicine');

    if (status) {
      query.andWhere('medicine.status = :status', { status });
    }

    if (search) {
      query.andWhere('(medicine.name LIKE :search OR medicine.description LIKE :search)', { search: `%${search}%` });
    }

    return await query.getMany();
  }

  async createMedicine(createMedicineDTO: CreateMedicineDto): Promise<Medicine> {
    const { name, description } = createMedicineDTO;

    const medicine = new Medicine();
    medicine.name = name;
    medicine.description = description;
    medicine.status = MedicineStatus.NEW;
    await medicine.save();

    return medicine;
  }
}
