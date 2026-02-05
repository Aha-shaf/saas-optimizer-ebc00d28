import { Header } from '@/components/layout';
import { StatsCard, SpendTrendChart, SpendByCategoryChart } from '@/components/dashboard';
import { mockDashboardMetrics, mockSaaSApps, mockMonthlySpend } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  PieChart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Reports() {
  const metrics = mockDashboardMetrics;
  
  // Calculate top spend apps
  const topSpendApps = [...mockSaaSApps]
    .map(app => ({
      ...app,
      totalSpend: app.licenses_purchased * app.cost_per_license,
    }))
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 5);

  // Calculate total realized savings
  const totalRealizedSavings = mockMonthlySpend.reduce((sum, m) => sum + m.savings, 0);

  return (
    <div className="min-h-screen">
      <Header
        title="Reports"
        subtitle="Financial reports and spend analytics"
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Quick Actions */}
          <div className="flex gap-4">
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Export Monthly Report
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Generate Custom Report
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Report
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              title="Total Monthly Spend"
              value={`$${metrics.total_saas_spend.toLocaleString()}`}
              change={metrics.monthly_spend_trend}
              icon={<DollarSign className="w-6 h-6" />}
              variant="primary"
            />
            <StatsCard
              title="Realized Savings (YTD)"
              value={`$${totalRealizedSavings.toLocaleString()}`}
              icon={<TrendingUp className="w-6 h-6" />}
              variant="success"
            />
            <StatsCard
              title="Projected Annual Spend"
              value={`$${(metrics.total_saas_spend * 12).toLocaleString()}`}
              icon={<Calendar className="w-6 h-6" />}
            />
            <StatsCard
              title="Cost per Employee"
              value="$185"
              change={-5.2}
              changeLabel="vs avg"
              icon={<PieChart className="w-6 h-6" />}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendTrendChart />
            <SpendByCategoryChart />
          </div>

          {/* Top Spend Table */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Top Applications by Spend</h3>
                <p className="text-sm text-muted-foreground">
                  Highest cost applications in your portfolio
                </p>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Licenses</TableHead>
                  <TableHead>Cost/License</TableHead>
                  <TableHead className="text-right">Monthly Spend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSpendApps.map((app, index) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground font-medium">
                          #{index + 1}
                        </span>
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {app.name.charAt(0)}
                        </div>
                        <span className="font-medium">{app.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{app.category}</TableCell>
                    <TableCell>{app.licenses_purchased}</TableCell>
                    <TableCell>${app.cost_per_license}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ${app.totalSpend.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
