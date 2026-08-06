import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeRepository } from './employee.repository';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repository: jest.Mocked<EmployeeRepository>;

  const mockEmployee = {
    id: 'emp-1',
    employeeCode: 'EMP-JD1234',
    designation: 'Waiter',
    salary: 1200,
    hiredAt: new Date('2024-01-01'),
    status: 'ACTIVE',
    user: { id: 'user-1', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', phone: null },
    branch: { id: 'branch-1', name: 'Main Branch' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: EmployeeRepository,
          useValue: {
            findAllByRestaurant: jest.fn(),
            findByIdAndRestaurant: jest.fn(),
            employeeCodeExists: jest.fn(),
            emailInUse: jest.fn(),
            createWithUser: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(EmployeeService);
    repository = module.get(EmployeeRepository);
  });

  describe('findAll', () => {
    it('delegates to the repository with the given restaurantId', async () => {
      repository.findAllByRestaurant.mockResolvedValue([mockEmployee as any]);

      const result = await service.findAll('restaurant-1');

      expect(repository.findAllByRestaurant).toHaveBeenCalledWith('restaurant-1');
      expect(result).toEqual([mockEmployee]);
    });
  });

  describe('findOne', () => {
    it('returns the employee when found', async () => {
      repository.findByIdAndRestaurant.mockResolvedValue(mockEmployee as any);

      const result = await service.findOne('restaurant-1', 'emp-1');

      expect(result).toEqual(mockEmployee);
    });

    it('throws NotFoundException when the employee does not belong to the restaurant', async () => {
      repository.findByIdAndRestaurant.mockResolvedValue(null);

      await expect(service.findOne('restaurant-1', 'emp-404')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const input = {
      restaurantId: 'restaurant-1',
      branchId: 'branch-1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      designation: 'Waiter',
      salary: 1200,
      hiredAt: '2024-01-01',
    };

    it('rejects when the email is already in use', async () => {
      repository.emailInUse.mockResolvedValue(true);

      await expect(service.create(input as any)).rejects.toThrow(ConflictException);
      expect(repository.createWithUser).not.toHaveBeenCalled();
    });

    it('generates a temporary password when none is provided', async () => {
      repository.emailInUse.mockResolvedValue(false);
      repository.employeeCodeExists.mockResolvedValue(false);
      repository.createWithUser.mockResolvedValue(mockEmployee as any);

      const result = await service.create(input as any);

      expect(result.employee).toEqual(mockEmployee);
      expect(result.temporaryPassword).toHaveLength(12);
    });

    it('retries employee code generation on collision', async () => {
      repository.emailInUse.mockResolvedValue(false);
      repository.employeeCodeExists.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
      repository.createWithUser.mockResolvedValue(mockEmployee as any);

      await service.create(input as any);

      expect(repository.employeeCodeExists).toHaveBeenCalledTimes(2);
    });
  });

  describe('update', () => {
    it('verifies ownership before updating', async () => {
      repository.findByIdAndRestaurant.mockResolvedValue(mockEmployee as any);
      repository.update.mockResolvedValue(mockEmployee as any);

      await service.update({ restaurantId: 'restaurant-1', employeeId: 'emp-1', designation: 'Manager' } as any);

      expect(repository.findByIdAndRestaurant).toHaveBeenCalledWith('emp-1', 'restaurant-1');
      expect(repository.update).toHaveBeenCalledWith('emp-1', { designation: 'Manager' });
    });

    it('throws when the employee does not belong to the restaurant', async () => {
      repository.findByIdAndRestaurant.mockResolvedValue(null);

      await expect(
        service.update({ restaurantId: 'restaurant-1', employeeId: 'emp-404' } as any),
      ).rejects.toThrow(NotFoundException);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('soft-deletes after confirming ownership', async () => {
      repository.findByIdAndRestaurant.mockResolvedValue(mockEmployee as any);
      repository.softDelete.mockResolvedValue(undefined as any);

      const result = await service.remove('restaurant-1', 'emp-1');

      expect(repository.softDelete).toHaveBeenCalledWith('emp-1');
      expect(result).toBe(true);
    });
  });
});