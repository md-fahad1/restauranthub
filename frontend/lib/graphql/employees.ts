import { gql } from '@apollo/client';

export const GET_EMPLOYEES_QUERY = gql`
  query Employees($restaurantId: String!) {
    employees(restaurantId: $restaurantId) {
      id
      employeeCode
      designation
      salary
      hiredAt
      status
      user {
        id
        firstName
        lastName
        email
        phone
      }
      branch {
        id
        name
      }
    }
  }
`;

export const CREATE_EMPLOYEE_MUTATION = gql`
  mutation CreateEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      temporaryPassword
      employee {
        id
        employeeCode
        designation
        salary
        hiredAt
        status
        user {
          id
          firstName
          lastName
          email
          phone
        }
        branch {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_EMPLOYEE_MUTATION = gql`
  mutation UpdateEmployee($input: UpdateEmployeeInput!) {
    updateEmployee(input: $input) {
      id
      designation
      salary
      hiredAt
      status
      branch {
        id
        name
      }
    }
  }
`;

export const REMOVE_EMPLOYEE_MUTATION = gql`
  mutation RemoveEmployee($restaurantId: String!, $employeeId: String!) {
    removeEmployee(restaurantId: $restaurantId, employeeId: $employeeId)
  }
`;

export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED' | 'TERMINATED';

export interface Employee {
  id: string;
  employeeCode: string;
  designation: string;
  salary: number;
  hiredAt: string;
  status: EmployeeStatus;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
  };
  branch: {
    id: string;
    name: string;
  };
}

export interface EmployeesData {
  employees: Employee[];
}

export interface CreateEmployeeData {
  createEmployee: {
    temporaryPassword: string;
    employee: Employee;
  };
}

export interface EmployeeFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  branchId: string;
  designation: string;
  salary: string;
  hiredAt: string;
}

export interface EmployeeEditValues {
  branchId: string;
  designation: string;
  salary: string;
  hiredAt: string;
  status: EmployeeStatus;
}