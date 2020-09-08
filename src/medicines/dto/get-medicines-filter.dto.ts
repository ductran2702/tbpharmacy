import { MedicineStatus } from '../medicine-status.enum';
import { IsOptional, IsIn, IsNotEmpty, Max, Min, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetMedicinesFilterDto {
  @IsOptional()
  //@IsIn([MedicineStatus.NEW, MedicineStatus.AVAILABLE, MedicineStatus.OUT])
  @ApiPropertyOptional()
  status: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  search: string;

  @ApiPropertyOptional({ default: 1 })
  readonly page: number;

  @ApiPropertyOptional({ default: 10 })
  readonly limit: number;
}
