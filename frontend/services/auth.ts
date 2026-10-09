import api from "./api";

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

function saveTokens(tokens: AuthTokens) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    "access",
    tokens.access
  );

  localStorage.setItem(
    "refresh",
    tokens.refresh
  );
}

export function clearTokens() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(
    localStorage.getItem("access") ||
      localStorage.getItem("refresh")
  );
}

export async function login(
  data: LoginData
): Promise<AuthTokens> {
  const response = await api.post(
    "/auth/login/",
    data
  );

  const tokens: AuthTokens = {
    access: response.data.access,
    refresh: response.data.refresh,
  };

  saveTokens(tokens);

  return tokens;
}

export async function register(
  data: RegisterData
): Promise<User> {
  const response = await api.post(
    "/auth/register/",
    data
  );

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get(
    "/auth/me/"
  );

  return response.data;
}

export function logout() {
  clearTokens();

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}