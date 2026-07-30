import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ROLES = [
  { name: 'Super Admin', slug: 'SUPER_ADMIN', description: 'Full platform access' },
  { name: 'Restaurant Owner', slug: 'OWNER', description: 'Owns one or more restaurants' },
  { name: 'Manager', slug: 'MANAGER', description: 'Manages a restaurant or branch' },
  { name: 'Cashier', slug: 'CASHIER', description: 'Handles point-of-sale and payments' },
  { name: 'Waiter', slug: 'WAITER', description: 'Takes and serves customer orders' },
  { name: 'Kitchen Staff', slug: 'KITCHEN_STAFF', description: 'Prepares food orders' },
  { name: 'Delivery Rider', slug: 'DELIVERY_RIDER', description: 'Fulfills deliveries' },
  { name: 'Customer', slug: 'CUSTOMER', description: 'Browses menu and places orders' },
];

async function main() {
  console.log('Seeding roles...');
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: {},
      create: role,
    });
  }

  console.log('Seeding super admin...');
  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { slug: 'SUPER_ADMIN' } });

  const superAdminPassword = await bcrypt.hash('ChangeMe123!', 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@restauranthub.dev' },
    update: {},
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@restauranthub.dev',
      password: superAdminPassword,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superAdmin.id, roleId: superAdminRole.id } },
    update: {},
    create: { userId: superAdmin.id, roleId: superAdminRole.id },
  });

  console.log('Seeding a test restaurant owner + restaurant...');
  const ownerRole = await prisma.role.findUniqueOrThrow({ where: { slug: 'OWNER' } });
  const ownerPassword = await bcrypt.hash('ChangeMe123!', 12);

  const owner = await prisma.user.upsert({
    where: { email: 'owner@testrestaurant.dev' },
    update: {},
    create: {
      firstName: 'Test',
      lastName: 'Owner',
      email: 'owner@testrestaurant.dev',
      password: ownerPassword,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: owner.id, roleId: ownerRole.id } },
    update: {},
    create: { userId: owner.id, roleId: ownerRole.id },
  });

  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'test-restaurant' },
    update: {},
    create: {
      ownerId: owner.id,
      name: 'Test Restaurant',
      slug: 'test-restaurant',
      email: 'hello@testrestaurant.dev',
    },
  });

  console.log('Seeding a branch for the test restaurant...');
  await prisma.branch.upsert({
    where: { id: 'seed-branch-main' }, // stable id so re-running seed doesn't duplicate
    update: {},
    create: {
      id: 'seed-branch-main',
      restaurantId: restaurant.id,
      name: 'Main Branch',
      address: '123 Example Street',
      city: 'Dhaka',
    },
  });

  console.log('\nDone. Test credentials:');
  console.log('  Super Admin -> admin@restauranthub.dev / ChangeMe123!');
  console.log('  Owner       -> owner@testrestaurant.dev / ChangeMe123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
