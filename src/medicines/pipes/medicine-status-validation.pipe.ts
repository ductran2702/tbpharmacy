import { PipeTransform, BadRequestException } from '@nestjs/common';
import { MedicineStatus } from 'src/common/constants';

export class MedicineStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    MedicineStatus.NEW,
    MedicineStatus.AVAILABLE,
    MedicineStatus.OUT,
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
