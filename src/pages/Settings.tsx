import { ArrowRight, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aiMappings, auditLogs } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const logLevelConfig = {
  error: {
    icon: AlertCircle,
    className: "text-error bg-error/10",
  },
  warning: {
    icon: AlertTriangle,
    className: "text-warning bg-warning/10",
  },
  success: {
    icon: CheckCircle2,
    className: "text-success bg-success/10",
  },
  info: {
    icon: Info,
    className: "text-primary bg-primary/10",
  },
};

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings & Logs</h1>
        <p className="text-muted-foreground">
          Configure AI mapping rules and view system logs.
        </p>
      </div>

      <Tabs defaultValue="mapping" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="mapping">AI Mapping Rules</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>

        {/* AI Mapping Rules */}
        <TabsContent value="mapping">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Column Mapping Intelligence</CardTitle>
              <CardDescription>
                AI-powered field recognition and standardization rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiMappings.map((mapping, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="rounded-md bg-muted px-3 py-1.5 font-mono text-sm">
                          {mapping.input}
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="rounded-md bg-primary/10 text-primary px-3 py-1.5 font-mono text-sm">
                          {mapping.output}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="w-24">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Confidence</span>
                          <span className="text-xs font-medium">{mapping.confidence}%</span>
                        </div>
                        <Progress value={mapping.confidence} className="h-1.5" />
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          mapping.confidence >= 95
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-warning/10 text-warning border-warning/30"
                        )}
                      >
                        {mapping.confidence >= 95 ? "High" : "Medium"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>How it works:</strong> The AI engine analyzes column headers and data
                  patterns from incoming Excel files to automatically map them to your
                  standardized schema. Confidence scores indicate the reliability of each mapping.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs */}
        <TabsContent value="logs">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">System Audit Logs</CardTitle>
              <CardDescription>
                Detailed logs of all processing events and errors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditLogs.map((log) => {
                  const config = logLevelConfig[log.level];
                  const Icon = config.icon;

                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                    >
                      <div className={cn("rounded-lg p-1.5", config.className)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs text-muted-foreground font-mono">
                            {log.timestamp}
                          </span>
                          <Badge variant="outline" className="text-2xs py-0">
                            {log.source}
                          </Badge>
                        </div>
                        <p className="text-sm">{log.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-center">
                <Badge variant="outline" className="text-muted-foreground">
                  Showing latest 5 entries
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
