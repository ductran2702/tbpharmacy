import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { GetMedicinesFilterDto } from './dto/get-medicines-filter.dto';
import { MedicineRepository } from './medicine.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Medicine } from './medicine.entity';
import { User } from '../auth/user.entity';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { AdvancedConsoleLogger } from 'typeorm';

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
  ): Promise<Medicine> {
    const found = await this.medicineRepository.findOne({ where: { id } });
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
      throw new NotFoundException(`Medicine with ID "${id}" not found or you cannot delete this medicine (only owner can delete it)`);
    }
  }

  async updateMedicineStatus(
    id: number,
    dto: UpdateMedicineDto,
  ): Promise<Medicine> {
    const medicine = await this.getMedicineById(id);
    medicine.status = dto.status;
    await medicine.save();
    return medicine;
  }
}
