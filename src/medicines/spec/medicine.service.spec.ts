
import { Test } from '@nestjs/testing';
import { MedicinesService } from '../medicine.service';
import { MedicineRepository } from '../medicine.repository';
import { GetMedicinesFilterDto } from '../dto/get-medicines-filter.dto';
import { MedicineStatus } from '../medicine-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 12, username: 'Test user' };

const mockMedicineRepository = () => ({
  getMedicines: jest.fn(),
  findOne: jest.fn(),
  createMedicine: jest.fn(),
  delete: jest.fn(),
});

describe('MedicinesService', () => {
  let medicinesService;
  let medicineRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MedicinesService,
        { provide: MedicineRepository, useFactory: mockMedicineRepository },
      ],
    }).compile();

    medicinesService = await module.get<MedicinesService>(MedicinesService);
    medicineRepository = await module.get<MedicineRepository>(MedicineRepository);
  });

  describe('getMedicines', () => {
    it('gets all medicines from the repository', async () => {
      medicineRepository.getMedicines.mockResolvedValue('someValue');

      expect(medicineRepository.getMedicines).not.toHaveBeenCalled();
      const filters: GetMedicinesFilterDto = { status: MedicineStatus.AVAILABLE, search: 'Some search query', page:1, limit:10 };
      const result = await medicinesService.getMedicines(filters, mockUser);
      expect(medicineRepository.getMedicines).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getMedicineById', () => {
    it('calls medicineRepository.findOne() and succesffuly retrieve and return the medicine', async () => {
      const mockMedicine = { name: 'Test medicine', description: 'Test desc' };
      medicineRepository.findOne.mockResolvedValue(mockMedicine);

      const result = await medicinesService.getMedicineById(1, mockUser);
      expect(result).toEqual(mockMedicine);

      expect(medicineRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
    });

    it('throws an error as medicine is not found', () => {
      medicineRepository.findOne.mockResolvedValue(null);
      expect(medicinesService.getMedicineById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createMedicine', () => {
    it('calls medicineRepository.create() and returns the result', async () => {
      medicineRepository.createMedicine.mockResolvedValue('someMedicine');

      expect(medicineRepository.createMedicine).not.toHaveBeenCalled();
      const createMedicineDto = { name: 'Test medicine', description: 'Test desc' };
      const result = await medicinesService.createMedicine(createMedicineDto, mockUser);
      expect(medicineRepository.createMedicine).toHaveBeenCalledWith(createMedicineDto, mockUser);
      expect(result).toEqual('someMedicine');
    });
  });

  describe('deleteMedicine', () => {
    it('calls medicineRepository.deleteMedicine() to delete a medicine', async () => {
      medicineRepository.delete.mockResolvedValue({ affected: 1 });
      expect(medicineRepository.delete).not.toHaveBeenCalled();
      await medicinesService.deleteMedicine(1, mockUser);
      expect(medicineRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
    });

    it('throws an error as medicine could not be found', () => {
      medicineRepository.delete.mockResolvedValue({ affected: 0 });
      expect(medicinesService.deleteMedicine(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMedicineStatus', () => {
    it('updates a medicine status', async () => {
      const save = jest.fn().mockResolvedValue(true);

      medicinesService.getMedicineById = jest.fn().mockResolvedValue({
        status: MedicineStatus.NEW,
        save,
      });

      expect(medicinesService.getMedicineById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const updateMedicineDto = { status: MedicineStatus.OUT };
      const result = await medicinesService.updateMedicineStatus(1, updateMedicineDto, mockUser);
      expect(medicinesService.getMedicineById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(MedicineStatus.OUT);
    });
  });
});