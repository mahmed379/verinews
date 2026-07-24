import apiClient from "./client";

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    is_staff: boolean;
    is_superuser: boolean;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}


export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/auth-token/",
    {
      username,
      password,
    }
  );

  return response.data;
}


export async function register(
  data: {
    username: string;
    email: string;
    password: string;
  }
): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register/",
    data
  );

  return response.data;
}


export async function getMe(): Promise<User> {
  const response = await apiClient.get<User>(
    "/users/me/"
  );

  return response.data;
}


export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout/");
}