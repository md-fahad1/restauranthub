import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchRepository } from './branch.repository';

describe('BranchService', () => {
  let service: BranchService;
  let repository: {
    findAllByRestaurant: jest.Mock;
    findByIdAndRestaurant: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    softDelete: jest.Mock;
  };

  const RESTAURANT_ID = 'restaurant-1';
  const BRANCH_ID = 'branch-1';
  const OTHER_RESTAURANT_ID = 'restaurant-2';

  const fakeBranch = {
    id: BRANCH_ID,
    restaurantId: RESTAURANT_ID,
    name: 'Main Branch',
    address: '123 Example St',
    city: 'Dhaka',
    phone: null,
    email: null,
    postalCode: null,
    latitude: null,
    longitude: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    repository = {
      findAllByRestaurant: jest.fn(),
      findByIdAndRestaurant: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [BranchService, { provide: BranchRepository, useValue: repository }],
    }).compile();

    service = module.get(BranchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('delegates straight to the repository for the given restaurant', async () => {
      repository.findAllByRestaurant.mockResolvedValue([fakeBranch]);

      const result = await service.findAll(RESTAURANT_ID);

      expect(repository.findAllByRestaurant).toHaveBeenCalledWith(RESTAURANT_ID);
      expect(result).toEqual([fakeBranch]);
    });
  });

  describe('findOne', () => {
    it('returns the branch when it belongs to the restaurant', async () => {
      repository.findByIdAndRestaurant.mockResolvedValue(fakeBranch);

      const result = await service.findOne(RESTAURANT_ID, BRANCH_ID);

      expect(repository.findByIdAndRestaurant).toHaveBeenCalledWith(BRANCH_ID, RESTAURANT_ID);
      expect(result).toEqual(fakeBranch);
    });

    it('throws NotFoundException when the branch does not exist for that restaurant', async () => {
      repository.findByIdAndRestaurant.mockResolvedValue(null);

      await expect(service.findOne(OTHER_RESTAURANT_ID, BRANCH_ID)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('passes restaurantId and the rest of the input through to the repository', async () => {
      repository.create.mockResolvedValue(fakeBranch);

      const result = await service.create({
        restaurantId: RESTAURANT_ID,
        name: 'Main Branch',
        address: '123 Example St',
        city: 'Dhaka',
      });

      expect(repository.create).toHaveBeenCalledWith({
        restaurantId: RESTAURANT_ID,
        name: 'Main Branch',
        address: '123 Example St',
        city: 'Dhaka',
      });
      expect(result).toEqual(fakeBranch);
    });
  });

  describe('update', () => {
    it('verifies ownership before updating', async () => {
      repository.findByIdAndRestaurant.mockResolvedValue(fakeBranch);
      repository.update.mockResolvedValue({ ...fakeBranch, name: 'Renamed Branch' });

      const result = await service.update({
        restaurantId: RESTAURANT_ID,
        branchId: BRANCH_ID,
        name: 'Renamed Branch',
      });

      expect(repository.findByIdAndRestaurant).toHaveBeenCalledWith(BRANCH_ID, RESTAURANT_ID);
      expect(repository.update).toHaveBeenCalledWith(BRANCH_ID, { name: 'Renamed Branch' });
      expect(result.name).toBe('Renamed Branch');
    });

    it('refuses to update a branch belonging to a different restaurant', async () => {
      repository.findByIdAndRestaurant.mockResolvedValue(null);

      await expect(
        service.update({ restaurantId: OTHER_RESTAURANT_ID, branchId: BRANCH_ID, name: 'Hijacked' }),
      ).rejects.toThrow(NotFoundException);

      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('soft-deletes after verifying ownership', async () => {
      repository.findByIdAndRestaurant.mockResolvedValue(fakeBranch);
      repository.softDelete.mockResolvedValue({ ...fakeBranch, deletedAt: new Date() });

      const result = await service.remove(RESTAURANT_ID, BRANCH_ID);

      expect(repository.softDelete).toHaveBeenCalledWith(BRANCH_ID);
      expect(result).toBe(true);
    });

    it('refuses to delete a branch belonging to a different restaurant', async () => {
      repository.findByIdAndRestaurant.mockResolvedValue(null);

      await expect(service.remove(OTHER_RESTAURANT_ID, BRANCH_ID)).rejects.toThrow(NotFoundException);
      expect(repository.softDelete).not.toHaveBeenCalled();
    });
  });
});