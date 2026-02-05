import { useState, useMemo } from 'react';
import { Header } from '@/components/layout';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SaaSApplication, SaaSCategory } from '@/types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const categories: SaaSCategory[] = [
  'CRM',
  'Project Management',
  'Communication',
  'HR & Payroll',
  'Finance & Accounting',
  'Marketing',
  'Engineering',
  'Security',
  'Analytics',
  'Productivity',
  'Other',
];

const statusColors = {
  active: 'bg-success/20 text-success',
  inactive: 'bg-muted text-muted-foreground',
  pending_review: 'bg-warning/20 text-warning',
};

export default function Inventory() {
  const { saasApps, deleteSaaSApp, addSaaSApp } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newApp, setNewApp] = useState({
    name: '',
    category: 'Productivity' as SaaSCategory,
    vendor: '',
    licenses_purchased: 0,
    cost_per_license: 0,
    billing_cycle: 'monthly' as const,
    renewal_date: '',
    owner_department: '',
  });

  const filteredApps = useMemo(() => {
    return saasApps.filter((app) => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [saasApps, searchQuery, categoryFilter, statusFilter]);

  const totalSpend = filteredApps.reduce(
    (sum, app) => sum + app.licenses_purchased * app.cost_per_license,
    0
  );

  const totalLicenses = filteredApps.reduce((sum, app) => sum + app.licenses_purchased, 0);
  const usedLicenses = filteredApps.reduce((sum, app) => sum + app.licenses_used, 0);

  const handleAddApp = () => {
    const app: SaaSApplication = {
      id: `app-${Date.now()}`,
      ...newApp,
      licenses_used: 0,
      contract_start_date: new Date().toISOString(),
      contract_end_date: newApp.renewal_date,
      status: 'active',
      organization_id: 'org-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addSaaSApp(app);
    setIsAddDialogOpen(false);
    setNewApp({
      name: '',
      category: 'Productivity',
      vendor: '',
      licenses_purchased: 0,
      cost_per_license: 0,
      billing_cycle: 'monthly',
      renewal_date: '',
      owner_department: '',
    });
  };

  return (
    <div className="min-h-screen">
      <Header
        title="SaaS Inventory"
        subtitle={`${saasApps.length} applications • $${totalSpend.toLocaleString()}/mo total spend`}
      />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Apps</p>
              <p className="text-2xl font-bold text-foreground">{filteredApps.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Monthly Spend</p>
              <p className="text-2xl font-bold text-foreground">${totalSpend.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Licenses</p>
              <p className="text-2xl font-bold text-foreground">{totalLicenses.toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Utilization Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {totalLicenses > 0 ? Math.round((usedLicenses / totalLicenses) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Application
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add SaaS Application</DialogTitle>
                  <DialogDescription>
                    Add a new application to your SaaS inventory
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newApp.name}
                      onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="vendor" className="text-right">
                      Vendor
                    </Label>
                    <Input
                      id="vendor"
                      value={newApp.vendor}
                      onChange={(e) => setNewApp({ ...newApp, vendor: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select
                      value={newApp.category}
                      onValueChange={(value: SaaSCategory) =>
                        setNewApp({ ...newApp, category: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="licenses" className="text-right">
                      Licenses
                    </Label>
                    <Input
                      id="licenses"
                      type="number"
                      value={newApp.licenses_purchased}
                      onChange={(e) =>
                        setNewApp({ ...newApp, licenses_purchased: parseInt(e.target.value) || 0 })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right">
                      Cost/License
                    </Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={newApp.cost_per_license}
                      onChange={(e) =>
                        setNewApp({ ...newApp, cost_per_license: parseFloat(e.target.value) || 0 })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Department
                    </Label>
                    <Input
                      id="department"
                      value={newApp.owner_department}
                      onChange={(e) => setNewApp({ ...newApp, owner_department: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="renewal" className="text-right">
                      Renewal Date
                    </Label>
                    <Input
                      id="renewal"
                      type="date"
                      value={newApp.renewal_date}
                      onChange={(e) => setNewApp({ ...newApp, renewal_date: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddApp} disabled={!newApp.name}>
                    Add Application
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[250px]">Application</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Licenses</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Monthly Cost</TableHead>
                  <TableHead>Renewal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No applications found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApps.map((app) => {
                    const utilization = Math.round((app.licenses_used / app.licenses_purchased) * 100);
                    const monthlyCost = app.licenses_purchased * app.cost_per_license;

                    return (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold">
                              {app.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{app.name}</p>
                              <p className="text-xs text-muted-foreground">{app.vendor}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{app.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-foreground">{app.licenses_used}</span>
                          <span className="text-muted-foreground"> / {app.licenses_purchased}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  utilization >= 80
                                    ? 'bg-success'
                                    : utilization >= 50
                                    ? 'bg-warning'
                                    : 'bg-danger'
                                }`}
                                style={{ width: `${Math.min(utilization, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{utilization}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${monthlyCost.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(app.renewal_date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[app.status]}>
                            {app.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteSaaSApp(app.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
