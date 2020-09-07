import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMedicineDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
