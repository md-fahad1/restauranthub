import { gql } from '@apollo/client';
export const GET_ME_QUERY = gql`
  query Me {
    me {
      id
      firstName
      lastName
      email
      phone
      avatar
      status
      emailVerifiedAt
      lastLoginAt
      createdAt
      updatedAt
    }
  }
`;

export interface Me {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  status: string;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MeData {
  me: Me;
}

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      firstName
      lastName
      email
      phone
      status
      createdAt
      
    }
  }
`;