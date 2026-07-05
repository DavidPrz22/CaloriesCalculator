export interface User {
  id: number;
  username: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
}

export interface SignupResponse {
  message: string;
  user: User;
  accessToken: string;
}


export interface LogoutResponse {
  message: string;
}

export interface RefreshResponse {
  message: string;
  user: User;
  accessToken: string;
}

export interface JwtPayload {
  id: number;
  username: string;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
}
