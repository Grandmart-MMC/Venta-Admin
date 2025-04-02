import { useState } from "react";
import apiClient from "../ApiClient";
import { LoginError, LoginRequest, LoginResponse } from "../types/loginType";
import { toast } from "react-toastify";

export const loginApi = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const { data } = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    // Token saxlamaq
    // localStorage.setItem("authToken", data.token);
    document.cookie = `auth-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`;
    return data;
  } catch (error: unknown) {
    console.error("Login error:", error);

    const errorMessage =
      (error as LoginError).response?.data || "Failed to login";
    const statusCode = (error as LoginError).response?.status;

    throw {
      message: errorMessage,
      statusCode: statusCode,
    };
  }
};
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    statusCode?: number;
  } | null>(null);
  const [data, setData] = useState<LoginResponse | null>(null);

  const mutate = async (
    credentials: LoginRequest,
    options?: {
      onSuccess?: (data: LoginResponse) => void;
      onError?: (error: { message: string; statusCode?: number }) => void;
    }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginApi(credentials);
      setData(response);

      if (options?.onSuccess) {
        options.onSuccess(response);
      }

      return response;
    } catch (err: unknown) {
      const errorObj = {
        message:
          (err as { message: string; statusCode?: number }).message ||
          "Login failed",
        statusCode: (err as { message: string; statusCode?: number })
          .statusCode,
      };

      setError(errorObj);
      toast.error(errorObj.message);

      if (options?.onError) {
        options.onError(errorObj);
      }

      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isPending: isLoading,
    error,
    data,
  };
};
