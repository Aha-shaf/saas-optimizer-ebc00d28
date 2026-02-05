import { Header } from '@/components/layout';
import {
  StatsCard,
  SpendTrendChart,
  SpendByCategoryChart,
  OptimizationScore,
  UpcomingRenewals,
  RecentRecommendations,
} from '@/components/dashboard';
import { mockDashboardMetrics, mockSaaSApps } from '@/data/mockData';
import { useAuthStore } from '@/stores/authStore';
import {
  DollarSign,
  Package,
  Users,
  TrendingDown,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const metrics = mockDashboardMetrics;
  
  // Calculate redundant tools
  const categoryCount = mockSaaSApps.reduce((acc, app) => {
    acc[app.category] = (acc[app.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const redundantCategories = Object.entries(categoryCount).filter(([_, count]) => count > 1).length;

  return (
    <div className="min-h-screen">
      <Header
        title={`Welcome back, ${user?.name.split(' ')[0]}`}
        subtitle="Here's what's happening with your SaaS portfolio"
      />

      <div className="p-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Key Metrics */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total SaaS Spend"
              value={`$${metrics.total_saas_spend.toLocaleString()}`}
              change={metrics.monthly_spend_trend}
              changeLabel="vs last month"
              icon={<DollarSign className="w-6 h-6" />}
              variant="primary"
            />
            <StatsCard
              title="Total Applications"
              value={metrics.total_apps}
              icon={<Package className="w-6 h-6" />}
            />
            <StatsCard
              title="Unused Licenses"
              value={metrics.unused_licenses}
              icon={<Users className="w-6 h-6" />}
              variant="warning"
            />
            <StatsCard
              title="Potential Savings"
              value={`$${metrics.potential_savings.toLocaleString()}`}
              icon={<TrendingDown className="w-6 h-6" />}
              variant="success"
            />
          </motion.div>

          {/* Secondary Metrics */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Redundant Tool Categories"
              value={redundantCategories}
              icon={<AlertTriangle className="w-6 h-6" />}
              variant="danger"
            />
            <StatsCard
              title="Upcoming Renewals"
              value={metrics.upcoming_renewals}
              icon={<Calendar className="w-6 h-6" />}
            />
            <StatsCard
              title="Active Users"
              value={metrics.active_users}
              change={2.4}
              changeLabel="vs last month"
              icon={<Users className="w-6 h-6" />}
            />
          </motion.div>

          {/* Charts Row */}
          <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SpendTrendChart />
            </div>
            <div>
              <OptimizationScore score={metrics.optimization_score} />
            </div>
          </motion.div>

          {/* Bottom Row */}
          <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <SpendByCategoryChart />
            </div>
            <div>
              <UpcomingRenewals />
            </div>
            <div>
              <RecentRecommendations />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
