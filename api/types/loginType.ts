export interface ApiResponse<T = unknown> {
    data: T | null;
    success: boolean;
    message?: string;
    status: number;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  export interface LoginResponse {
    token: string;
  }
  export interface LoginError {
    response: {
      data: string;
      status: number;
    };
  }
  