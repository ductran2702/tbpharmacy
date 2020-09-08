import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MedicineStatus } from '../medicine-status.enum';

export class UpdateMedicineDto {
    @ApiProperty({ type: 'enum', enum: MedicineStatus })
    readonly status: MedicineStatus;
}
