import { BadRequestException, PipeTransform } from '@nestjs/common';
import { MedicineStatus } from '../medicine-status.enum';

export class MedicineStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    MedicineStatus.NEW,
    MedicineStatus.OUT,
    MedicineStatus.AVAILABLE,
  ];

  transform(value: any): any {
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status.toUpperCase());
    return idx !== -1;
  }
}
