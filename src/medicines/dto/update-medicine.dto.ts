import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MedicineStatus } from 'src/common/constants';

export class UpdateMedicineDto {
    @ApiProperty({ type: 'enum', enum: MedicineStatus })
    readonly status: MedicineStatus;
}
