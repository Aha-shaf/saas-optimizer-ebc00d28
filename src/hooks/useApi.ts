import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

// Helper to get token from localStorage (when using real backend)
const getToken = () => localStorage.getItem('auth_token') || '';

// Dashboard hooks
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: () => apiClient.getDashboardMetrics(getToken()),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useSpendByCategory() {
  return useQuery({
    queryKey: ['dashboard', 'spend-by-category'],
    queryFn: () => apiClient.getSpendByCategory(getToken()),
    staleTime: 60 * 1000,
  });
}

export function useSpendTrend() {
  return useQuery({
    queryKey: ['dashboard', 'spend-trend'],
    queryFn: () => apiClient.getSpendTrend(getToken()),
    staleTime: 60 * 1000,
  });
}

export function useRenewals() {
  return useQuery({
    queryKey: ['dashboard', 'renewals'],
    queryFn: () => apiClient.getRenewals(getToken()),
    staleTime: 60 * 1000,
  });
}

// Apps hooks
export function useApps(params?: { category?: string; status?: string; search?: string }) {
  return useQuery({
    queryKey: ['apps', params],
    queryFn: () => apiClient.getApps(getToken(), params),
  });
}

export function useApp(id: string) {
  return useQuery({
    queryKey: ['apps', id],
    queryFn: () => apiClient.getApp(getToken(), id),
    enabled: !!id,
  });
}

export function useCreateApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.createApp(getToken(), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.updateApp(getToken(), id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.invalidateQueries({ queryKey: ['apps', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteApp(getToken(), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Recommendations hooks
export function useRecommendations(params?: { status?: string; type?: string }) {
  return useQuery({
    queryKey: ['recommendations', params],
    queryFn: () => apiClient.getRecommendations(getToken(), params),
  });
}

export function useRecommendation(id: string) {
  return useQuery({
    queryKey: ['recommendations', id],
    queryFn: () => apiClient.getRecommendation(getToken(), id),
    enabled: !!id,
  });
}

export function useApproveRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      apiClient.approveRecommendation(getToken(), id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useRejectRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      apiClient.rejectRecommendation(getToken(), id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
}

export function useImplementRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.implementRecommendation(getToken(), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Users hooks
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getUsers(getToken()),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.createUser(getToken(), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.updateUser(getToken(), id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteUser(getToken(), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Licenses hooks
export function useLicenses(appId: string) {
  return useQuery({
    queryKey: ['licenses', appId],
    queryFn: () => apiClient.getLicensesByApp(getToken(), appId),
    enabled: !!appId,
  });
}

export function useUnusedLicenses() {
  return useQuery({
    queryKey: ['licenses', 'unused'],
    queryFn: () => apiClient.getUnusedLicenses(getToken()),
  });
}

export function useCreateLicense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.createLicense(getToken(), data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['licenses', data.saasAppId] });
      queryClient.invalidateQueries({ queryKey: ['apps'] });
    },
  });
}

export function useDeleteLicense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteLicense(getToken(), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
      queryClient.invalidateQueries({ queryKey: ['apps'] });
    },
  });
}

// Audit logs hooks
export function useAuditLogs(params?: { entityType?: string; action?: string; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => apiClient.getAuditLogs(getToken(), params),
  });
}

export function useEntityAuditLogs(type: string, id: string) {
  return useQuery({
    queryKey: ['audit-logs', type, id],
    queryFn: () => apiClient.getEntityAuditLogs(getToken(), type, id),
    enabled: !!type && !!id,
  });
}
