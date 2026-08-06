import { gql } from '@apollo/client';

/* ===========================
   CREATE TABLE
=========================== */

export const CREATE_TABLE_MUTATION = gql`
  mutation CreateTable($input: CreateTableInput!) {
    createTable(input: $input) {
      id
      tableNumber
      name
      capacity
      status
      location
      createdAt
      updatedAt

      branch {
        id
        name
      }
    }
  }
`;

/* ===========================
   UPDATE TABLE
=========================== */

export const UPDATE_TABLE_MUTATION = gql`
  mutation UpdateTable($input: UpdateTableInput!) {
    updateTable(input: $input) {
      id
      tableNumber
      name
      capacity
      status
      location
      updatedAt

      branch {
        id
        name
      }
    }
  }
`;

/* ===========================
   DELETE TABLE
=========================== */

export const DELETE_TABLE_MUTATION = gql`
  mutation DeleteTable($restaurantId: String!, $tableId: String!) {
    deleteTable(
      restaurantId: $restaurantId
      tableId: $tableId
    )
  }
`;

/* ===========================
   GET ALL TABLES
=========================== */

export const GET_TABLES_QUERY = gql`
  query Tables($restaurantId: String!, $branchId: String) {
    tables(
      restaurantId: $restaurantId
      branchId: $branchId
    ) {
      id
      tableNumber
      name
      capacity
      status
      location
      createdAt
      updatedAt

      branch {
        id
        name
      }
    }
  }
`;

/* ===========================
   GET SINGLE TABLE
=========================== */

export const GET_TABLE_QUERY = gql`
  query Table($restaurantId: String!, $tableId: String!) {
    table(
      restaurantId: $restaurantId
      tableId: $tableId
    ) {
      id
      tableNumber
      name
      capacity
      status
      location
      createdAt
      updatedAt

      branch {
        id
        name
      }
    }
  }
`;

/* ===========================
   TYPES
=========================== */

export interface TableBranch {
  id: string;
  name: string;
}

export interface DiningTable {
  id: string;
  tableNumber: string;
  name: string | null;
  capacity: number;
  status:
    | 'AVAILABLE'
    | 'RESERVED'
    | 'OCCUPIED'
    | 'CLEANING'
    | 'OUT_OF_SERVICE';
  location: string | null;
  createdAt: string;
  updatedAt: string;

  branch: TableBranch;
}

export interface GetTablesData {
  tables: DiningTable[];
}

export interface GetTableData {
  table: DiningTable;
}

export interface CreateTableInput {
  restaurantId: string;
  branchId: string;
  tableNumber: string;
  name?: string;
  capacity: number;
  location?: string;
}

export interface UpdateTableInput {
  restaurantId: string;
  tableId: string;
  branchId?: string;
  tableNumber?: string;
  name?: string;
  capacity?: number;
  location?: string;
  status?:
    | 'AVAILABLE'
    | 'RESERVED'
    | 'OCCUPIED'
    | 'CLEANING'
    | 'OUT_OF_SERVICE';
}