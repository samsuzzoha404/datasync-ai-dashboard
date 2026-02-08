import { useState } from "react";
import { ArrowRight, AlertCircle, CheckCircle2, Info, AlertTriangle, MoveRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aiMappings } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Settings() {
  const [portalUrl, setPortalUrl] = useState("https://agency-portal.com");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure general settings and AI mapping rules.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="general" className="text-xs sm:text-sm">General</TabsTrigger>
          <TabsTrigger value="mapping" className="text-xs sm:text-sm">AI Mapping Rules</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">General Configuration</CardTitle>
              <CardDescription>
                Core settings for agent behavior and integrations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2 max-w-lg">
                <Label htmlFor="portal-url">Target Agency Portal URL</Label>
                <Input
                  id="portal-url"
                  value={portalUrl}
                  onChange={(e) => setPortalUrl(e.target.value)}
                  placeholder="https://your-agency-portal.com"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the URL of your internal dashboard. The agent will redirect users here after processing.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Mapping Rules - Flow Diagram Style */}
        <TabsContent value="mapping">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Column Mapping Intelligence</CardTitle>
              <CardDescription>
                AI-powered field recognition and standardization rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Flow Diagram Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Source Column</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="h-px w-16 bg-gradient-to-r from-muted-foreground/20 via-primary/50 to-muted-foreground/20" />
                  <span className="text-2xs text-muted-foreground mx-2">AI Mapping</span>
                  <div className="h-px w-16 bg-gradient-to-r from-muted-foreground/20 via-primary/50 to-muted-foreground/20" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Target Schema</span>
                  <div className="h-3 w-3 rounded-full bg-primary/50" />
                </div>
              </div>

              <div className="space-y-3">
                {aiMappings.map((mapping, index) => (
                  <div
                    key={index}
                    className="group relative flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors overflow-hidden"
                  >
                    <div className="absolute left-1/4 right-1/4 top-1/2 h-px bg-gradient-to-r from-muted via-primary/30 to-primary/10 -translate-y-1/2 z-0" />
                    
                    <div className="flex items-center gap-4 flex-1 z-10">
                      <div className="relative">
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-muted-foreground/40" />
                        <div className="rounded-md bg-muted px-3 py-1.5 font-mono text-sm border border-muted-foreground/20">
                          {mapping.input}
                        </div>
                      </div>

                      <div className="flex-1 flex items-center justify-center gap-2">
                        <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-muted-foreground/30 to-primary/50" />
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10">
                          <MoveRight className="h-3 w-3 text-primary" />
                        </div>
                        <div className="hidden sm:block h-px flex-1 bg-gradient-to-l from-muted-foreground/30 to-primary/50" />
                      </div>

                      <div className="relative">
                        <div className="rounded-md bg-primary/10 text-primary px-3 py-1.5 font-mono text-sm border border-primary/30">
                          {mapping.output}
                        </div>
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4 z-10">
                      <div className="hidden md:block w-24">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-2xs text-muted-foreground">Confidence</span>
                          <span className="text-xs font-medium font-mono">{mapping.confidence}%</span>
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
      </Tabs>
    </div>
  );
}
