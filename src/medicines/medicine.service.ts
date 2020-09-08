import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { GetMedicinesFilterDto } from './dto/get-medicines-filter.dto';
import { MedicineRepository } from './medicine.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Medicine } from './medicine.entity';
import { MedicineStatus } from './medicine-status.enum';
import { User } from '../auth/user.entity';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(MedicineRepository)
    private medicineRepository: MedicineRepository,
  ) {}

  async getMedicines(
    filterDto: GetMedicinesFilterDto,
  ): Promise<Medicine[]> {
    return this.medicineRepository.getMedicines(filterDto);
  }

  async getMedicineById(
    id: number,
    user: User,
  ): Promise<Medicine> {
    const found = await this.medicineRepository.findOne({ where: { id, userId: user.id } });

    if (!found) {
      throw new NotFoundException(`Medicine with ID "${id}" not found`);
    }

    return found;
  }

  async createMedicine(
    createMedicineDto: CreateMedicineDto,
    user: User,
  ): Promise<Medicine> {
    return this.medicineRepository.createMedicine(createMedicineDto, user);
  }

  async deleteMedicine(
    id: number,
    user: User,
  ): Promise<void> {
    const result = await this.medicineRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Medicine with ID "${id}" not found`);
    }
  }

  async updateMedicineStatus(
    id: number,
    dto: UpdateMedicineDto,
    user: User,
  ): Promise<Medicine> {
    const medicine = await this.getMedicineById(id, user);
    medicine.status = dto.status;
    await medicine.save();
    return medicine;
  }
}
