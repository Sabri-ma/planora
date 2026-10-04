import api from "./api";

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password2: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export async function login(data: LoginData) {
  const response = await api.post("/auth/login/", data);

  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);

  return response.data;
}

export async function register(data: RegisterData) {
  const response = await api.post("/auth/register/", data);

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get("/auth/me/");

  return response.data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}