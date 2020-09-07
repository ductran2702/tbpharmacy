import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { MedicineStatus } from '../medicine-status.enum';

export class GetMedicinesFilterDto {
  @IsOptional()
  @IsIn([MedicineStatus.AVAILABLE, MedicineStatus.OUT, MedicineStatus.NEW])
  status: MedicineStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
