export type { TokenObtainPair, TokenRefresh } from './openapi.types';

export interface TokenObtainPairRequest {
  username: string;
  password?: string;
}

export interface TokenObtainPairResponse {
  access: string;
  refresh: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}
