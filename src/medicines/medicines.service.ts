import { Injectable, NotFoundException } from '@nestjs/common';
import { MedicineRepository } from './medicine.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Medicine } from './medicine.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { MedicineStatus } from './medicine-status.enum';
import { GetMedicinesFilterDto } from './dto/get-medicines-filter.dto';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(MedicineRepository)
    private medicineRepository: MedicineRepository,
  ) {
  }

  async getMedicines(filterDTO: GetMedicinesFilterDto): Promise<Medicine[]> {
    return this.medicineRepository.getMedicines(filterDTO);
  }

  async getMedicineById(id: number): Promise<Medicine> {
    const found = await this.medicineRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }

    return found;
  }

  async createMedicine(createMedicineDTO: CreateMedicineDto): Promise<Medicine> {
    return this.medicineRepository.createMedicine(createMedicineDTO);
  }

  async deleteMedicine(id: number): Promise<void> {
    const result = await this.medicineRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }
  }

  async updateMedicineStatus(id: number, status: MedicineStatus): Promise<Medicine> {
    const medicine = await this.getMedicineById(id);
    medicine.status = status;
    await medicine.save();
    return medicine;
  }
}
