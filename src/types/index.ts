// Core domain types for SaaS Cost Optimizer

export type UserRole = 'admin' | 'finance' | 'app_owner';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  organization_id: string;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  created_at: string;
}

export type SaaSCategory = 
  | 'CRM'
  | 'Project Management'
  | 'Communication'
  | 'HR & Payroll'
  | 'Finance & Accounting'
  | 'Marketing'
  | 'Engineering'
  | 'Security'
  | 'Analytics'
  | 'Productivity'
  | 'Other';

export interface SaaSApplication {
  id: string;
  name: string;
  logo?: string;
  category: SaaSCategory;
  vendor: string;
  licenses_purchased: number;
  licenses_used: number;
  cost_per_license: number;
  billing_cycle: 'monthly' | 'annual';
  renewal_date: string;
  owner_department: string;
  owner_user_id?: string;
  contract_start_date: string;
  contract_end_date: string;
  status: 'active' | 'inactive' | 'pending_review';
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface License {
  id: string;
  saas_app_id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  assigned_date: string;
  last_active_date: string | null;
  monthly_active_days: number;
  status: 'active' | 'inactive' | 'pending';
}

export interface UsageMetric {
  id: string;
  saas_app_id: string;
  month: string; // YYYY-MM format
  active_users: number;
  total_licenses: number;
  utilization_rate: number;
  total_logins: number;
  avg_session_duration: number; // minutes
}

export type RecommendationType = 
  | 'reclaim_license'
  | 'downgrade_plan'
  | 'consolidate_tools'
  | 'renegotiate_contract'
  | 'terminate_subscription';

export type RecommendationStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'implemented';

export type ImpactLevel = 'low' | 'medium' | 'high';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  saas_app_id: string;
  saas_app_name: string;
  title: string;
  description: string;
  estimated_monthly_savings: number;
  estimated_annual_savings: number;
  affected_users: number;
  affected_teams: string[];
  impact_level: ImpactLevel;
  confidence_level: ConfidenceLevel;
  status: RecommendationStatus;
  created_at: string;
  updated_at: string;
}

export interface Approval {
  id: string;
  recommendation_id: string;
  approved_by_user_id: string;
  approved_by_name: string;
  action: 'approved' | 'rejected';
  reason?: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  entity_type: 'saas_app' | 'license' | 'recommendation' | 'user' | 'organization';
  entity_id: string;
  details: Record<string, unknown>;
  ip_address?: string;
  timestamp: string;
}

// Dashboard metrics
export interface DashboardMetrics {
  total_saas_spend: number;
  monthly_spend_trend: number; // percentage change
  total_apps: number;
  active_users: number;
  unused_licenses: number;
  potential_savings: number;
  upcoming_renewals: number;
  optimization_score: number; // 0-100
}

export interface SpendByCategory {
  category: SaaSCategory;
  spend: number;
  apps_count: number;
}

export interface MonthlySpend {
  month: string;
  spend: number;
  savings: number;
}
