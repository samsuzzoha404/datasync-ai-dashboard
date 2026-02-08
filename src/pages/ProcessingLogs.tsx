import { Mail, Server, Upload, CheckCircle2, Loader2, XCircle, ExternalLink, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMockData } from "@/contexts/MockDataContext";
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

export default function ProcessingLogs() {
  const { activities } = useMockData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Processing Logs</h1>
        <p className="text-sm text-muted-foreground">
          View all file processing events and statuses.
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">All Processing Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">File Name</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Source</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground text-right font-mono">Rows</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Timestamp</th>
                  <th className="pb-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => {
                  const SourceIcon = sourceIcons[activity.source];
                  const status = statusConfig[activity.status];
                  const StatusIcon = status.icon;

                  return (
                    <tr key={activity.id} className="border-b last:border-0 hover:bg-accent/50 transition-colors">
                      <td className="py-3 pr-4">
                        <span className="font-medium truncate block max-w-[200px]">{activity.fileName}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="rounded-lg bg-secondary p-1.5 w-fit">
                          <SourceIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-right font-mono text-muted-foreground">
                        {activity.rows > 0 ? activity.rows.toLocaleString() : "—"}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="outline" className={cn("gap-1", status.className)}>
                          <StatusIcon className={cn("h-3 w-3", activity.status === "processing" && "animate-spin")} />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground text-xs">{activity.timestamp}</td>
                      <td className="py-3">
                        {activity.status === "completed" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => window.open("https://agency-portal.com", "_blank")}
                              >
                                <ExternalLink className="h-4 w-4 text-primary" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Open in Agency Portal</TooltipContent>
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
