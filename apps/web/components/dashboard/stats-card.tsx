"use client";

import { Card, CardContent } from "@bitwork/ui/components/card";
import { cn } from "@bitwork/ui/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;

  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  color?: "default" | "primary" | "success" | "warning" | "info";
  className?: string;
}

const colorVariants = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-green-500/10 text-green-600",
  warning: "bg-yellow-500/10 text-yellow-600",
  info: "bg-blue-500/10 text-blue-600",
};

export function StatsCard({
  title,
  value,
  icon,
  trend,
  color = "default",
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground text-sm">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-3xl tracking-tight">{value}</span>
              {trend && (
                <span
                  className={cn(
                    "font-medium text-xs",
                    trend.direction === "up" && "text-green-600",
                    trend.direction === "down" && "text-red-600",
                    trend.direction === "neutral" && "text-muted-foreground"
                  )}
                >
                  {trend.direction === "up" && "↑"}
                  {trend.direction === "down" && "↓"}
                  {trend.value}
                </span>
              )}
            </div>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              colorVariants[color]
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
