import { gql } from '@apollo/client';

export const CREATE_RESTAURANT_MUTATION = gql`
  mutation CreateRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      restaurant {
        id
        name
        slug
        currency
        timezone
      }
      accessToken
      refreshToken
      user {
        id
        firstName
        lastName
        email
        roles
      }
    }
  }
`;

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  currency: string;
  timezone: string;
}

export interface CreateRestaurantPayload {
  restaurant: Restaurant;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
  };
}

export const GET_ADMIN_RESTAURANTS_QUERY = gql`
  query AdminRestaurants {
    restaurants {
      id
      name
      slug
      email
      phone
      currency
      timezone
      status
      branchCount
      createdAt
      owner {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export interface AdminRestaurant {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  currency: string;
  timezone: string;
  status: string;
  branchCount: number;
  createdAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface GetAdminRestaurantsData {
  restaurants: AdminRestaurant[];
}