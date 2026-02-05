import { motion } from 'framer-motion';

interface OptimizationScoreProps {
  score: number;
}

export function OptimizationScore({ score }: OptimizationScoreProps) {
  const getScoreColor = () => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
    return 'Critical';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Optimization Score</h3>
        <p className="text-sm text-muted-foreground">
          Overall SaaS efficiency rating
        </p>
      </div>
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="45"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="10"
            />
            {/* Progress circle */}
            <motion.circle
              cx="80"
              cy="80"
              r="45"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor()}`}>
              {score}
            </span>
            <span className="text-sm text-muted-foreground">{getScoreLabel()}</span>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">License Utilization</span>
          <span className="font-medium text-foreground">78%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tool Consolidation</span>
          <span className="font-medium text-foreground">65%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Contract Optimization</span>
          <span className="font-medium text-foreground">82%</span>
        </div>
      </div>
    </div>
  );
}
