import { Module } from '@nestjs/common';
import { MedicinesModule } from './medicines/medicines.module';
//import { TypeOrmModule } from '@nestjs/typeorm';
//import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    //TypeOrmModule.forRoot(typeOrmConfig),
    DatabaseModule,
    MedicinesModule,
    AuthModule,
  ],
})
export class AppModule {
}
