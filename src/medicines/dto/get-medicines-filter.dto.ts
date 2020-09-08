import { IsOptional, IsIn, IsNotEmpty, Max, Min, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MedicineStatus } from 'src/common/constants';

export class GetMedicinesFilterDto {
  @IsOptional()
  //@IsIn([MedicineStatus.NEW, MedicineStatus.AVAILABLE, MedicineStatus.OUT])
  @ApiPropertyOptional()
  status: MedicineStatus;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  search: string;

  @ApiPropertyOptional({ default: 1 })
  readonly page: number;

  @ApiPropertyOptional({ default: 10 })
  readonly limit: number;
}
