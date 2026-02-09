import { FileText, Rows3, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useMockData } from "@/contexts/MockDataContext";
import { SparklineChart } from "./SparklineChart";

export function StatsGrid() {
  const { stats, agents } = useMockData();

  const statItems = [
    {
      name: "Files Today",
      value: stats.filesToday,
      subValue: `${stats.filesMonth.toLocaleString()} this month`,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
      showChart: true,
      chartData: stats.weeklyTrend,
      chartColor: "hsl(var(--primary))",
      trend: "↗ 12% vs yesterday",
      trendPositive: true,
    },
    {
      name: "Rows Standardized",
      value: stats.rowsStandardized.toLocaleString(),
      subValue: `${stats.successRate}% success rate`,
      icon: Rows3,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      name: "Man-Hours Saved",
      value: `${stats.manHoursSaved} hrs`,
      subValue: "Compared to manual entry",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      highlight: true,
    },
    {
      name: "Active Agents",
      value: stats.activeAgents,
      subValue: `${agents.email ? 'Email' : ''}${agents.email && agents.sftp ? ' + ' : ''}${agents.sftp ? 'SFTP' : ''} running`,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card
          key={stat.name}
          className={`shadow-card hover:shadow-elevated transition-shadow ${
            stat.highlight ? "ring-2 ring-warning/20" : ""
          }`}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight font-mono">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.subValue}</p>
                {stat.trend && (
                  <p className={`mt-0.5 text-xs font-medium ${stat.trendPositive ? "text-success" : "text-error"}`}>
                    {stat.trend}
                  </p>
                )}
              </div>
              <div className={`rounded-lg p-2.5 ${stat.bgColor} flex-shrink-0`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            {stat.showChart && stat.chartData && (
              <div className="mt-3 -mx-1">
                <SparklineChart data={stat.chartData} color={stat.chartColor} height={32} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
