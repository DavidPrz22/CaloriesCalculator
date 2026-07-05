import { apiClient } from "@/api";
import { apiRequest } from "@/lib/api-error";
import type { User, LoginResponse, RefreshResponse, SignupResponse, LogoutResponse} from "../types/types";
import type { UserAuthSchemaType } from "../schemas/schemas";

export async function login(data: UserAuthSchemaType): Promise<LoginResponse> {
  return apiRequest(apiClient.post<LoginResponse>("/api/users/login", data), "login");
}

export async function signup(data: UserAuthSchemaType): Promise<SignupResponse> {
  return apiRequest(apiClient.post<SignupResponse>("/api/users/signup", data), "signup");
}

export async function getProfile(): Promise<User> {
  return apiRequest(apiClient.get<User>("/api/users/profile"), "getProfile");
}

export async function logout(): Promise<LogoutResponse> {
  return apiRequest(apiClient.post<LogoutResponse>("/api/users/logout"), "logout");
}

export async function refreshAccessToken(): Promise<RefreshResponse> {
  return apiRequest(apiClient.post<RefreshResponse>("/api/users/refresh-token"), "refreshAccessToken");
}

export async function refreshProfile(): Promise<RefreshResponse> {
  return apiRequest(apiClient.post<RefreshResponse>("/api/users/profile"), "refreshProfile");
}

