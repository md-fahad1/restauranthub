import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { EmployeeRepository } from './employee.repository';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  findAll(restaurantId: string) {
    return this.employeeRepository.findAllByRestaurant(restaurantId);
  }

  async findOne(restaurantId: string, employeeId: string) {
    const employee = await this.employeeRepository.findByIdAndRestaurant(employeeId, restaurantId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async create(input: CreateEmployeeInput) {
    const { restaurantId, branchId, firstName, lastName, email, phone, designation, salary, hiredAt, password } =
      input;

    if (await this.employeeRepository.emailInUse(email)) {
      throw new ConflictException('An account with this email already exists');
    }

    const employeeCode = await this.generateUniqueEmployeeCode(firstName, lastName);
    const finalPassword = password ?? this.generateTemporaryPassword();

    const employee = await this.employeeRepository.createWithUser(employeeCode, {
      restaurantId,
      branchId,
      firstName,
      lastName,
      email,
      phone,
      designation,
      salary,
      hiredAt,
      password: finalPassword,
    });

    return { employee, temporaryPassword: finalPassword };
  }

  async update(input: UpdateEmployeeInput) {
    const { restaurantId, employeeId, ...data } = input;

    await this.findOne(restaurantId, employeeId);

    return this.employeeRepository.update(employeeId, data);
  }

  async remove(restaurantId: string, employeeId: string) {
    await this.findOne(restaurantId, employeeId);
    await this.employeeRepository.softDelete(employeeId);
    return true;
  }

  // --- internals -------------------------------------------------------

  private async generateUniqueEmployeeCode(firstName: string, lastName: string): Promise<string> {
    const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
    let candidate = '';
    let attempt = 0;

    do {
      const suffix = Math.floor(1000 + Math.random() * 9000);
      candidate = `EMP-${initials}${suffix}${attempt > 0 ? `-${attempt}` : ''}`;
      attempt += 1;
    } while (await this.employeeRepository.employeeCodeExists(candidate));

    return candidate;
  }

  private generateTemporaryPassword(): string {
    return randomBytes(9).toString('base64url');
  }
}