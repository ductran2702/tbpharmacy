import { MedicineStatus } from '../medicine-status.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetMedicinesFilterDto {
  @IsOptional()
  @IsIn([MedicineStatus.NEW, MedicineStatus.AVAILABLE, MedicineStatus.OUT])
  @ApiProperty()
  status: MedicineStatus;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  search: string;
}
