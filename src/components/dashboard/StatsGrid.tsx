import { FileText, Rows3, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardStats } from "@/lib/mockData";

const stats = [
  {
    name: "Files Today",
    value: dashboardStats.filesToday,
    subValue: `${dashboardStats.filesMonth} this month`,
    icon: FileText,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    name: "Rows Standardized",
    value: dashboardStats.rowsStandardized.toLocaleString(),
    subValue: `${dashboardStats.successRate}% success rate`,
    icon: Rows3,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    name: "Man-Hours Saved",
    value: `${dashboardStats.manHoursSaved} hrs`,
    subValue: "Compared to manual entry",
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
    highlight: true,
  },
  {
    name: "Active Agents",
    value: dashboardStats.activeAgents,
    subValue: "Email + SFTP running",
    icon: TrendingUp,
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

export function StatsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.name}
          className={`shadow-card hover:shadow-elevated transition-shadow ${
            stat.highlight ? "ring-2 ring-warning/20" : ""
          }`}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.subValue}</p>
              </div>
              <div className={`rounded-lg p-2.5 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
