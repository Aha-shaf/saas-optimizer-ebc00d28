const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(token: string) {
    return this.request<any>('/auth/me', { token });
  }

  async logout(token: string) {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
      token,
    });
  }

  // Users
  async getUsers(token: string) {
    return this.request<any[]>('/users', { token });
  }

  async createUser(token: string, data: any) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateUser(token: string, id: string, data: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteUser(token: string, id: string) {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // SaaS Apps
  async getApps(token: string, params?: { category?: string; status?: string; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return this.request<any[]>(`/apps${query ? `?${query}` : ''}`, { token });
  }

  async getApp(token: string, id: string) {
    return this.request<any>(`/apps/${id}`, { token });
  }

  async createApp(token: string, data: any) {
    return this.request<any>('/apps', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateApp(token: string, id: string, data: any) {
    return this.request<any>(`/apps/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteApp(token: string, id: string) {
    return this.request<{ message: string }>(`/apps/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Licenses
  async getLicensesByApp(token: string, appId: string) {
    return this.request<any[]>(`/licenses/app/${appId}`, { token });
  }

  async getUnusedLicenses(token: string) {
    return this.request<any[]>('/licenses/unused', { token });
  }

  async createLicense(token: string, data: any) {
    return this.request<any>('/licenses', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteLicense(token: string, id: string) {
    return this.request<{ message: string }>(`/licenses/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Recommendations
  async getRecommendations(token: string, params?: { status?: string; type?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.type) searchParams.set('type', params.type);

    const query = searchParams.toString();
    return this.request<any[]>(`/recommendations${query ? `?${query}` : ''}`, { token });
  }

  async getRecommendation(token: string, id: string) {
    return this.request<any>(`/recommendations/${id}`, { token });
  }

  async approveRecommendation(token: string, id: string, reason?: string) {
    return this.request<any>(`/recommendations/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
      token,
    });
  }

  async rejectRecommendation(token: string, id: string, reason?: string) {
    return this.request<any>(`/recommendations/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
      token,
    });
  }

  async implementRecommendation(token: string, id: string) {
    return this.request<any>(`/recommendations/${id}/implement`, {
      method: 'POST',
      token,
    });
  }

  // Dashboard
  async getDashboardMetrics(token: string) {
    return this.request<any>('/dashboard/metrics', { token });
  }

  async getSpendByCategory(token: string) {
    return this.request<any[]>('/dashboard/spend-by-category', { token });
  }

  async getSpendTrend(token: string) {
    return this.request<any[]>('/dashboard/spend-trend', { token });
  }

  async getRenewals(token: string) {
    return this.request<any[]>('/dashboard/renewals', { token });
  }

  // Audit Logs
  async getAuditLogs(token: string, params?: { entityType?: string; action?: string; limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.entityType) searchParams.set('entityType', params.entityType);
    if (params?.action) searchParams.set('action', params.action);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());

    const query = searchParams.toString();
    return this.request<{ logs: any[]; total: number }>(`/audit${query ? `?${query}` : ''}`, { token });
  }

  async getEntityAuditLogs(token: string, type: string, id: string) {
    return this.request<any[]>(`/audit/entity/${type}/${id}`, { token });
  }
}

export const apiClient = new ApiClient(API_URL);
