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

export interface PasswordResetResponse {
  message: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
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
    password2: string;
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

export async function requestPasswordReset(
  email: string
): Promise<PasswordResetResponse> {
  const response = await apiClient.post<PasswordResetResponse>(
    "/auth/password-reset/",
    {
      email,
    }
  );

  return response.data;
}
export async function confirmPasswordReset(
  uid: string,
  token: string,
  password: string
): Promise<PasswordResetConfirmResponse> {
  const response =
    await apiClient.post<PasswordResetConfirmResponse>(
      "/auth/password-reset-confirm/",
      {
        uid,
        token,
        password,
      }
    );

  return response.data;
}

export interface PasswordResetConfirmResponse {
  message: string;
}