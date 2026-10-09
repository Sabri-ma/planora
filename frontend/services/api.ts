import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
});

let isRefreshing = false;

let refreshSubscribers: Array<
  (accessToken: string) => void
> = [];

function subscribeTokenRefresh(
  callback: (accessToken: string) => void
) {
  refreshSubscribers.push(callback);
}

function notifySubscribers(
  accessToken: string
) {
  refreshSubscribers.forEach(
    (callback) => callback(accessToken)
  );

  refreshSubscribers = [];
}

function clearAuth() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig
  ) => {
    if (typeof window !== "undefined") {
      const accessToken =
        localStorage.getItem("access");

      if (accessToken) {
        config.headers.Authorization =
          `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,

  async (
    error: AxiosError
  ) => {
    const originalRequest =
      error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

    if (
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    const refreshToken =
      localStorage.getItem("refresh");

    if (!refreshToken) {
      clearAuth();

      window.location.href = "/login";

      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh(
          (newAccessToken) => {
            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }

            originalRequest.headers.Authorization =
              `Bearer ${newAccessToken}`;

            resolve(
              api(originalRequest)
            );
          }
        );
      });
    }

    isRefreshing = true;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/token/refresh/`,
        {
          refresh: refreshToken,
        }
      );

      const newAccessToken =
        response.data.access;

      localStorage.setItem(
        "access",
        newAccessToken
      );

      notifySubscribers(
        newAccessToken
      );

      if (!originalRequest.headers) {
        originalRequest.headers = {};
      }

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAuth();

      window.location.href = "/login";

      return Promise.reject(
        refreshError
      );
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;