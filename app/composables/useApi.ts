export const useApi = () => {
    const config = useRuntimeConfig();
    const { token } = useAuth();

    const baseURL = (config.public.devApiUrl as string) || "http://localhost:8000/api";

    const getHeaders = (isFormData = false): Record<string, string> => {
        const headers: Record<string, string> = {
            Accept: "application/json",
        };

        if (token.value) {
            headers["Authorization"] = `Bearer ${token.value}`;
        }

        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }

        return headers;
    };

    const apiFetch = async <T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> => {
        const isFormData = options.body instanceof FormData;
        const headers = getHeaders(isFormData);

        const response = await fetch(`${baseURL}${endpoint}`, {
            ...options,
            headers: {
                ...headers,
                ...(options.headers as Record<string, string>),
            },
        });

        if (response.status === 401) {
            navigateTo("/auth/login");
            throw new Error("Unauthorized");
        }

        const data = await response.json();

        if (!response.ok || data.status === "error") {
            throw new Error(data.message || "An error occurred");
        }

        return data as T;
    };

    const get = <T = any>(endpoint: string, params?: Record<string, any>) => {
        const filteredParams = params
            ? Object.fromEntries(
                  Object.entries(params).filter(
                      ([, v]) => v !== null && v !== undefined && v !== ""
                  )
              )
            : undefined;
        const queryString = filteredParams && Object.keys(filteredParams).length
            ? "?" + new URLSearchParams(filteredParams as Record<string, string>).toString()
            : "";
        return apiFetch<T>(`${endpoint}${queryString}`, { method: "GET" });
    };

    const post = <T = any>(endpoint: string, body?: any) => {
        return apiFetch<T>(endpoint, {
            method: "POST",
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    };

    const put = <T = any>(endpoint: string, body?: any) => {
        return apiFetch<T>(endpoint, {
            method: "PUT",
            body: body instanceof FormData ? body : JSON.stringify(body),
        });
    };

    const patch = <T = any>(endpoint: string, body?: any) => {
        return apiFetch<T>(endpoint, {
            method: "PATCH",
            body: JSON.stringify(body),
        });
    };

    const del = <T = any>(endpoint: string) => {
        return apiFetch<T>(endpoint, { method: "DELETE" });
    };

    return { get, post, put, patch, delete: del };
};
