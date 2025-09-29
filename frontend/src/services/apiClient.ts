import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { config } from '../config/environment';
import { ApiResponse, ApiError } from '../types';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          const { status, data } = error.response;
          
          // Handle specific error cases
          if (status === 401) {
            // Unauthorized - token might be expired
            localStorage.removeItem('token');
            window.location.href = '/login';
            return Promise.reject(new Error('Session expired. Please login again.'));
          }
          
          if (status === 403) {
            return Promise.reject(new Error('Access denied. Insufficient permissions.'));
          }
          
          if (status === 404) {
            return Promise.reject(new Error('Resource not found.'));
          }
          
          if (status >= 500) {
            return Promise.reject(new Error('Server error. Please try again later.'));
          }
          
          // Extract error message from response
          const errorMessage = (data as any)?.message || (data as any)?.error || 'An error occurred';
          return Promise.reject(new Error(errorMessage));
        }
        
        if (error.request) {
          return Promise.reject(new Error('Network error. Please check your connection.'));
        }
        
        return Promise.reject(new Error('Request failed. Please try again.'));
      }
    );
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  public async upload<T = any>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> {
    const response = await this.instance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  }

  // Method to update auth token
  public setAuthToken(token: string): void {
    if (token) {
      this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.instance.defaults.headers.common['Authorization'];
    }
  }

  // Method to clear auth token
  public clearAuthToken(): void {
    delete this.instance.defaults.headers.common['Authorization'];
  }

  // Get raw axios instance for advanced usage
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

const apiClient = new ApiClient();
export default apiClient;
