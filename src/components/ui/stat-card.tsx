import { ReactNode } from "react";
import { Card, CardContent } from "./card";
import { cn, layoutClasses } from "@/lib/styles";

export function StatCard({
  title,
  value,
  icon,
  color = "text-gray-600",
  className,
}: {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <Card className={cn("glass shadow-sm", className)} hover>
      <CardContent className="text-center py-6">
        {icon && (
          <div className={cn("flex justify-center mb-3", color)}>{icon}</div>
        )}
        <div className={cn("text-3xl font-bold mb-2", color)}>{value}</div>
        <div className={layoutClasses.text.muted}>{title}</div>
      </CardContent>
    </Card>
  );
}

export function StatGrid({
  stats,
  className,
}: {
  stats: Array<{
    title: string;
    value: string | number;
    icon?: ReactNode;
    color?: string;
  }>;
  className?: string;
}) {
  return (
    <div className={cn(layoutClasses.grid.stats, className)}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
