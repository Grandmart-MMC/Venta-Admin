"use client";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import apiClient from "../ApiClient";
import { toast } from "react-toastify";
import { InquiryResponseData } from "../types/inquiriesType";

// Define interface for query parameters
export interface InquiriesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
  priority?: number;
  startDate?: string;
  endDate?: string;
}

interface InquiriesHookReturn {
  data: InquiryResponseData | null;
  isLoading: boolean;
  error: { message: string } | null;
  refetch: () => void;
}

// API function that accepts query parameters
const getInquiriesApi = async (
  params: InquiriesQueryParams = {}
): Promise<InquiryResponseData> => {
  console.log("params", params);
  try {
    // Convert params object to URL parameters
    const queryParams = new URLSearchParams();

    // Only add parameters that have values
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("pageSize", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.status !== undefined)
      queryParams.append("status", params.status.toString());
    if (params.priority !== undefined)
      queryParams.append("priority", params.priority.toString());
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    // Make the API request with query parameters
    const { data } = await apiClient.get(`/contact/panel?${queryParams}`);

    // If the response doesn't include totalCount in meta, try to estimate it
    if (!data.meta?.totalCount && Array.isArray(data.data)) {
      // If this is the first page and less than the limit, we know the total count
      if (params.page === 1 && data.data.length < (params.limit ?? 10)) {
        data.meta = { ...data.meta, totalCount: data.data.length };
      } else {
        // Otherwise, set a reasonable default (current page * limit + some extra)
        const estimatedTotal = (params.page || 1) * (params.limit || 10) + 10;
        data.meta = { ...data.meta, totalCount: estimatedTotal };
      }
    }

    return data;
  } catch (error) {
    console.error("Get inquiries error:", error);

    const axiosError = error as AxiosError;
    const errorMessage = axiosError.response?.data || "Failed to get inquiries";
    const statusCode = axiosError.response?.status;
    throw {
      message: errorMessage,
      statusCode: statusCode,
    };
  }
};

// Hook that accepts and uses query parameters
export const useGetInquiries = (
  params: InquiriesQueryParams = {}
): InquiriesHookReturn => {
  const [data, setData] = useState<InquiryResponseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ message: string } | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getInquiriesApi(params);
      setData(result);
    } catch (err) {
      const errorObj = err as { message: string };
      setError(errorObj);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when the component mounts or when params change
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]); 

  // Function to manually refetch data
  const refetch = () => {
    fetchData();
  };

  return { data, isLoading, error, refetch };
};

// Update inquiry function without React Query
export interface UpdateInquiryPayload {
  id: number | string;
  status: number;
  priority: number;
  notes: string;
}

export const useUpdateInquiry = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateInquiry = async (
    data: UpdateInquiryPayload
  ): Promise<InquiryResponseData> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.put(`/contact/panel/${data.id}`, {
        status: data.status,
        priority: data.priority,
        notes: data.notes,
      });

      toast.success(response.data.message || "Müraciət uğurla yeniləndi");
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      const message =
        axiosError.response?.data || "Müraciəti yeniləmək mümkün olmadı";
      const errorMsg = typeof message === "string" ? message : "Xəta baş verdi";

      toast.error(errorMsg);
      setError(errorMsg);
      setIsLoading(false);
      console.error("Update inquiry error:", err);
      throw err;
    }
  };

  return { updateInquiry, isLoading, error };
};
