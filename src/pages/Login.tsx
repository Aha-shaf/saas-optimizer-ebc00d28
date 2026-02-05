import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingDown, Chrome, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('sarah.chen@acme.com');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email);
    navigate('/');
  };

  const handleSSOLogin = async () => {
    await login('sarah.chen@acme.com', 'admin');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-background to-background p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary">
            <TrendingDown className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <span className="text-xl font-bold text-foreground">CostOptimize</span>
            <p className="text-sm text-muted-foreground">SaaS Intelligence Platform</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold text-foreground leading-tight">
            Reduce your SaaS spend by{' '}
            <span className="gradient-text">30%</span> or more
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Automatically discover, analyze, and optimize your organization's
            SaaS portfolio. Save money without impacting productivity.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-6">
            {[
              { value: '$2.4M+', label: 'Saved for customers' },
              { value: '1,200+', label: 'Apps analyzed' },
              { value: '98%', label: 'Customer satisfaction' },
              { value: '15 min', label: 'Average setup time' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-lg bg-card/50 border border-border">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-sm text-muted-foreground">
          Trusted by leading enterprises worldwide
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to your account to continue
            </p>
          </div>

          {/* SSO Button */}
          <Button
            variant="outline"
            className="w-full h-12 gap-3"
            onClick={handleSSOLogin}
            disabled={isLoading}
          >
            <Chrome className="w-5 h-5" />
            Continue with Google Workspace
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                defaultValue="password"
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
            <Lock className="w-4 h-4" />
            Protected by enterprise-grade security
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button className="text-primary hover:underline font-medium">
              Request access
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
