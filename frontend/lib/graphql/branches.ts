import { gql } from '@apollo/client';

export const GET_MY_RESTAURANT_QUERY = gql`
  query MyRestaurant {
    myRestaurant {
      id
      name
      branches {
        id
        name
        address
        city
        phone
        email
        createdAt
      }
    }
  }
`;

export const CREATE_BRANCH_MUTATION = gql`
  mutation CreateBranch($input: CreateBranchInput!) {
    createBranch(input: $input) {
      id
      name
      address
      city
      phone
      email
      createdAt
    }
  }
`;

export const UPDATE_BRANCH_MUTATION = gql`
  mutation UpdateBranch($id: String!, $input: UpdateBranchInput!) {
    updateBranch(id: $id, input: $input) {
      id
      name
      address
      city
      phone
      email
    }
  }
`;

export const DELETE_BRANCH_MUTATION = gql`
  mutation DeleteBranch($id: String!) {
    deleteBranch(id: $id) {
      id
    }
  }
`;

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string | null;
  email?: string | null;
  createdAt: string;
}

export interface MyRestaurant {
  id: string;
  name: string;
  branches: Branch[];
}

export interface MyRestaurantData {
  myRestaurant: MyRestaurant;
}

export interface BranchFormValues {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}