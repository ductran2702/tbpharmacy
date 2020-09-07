import { Module } from '@nestjs/common';
import { MedicinesController } from './medicines.controller';
import { MedicinesService } from './medicines.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicineRepository } from './medicine.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicineRepository]),
  ],
  controllers: [MedicinesController],
  providers: [MedicinesService],
})
export class MedicinesModule {
}
