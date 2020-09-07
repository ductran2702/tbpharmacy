import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { Medicine } from './medicine.entity';
import { MedicineStatus } from './medicine-status.enum';
import { MedicineStatusValidationPipe } from './pipes/medicine-status-validation-pipe';
import { GetMedicinesFilterDto } from './dto/get-medicines-filter.dto';

@Controller('medicines')
export class MedicinesController {
  constructor(private medicineService: MedicinesService) {
  }

  @Get()
  getMedicines(@Query(ValidationPipe) filterDTO: GetMedicinesFilterDto): Promise<Medicine[]> {
    return this.medicineService.getMedicines(filterDTO);
  }

  @Get('/:id')
  getMedicineById(@Param('id', ParseIntPipe) id: number): Promise<Medicine> {
    return this.medicineService.getMedicineById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createMedicine(@Body() createMedicineDTO: CreateMedicineDto): Promise<Medicine> {
    return this.medicineService.createMedicine(createMedicineDTO);
  }

  @Delete('/:id')
  deleteMedicine(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.medicineService.deleteMedicine(id);
  }

  @Patch('/:id/status')
  updateMedicineStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', new MedicineStatusValidationPipe()) status: MedicineStatus,
  ): Promise<Medicine> {
    return this.medicineService.updateMedicineStatus(id, status);
  }
}
