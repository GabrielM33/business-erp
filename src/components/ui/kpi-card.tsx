
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, calculateProgress, formatCurrency, formatNumber, getProgressColor } from "@/lib/utils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { KpiGoal } from "@/types/kpi";

interface KpiCardProps {
  kpi: KpiGoal;
  className?: string;
  previousValue?: number;
  onClick?: () => void;
}

export function KpiCard({ kpi, className, previousValue, onClick }: KpiCardProps) {
  const progress = calculateProgress(
    kpi.currentValue,
    kpi.target.min,
    kpi.target.max
  );

  const progressColor = getProgressColor(progress);

  // Calculate percent change
  const percentChange = previousValue !== undefined && previousValue !== 0 
    ? ((kpi.currentValue - previousValue) / previousValue) * 100 
    : 0;

  const getValueDisplay = () => {
    if (kpi.unit === "$") {
      return formatCurrency(kpi.currentValue);
    }
    return formatNumber(kpi.currentValue);
  };

  const getTargetDisplay = () => {
    if (kpi.unit === "$") {
      return `${formatCurrency(kpi.target.min)} - ${formatCurrency(kpi.target.max)}`;
    }
    return `${kpi.target.min} - ${kpi.target.max}`;
  };

  return (
    <Card
      className={cn("overflow-hidden transition-all hover:shadow-md cursor-pointer", className)}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{getValueDisplay()}</div>
        <Progress
          value={progress}
          className="h-2 mt-2"
          indicatorClassName={progressColor}
        />
        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Target: {getTargetDisplay()}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </CardContent>
      {previousValue !== undefined && (
        <CardFooter className="pb-3 pt-0">
          <div className="flex items-center gap-1 text-xs">
            {percentChange > 0 ? (
              <>
                <ArrowUp className="h-3 w-3 text-success" />
                <span className="text-success">{Math.abs(percentChange).toFixed(1)}%</span>
              </>
            ) : percentChange < 0 ? (
              <>
                <ArrowDown className="h-3 w-3 text-danger" />
                <span className="text-danger">{Math.abs(percentChange).toFixed(1)}%</span>
              </>
            ) : (
              <>
                <Minus className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">0.0%</span>
              </>
            )}
            <span className="text-muted-foreground ml-1">vs previous</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
