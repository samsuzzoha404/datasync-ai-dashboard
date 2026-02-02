import { useState } from "react";
import { Mail, Server, KeyRound, Plus, Trash2, CheckCircle2, XCircle, Settings2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sftpServers, decryptionPatterns } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";

export default function Connections() {
  const [emailConfig, setEmailConfig] = useState({
    host: "imap.gmail.com",
    port: "993",
    email: "datasync@company.my",
    password: "",
  });

  const handleSaveEmail = () => {
    toast({
      title: "Email configuration saved",
      description: "Email listener will reconnect with new settings.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Connection Manager</h1>
        <p className="text-muted-foreground">
          Configure your data sources and decryption rules.
        </p>
      </div>

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="sftp" className="gap-2">
            <Server className="h-4 w-4" />
            SFTP Servers
          </TabsTrigger>
          <TabsTrigger value="decrypt" className="gap-2">
            <KeyRound className="h-4 w-4" />
            Decryption
          </TabsTrigger>
        </TabsList>

        {/* Email Configuration */}
        <TabsContent value="email">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Email Configuration</CardTitle>
              <CardDescription>
                Configure IMAP settings to automatically fetch attachments from your mailbox.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="host">IMAP Host</Label>
                  <Input
                    id="host"
                    value={emailConfig.host}
                    onChange={(e) => setEmailConfig({ ...emailConfig, host: e.target.value })}
                    placeholder="imap.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    value={emailConfig.port}
                    onChange={(e) => setEmailConfig({ ...emailConfig, port: e.target.value })}
                    placeholder="993"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailConfig.email}
                    onChange={(e) => setEmailConfig({ ...emailConfig, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">App Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={emailConfig.password}
                    onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
                    placeholder="••••••••••••••••"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveEmail}>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SFTP Servers */}
        <TabsContent value="sftp">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">SFTP Servers</CardTitle>
                <CardDescription>
                  Manage your SFTP connections to bank servers.
                </CardDescription>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Server
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sftpServers.map((server) => (
                  <div
                    key={server.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-secondary p-2">
                        <Server className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{server.bank}</p>
                          <Badge
                            variant="outline"
                            className={
                              server.status === "connected"
                                ? "bg-success/10 text-success border-success/30"
                                : "bg-error/10 text-error border-error/30"
                            }
                          >
                            {server.status === "connected" ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {server.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {server.host}:{server.port} • Last sync: {server.lastSync}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decryption Patterns */}
        <TabsContent value="decrypt">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Decryption Logic</CardTitle>
                <CardDescription>
                  Define password patterns for encrypted ZIP files from each bank.
                </CardDescription>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Pattern
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {decryptionPatterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-secondary p-2">
                        <KeyRound className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{pattern.bank}</p>
                          <Badge
                            variant="outline"
                            className={
                              pattern.status === "active"
                                ? "bg-success/10 text-success border-success/30"
                                : "bg-warning/10 text-warning border-warning/30"
                            }
                          >
                            {pattern.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Pattern: {pattern.pattern}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          Example: {pattern.example}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Pattern Form */}
              <div className="mt-6 rounded-lg border-2 border-dashed p-4">
                <p className="text-sm font-medium mb-4">Quick Add Pattern</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Bank</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cimb">CIMB</SelectItem>
                        <SelectItem value="maybank">Maybank</SelectItem>
                        <SelectItem value="rhb">RHB</SelectItem>
                        <SelectItem value="publicbank">Public Bank</SelectItem>
                        <SelectItem value="ambank">AmBank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pattern Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agency-date">AgencyCode + Date</SelectItem>
                        <SelectItem value="fixed">Fixed PIN</SelectItem>
                        <SelectItem value="account-month">AccountID + Month</SelectItem>
                        <SelectItem value="custom">Custom Pattern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">Add Pattern</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
