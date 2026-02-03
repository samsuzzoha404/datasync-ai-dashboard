import { Mail, Server, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useMockData } from "@/contexts/MockDataContext";
import { useState } from "react";

export function AgentControls() {
  const { agents, toggleAgent } = useMockData();
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggleAgent = async (agent: 'email' | 'sftp') => {
    setLoading(agent);
    
    await toggleAgent(agent);
    
    setLoading(null);

    const agentName = agent === "email" ? "Email Listener" : "SFTP Connector";
    const newState = !agents[agent];

    toast({
      title: `${agentName} ${newState ? "Started" : "Stopped"}`,
      description: newState
        ? `${agentName} is now running and monitoring for new files.`
        : `${agentName} has been stopped.`,
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Agent Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Listener */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${agents.email ? "bg-primary/10" : "bg-muted"}`}>
              <Mail className={`h-5 w-5 ${agents.email ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="text-sm font-medium">Email Listener</p>
              <p className="text-xs text-muted-foreground">
                {agents.email ? (
                  <span className="flex items-center gap-1">
                    Polling imap.gmail.com
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  </span>
                ) : (
                  "Stopped"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {agents.email && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/30 hidden sm:flex">
                Running
              </Badge>
            )}
            {loading === "email" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Switch
                checked={agents.email}
                onCheckedChange={() => handleToggleAgent("email")}
              />
            )}
          </div>
        </div>

        {/* SFTP Connector */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${agents.sftp ? "bg-primary/10" : "bg-muted"}`}>
              <Server className={`h-5 w-5 ${agents.sftp ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="text-sm font-medium">SFTP Connector</p>
              <p className="text-xs text-muted-foreground">
                {agents.sftp ? (
                  <span className="flex items-center gap-1">
                    Connected to 3 servers
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  </span>
                ) : (
                  "Disconnected"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {agents.sftp && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/30 hidden sm:flex">
                Running
              </Badge>
            )}
            {loading === "sftp" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Switch
                checked={agents.sftp}
                onCheckedChange={() => handleToggleAgent("sftp")}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
