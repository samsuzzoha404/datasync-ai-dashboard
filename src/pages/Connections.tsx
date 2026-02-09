import { useState } from "react";
import { Mail, Server, KeyRound, Plus, Trash2, CheckCircle2, XCircle, Settings2, Eye, EyeOff, Loader2, Wifi, FolderOpen } from "lucide-react";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { sftpServers as initialSftpServers, decryptionPatterns } from "@/lib/mockData";
import { toast } from "@/hooks/use-toast";

export default function Connections() {
  const [emailConfig, setEmailConfig] = useState({
    host: "imap.gmail.com",
    port: "993",
    email: "datasync@company.my",
    password: "myapppassword123",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [connectionSuccess, setConnectionSuccess] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; bank: string }>({ open: false, id: "", bank: "" });
  const [servers, setServers] = useState(initialSftpServers);
  const [addServerDialog, setAddServerDialog] = useState(false);
  const [newServer, setNewServer] = useState({ bank: "", host: "", port: "22", remotePath: "/incoming/data" });

  const handleSaveEmail = () => {
    toast({
      title: "Email configuration saved",
      description: "Email listener will reconnect with new settings.",
    });
  };

  const handleTestConnection = async (serverId: string) => {
    setTestingConnection(serverId);
    setConnectionSuccess(null);
    
    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setTestingConnection(null);
    setConnectionSuccess(serverId);
    
    toast({
      title: "Connection successful",
      description: "SFTP server is reachable and authenticated.",
    });
    
    // Clear success after 3 seconds
    setTimeout(() => setConnectionSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Connection Manager</h1>
        <p className="text-sm text-muted-foreground">
          Configure your data sources and decryption rules.
        </p>
      </div>

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="bg-muted/50 w-full sm:w-auto flex-wrap h-auto p-1">
          <TabsTrigger value="email" className="gap-2 text-xs sm:text-sm">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="sftp" className="gap-2 text-xs sm:text-sm">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">SFTP Servers</span>
          </TabsTrigger>
          <TabsTrigger value="decrypt" className="gap-2 text-xs sm:text-sm">
            <KeyRound className="h-4 w-4" />
            <span className="hidden sm:inline">Decryption</span>
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
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    value={emailConfig.port}
                    onChange={(e) => setEmailConfig({ ...emailConfig, port: e.target.value })}
                    placeholder="993"
                    className="font-mono text-sm"
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
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">App Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={emailConfig.password}
                      onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
                      placeholder="••••••••••••••••"
                      className="pr-10 font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
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
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">SFTP Servers</CardTitle>
                <CardDescription>
                  Manage your SFTP connections to bank servers.
                </CardDescription>
              </div>
              <Button size="sm" className="gap-2 w-full sm:w-auto" onClick={() => setAddServerDialog(true)}>
                <Plus className="h-4 w-4" />
                Add Server
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {servers.map((server) => (
                  <div
                    key={server.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-secondary p-2 flex-shrink-0">
                        <Server className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
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
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                          {server.host}:{server.port} • Last sync: {server.lastSync}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-1.5"
                        disabled={testingConnection === server.id}
                        onClick={() => handleTestConnection(server.id)}
                      >
                        {testingConnection === server.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : connectionSuccess === server.id ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <Wifi className="h-3.5 w-3.5" />
                        )}
                        <span className="hidden sm:inline">
                          {connectionSuccess === server.id ? "Success" : "Test"}
                        </span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteDialog({ open: true, id: server.id, bank: server.bank })}>
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
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Decryption Logic</CardTitle>
                <CardDescription>
                  Define password patterns for encrypted ZIP files from each bank.
                </CardDescription>
              </div>
              <Button size="sm" className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Add Pattern
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {decryptionPatterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-secondary p-2 flex-shrink-0">
                        <KeyRound className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
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
                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, id: "", bank: "" })}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Connection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the <strong>{deleteDialog.bank}</strong> SFTP connection? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: "", bank: "" })}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                setServers((prev) => prev.filter((s) => s.id !== deleteDialog.id));
                setDeleteDialog({ open: false, id: "", bank: "" });
                toast({ title: "Connection deleted", description: `${deleteDialog.bank} server has been removed.` });
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Server Dialog */}
      <Dialog open={addServerDialog} onOpenChange={setAddServerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add SFTP Server</DialogTitle>
            <DialogDescription>Configure a new SFTP connection to a bank server.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Input value={newServer.bank} onChange={(e) => setNewServer((p) => ({ ...p, bank: e.target.value }))} placeholder="e.g. Public Bank" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <Label>Host</Label>
                <Input value={newServer.host} onChange={(e) => setNewServer((p) => ({ ...p, host: e.target.value }))} placeholder="sftp.bank.com.my" className="font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Port</Label>
                <Input value={newServer.port} onChange={(e) => setNewServer((p) => ({ ...p, port: e.target.value }))} placeholder="22" className="font-mono text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <FolderOpen className="h-3.5 w-3.5" /> Remote Folder Path <span className="text-error">*</span>
              </Label>
              <Input value={newServer.remotePath} onChange={(e) => setNewServer((p) => ({ ...p, remotePath: e.target.value }))} placeholder="/incoming/data" className="font-mono text-sm" />
              <p className="text-xs text-muted-foreground">The directory on the remote server where files are uploaded.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddServerDialog(false)}>Cancel</Button>
            <Button
              disabled={!newServer.bank.trim() || !newServer.host.trim() || !newServer.remotePath.trim()}
              onClick={() => {
                setServers((prev) => [...prev, {
                  id: Date.now().toString(),
                  bank: newServer.bank,
                  host: newServer.host,
                  port: parseInt(newServer.port) || 22,
                  status: "disconnected" as const,
                  lastSync: "Never",
                }]);
                setNewServer({ bank: "", host: "", port: "22", remotePath: "/incoming/data" });
                setAddServerDialog(false);
                toast({ title: "Server added", description: `${newServer.bank} SFTP server has been configured.` });
              }}
            >
              Add Server
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
