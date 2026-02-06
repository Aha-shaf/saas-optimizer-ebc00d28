import { Header } from '@/components/layout';
import { useAuditLogs } from '@/hooks/useApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Search, Download, Filter, Check, X, FileText, Edit, Upload, Shield,
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const actionIcons: Record<string, React.ReactNode> = {
  APPROVE_RECOMMENDATION: <Check className="w-4 h-4 text-success" />,
  REJECT_RECOMMENDATION: <X className="w-4 h-4 text-danger" />,
  CREATE_APP: <Upload className="w-4 h-4 text-primary" />,
  UPDATE_APP: <Edit className="w-4 h-4 text-warning" />,
  DELETE_APP: <X className="w-4 h-4 text-danger" />,
  LOGIN: <Shield className="w-4 h-4 text-info" />,
  LOGOUT: <Shield className="w-4 h-4 text-muted-foreground" />,
};

const actionLabels: Record<string, string> = {
  APPROVE_RECOMMENDATION: 'Approved Recommendation',
  REJECT_RECOMMENDATION: 'Rejected Recommendation',
  CREATE_APP: 'Created Application',
  UPDATE_APP: 'Updated Application',
  DELETE_APP: 'Deleted Application',
  LOGIN: 'User Login',
  LOGOUT: 'User Logout',
};

export default function AuditLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = useAuditLogs({ limit: 50 });

  const logs = data?.logs || [];

  const filteredLogs = logs.filter((log: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (log.userName || '').toLowerCase().includes(searchLower) ||
      (log.action || '').toLowerCase().includes(searchLower) ||
      JSON.stringify(log.details || {}).toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header title="Audit Log" subtitle="Loading..." />
        <div className="p-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Audit Log"
        subtitle="Track all actions and changes across your organization"
      />

      <div className="p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Actions</p>
                  <p className="text-2xl font-bold text-foreground">{data?.total || logs.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Logins</p>
              <p className="text-2xl font-bold text-success">
                {logs.filter((l: any) => l.action === 'LOGIN').length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">App Changes</p>
              <p className="text-2xl font-bold text-warning">
                {logs.filter((l: any) => ['CREATE_APP', 'UPDATE_APP', 'DELETE_APP'].includes(l.action)).length}
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Recommendations</p>
              <p className="text-2xl font-bold text-foreground">
                {logs.filter((l: any) => ['APPROVE_RECOMMENDATION', 'REJECT_RECOMMENDATION'].includes(l.action)).length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search logs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button>
            <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px]">Timestamp</TableHead>
                  <TableHead className="w-[180px]">User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-muted-foreground">
                        {log.createdAt ? format(new Date(log.createdAt), 'MMM d, yyyy HH:mm') : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                            {(log.userName || 'U').split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <span className="font-medium text-foreground">{log.userName || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center bg-secondary">
                            {actionIcons[log.action] || <FileText className="w-4 h-4" />}
                          </div>
                          <Badge variant="secondary">
                            {actionLabels[log.action] || log.action}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                        {log.details ? Object.entries(log.details).map(([key, value]) => `${key}: ${value}`).join(' • ') : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
