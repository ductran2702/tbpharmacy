import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger, Req, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MedicinesService } from './medicine.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
//import { MedicineStatusValidationPipe } from './pipes/medicine-status-validation.pipe';
import { GetMedicinesFilterDto } from './dto/get-medicines-filter.dto';
import { Medicine } from './medicine.entity';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/constants';
import { Roles } from '../common/decorator/roles.decorator';

@Controller('medicines')
@ApiTags('Medicine')
@UseGuards(AuthGuard(), RolesGuard)
@ApiBearerAuth()
export class MedicinesController {
  private logger = new Logger('MedicinesController');

  constructor(private medicinesService: MedicinesService) {}

  @Get()
  getMedicines(
    @Query() filterDto: GetMedicinesFilterDto,
  ): Promise<Medicine[]> {
    //this.logger.verbose(`User "${user.username}" retrieving all medicines. Filters: ${JSON.stringify(filterDto)}`);
    return this.medicinesService.getMedicines(filterDto)
  }

  @Get('/:id')
  getMedicineById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Medicine> {
    return this.medicinesService.getMedicineById(id, user);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  createMedicine(
    @Body() createMedicineDto: CreateMedicineDto,
    //@GetUser() user: User,
    @Request() req,
  ): Promise<Medicine> {
    this.logger.verbose(`User "${req.user.username}" creating a new medicine. Data: ${JSON.stringify(createMedicineDto)}`);
    return this.medicinesService.createMedicine(createMedicineDto, req.user);
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN)
  deleteMedicine(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.medicinesService.deleteMedicine(id, user);
  }

  @Patch('/:id/status')
  updateMedicineStatus(
    @Param('id', ParseIntPipe) id: number,
    //@Body('status', MedicineStatusValidationPipe) status: MedicineStatus,
    @Body() dto: UpdateMedicineDto,
    @GetUser() user: User,
  ): Promise<Medicine> {
    return this.medicinesService.updateMedicineStatus(id, dto, user);
  }
}
