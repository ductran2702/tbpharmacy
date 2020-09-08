import { Module } from '@nestjs/common';
import { MedicinesController } from './medicine.controller';
import { MedicinesService } from './medicine.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicineRepository } from './medicine.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicineRepository]),
    AuthModule,
  ],
  controllers: [MedicinesController],
  providers: [MedicinesService],
})
export class MedicinesModule {}
