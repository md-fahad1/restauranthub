import { BranchResolver } from './branch.resolver';
import { BranchService } from './branch.service';

describe('BranchResolver', () => {
  let resolver: BranchResolver;
  let service: {
    findAll: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  const RESTAURANT_ID = 'restaurant-1';
  const BRANCH_ID = 'branch-1';

  const fakeBranch = {
    id: BRANCH_ID,
    restaurantId: RESTAURANT_ID,
    name: 'Main Branch',
    address: '123 Example St',
    city: 'Dhaka',
  };

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    // Deliberately NOT using Test.createTestingModule here: BranchResolver's
    // constructor only needs BranchService, and going through Nest's DI
    // container would also try to resolve TenantGuard's dependencies
    // (because of the @UseGuards metadata), which is irrelevant to what
    // we're testing — plain method logic, not the guard pipeline itself.
    resolver = new BranchResolver(service as unknown as BranchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('branches() queries using the guard-verified tenantId, not the raw argument', async () => {
    service.findAll.mockResolvedValue([fakeBranch]);

    const result = await resolver.branches('some-other-id-a-client-could-send', RESTAURANT_ID);

    expect(service.findAll).toHaveBeenCalledWith(RESTAURANT_ID);
    expect(result).toEqual([fakeBranch]);
  });

  it('branch() looks up a single branch via tenantId', async () => {
    service.findOne.mockResolvedValue(fakeBranch);

    const result = await resolver.branch('ignored', BRANCH_ID, RESTAURANT_ID);

    expect(service.findOne).toHaveBeenCalledWith(RESTAURANT_ID, BRANCH_ID);
    expect(result).toEqual(fakeBranch);
  });

  it('createBranch() forces restaurantId to the guard-verified tenantId', async () => {
    service.create.mockResolvedValue(fakeBranch);

    await resolver.createBranch(
      { restaurantId: 'spoofed-id', name: 'Main Branch', address: '123 Example St', city: 'Dhaka' },
      RESTAURANT_ID,
    );

    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining({ restaurantId: RESTAURANT_ID, name: 'Main Branch' }),
    );
  });

  it('updateBranch() forces restaurantId to the guard-verified tenantId', async () => {
    service.update.mockResolvedValue({ ...fakeBranch, name: 'Renamed' });

    await resolver.updateBranch({ restaurantId: 'spoofed-id', branchId: BRANCH_ID, name: 'Renamed' }, RESTAURANT_ID);

    expect(service.update).toHaveBeenCalledWith(
      expect.objectContaining({ restaurantId: RESTAURANT_ID, branchId: BRANCH_ID, name: 'Renamed' }),
    );
  });

  it('deleteBranch() calls remove with tenantId, not the raw argument', async () => {
    service.remove.mockResolvedValue(true);

    const result = await resolver.deleteBranch('ignored', BRANCH_ID, RESTAURANT_ID);

    expect(service.remove).toHaveBeenCalledWith(RESTAURANT_ID, BRANCH_ID);
    expect(result).toBe(true);
  });
});