import { Mail, Server, Upload, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { recentActivity } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const sourceIcons = {
  email: Mail,
  sftp: Server,
  upload: Upload,
};

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: "Saved",
    className: "bg-success/10 text-success border-success/30",
  },
  processing: {
    icon: Loader2,
    label: "Processing",
    className: "bg-warning/10 text-warning border-warning/30",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    className: "bg-error/10 text-error border-error/30",
  },
};

export function RecentActivity() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivity.map((activity) => {
            const SourceIcon = sourceIcons[activity.source];
            const status = statusConfig[activity.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={activity.id}
                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
              >
                <div className="rounded-lg bg-secondary p-2">
                  <SourceIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.fileName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{activity.bank}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activity.rows > 0 && (
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {activity.rows.toLocaleString()} rows
                    </span>
                  )}
                  <Badge variant="outline" className={cn("gap-1", status.className)}>
                    <StatusIcon
                      className={cn("h-3 w-3", activity.status === "processing" && "animate-spin")}
                    />
                    <span className="hidden sm:inline">{status.label}</span>
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
