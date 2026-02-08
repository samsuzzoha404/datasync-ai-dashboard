import { useState } from "react";
import { MoveRight, Save, RotateCcw, Plus, Trash2, Pencil, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { aiMappings } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Settings() {
  // General state
  const [portalUrl, setPortalUrl] = useState("https://agency-portal.com");
  const [companyName, setCompanyName] = useState("DataSync AI Sdn Bhd");
  const [timezone, setTimezone] = useState("asia-kl");
  const [autoRetry, setAutoRetry] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [retentionDays, setRetentionDays] = useState("90");
  const [isSaving, setIsSaving] = useState(false);

  // Mapping state
  const [mappings, setMappings] = useState(aiMappings.map((m, i) => ({ ...m, id: i })));
  const [editDialog, setEditDialog] = useState<{ open: boolean; index: number | null; input: string; output: string }>({
    open: false, index: null, input: "", output: ""
  });
  const [addDialog, setAddDialog] = useState(false);
  const [newInput, setNewInput] = useState("");
  const [newOutput, setNewOutput] = useState("");

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSaving(false);
    toast.success("Settings saved successfully.");
  };

  const handleResetGeneral = () => {
    setPortalUrl("https://agency-portal.com");
    setCompanyName("DataSync AI Sdn Bhd");
    setTimezone("asia-kl");
    setAutoRetry(true);
    setEmailNotifications(true);
    setRetentionDays("90");
    toast.info("Settings reset to defaults.");
  };

  const handleDeleteMapping = (index: number) => {
    setMappings((prev) => prev.filter((_, i) => i !== index));
    toast.success("Mapping rule removed.");
  };

  const handleEditMapping = () => {
    if (editDialog.index !== null) {
      setMappings((prev) =>
        prev.map((m, i) => i === editDialog.index ? { ...m, input: editDialog.input, output: editDialog.output } : m)
      );
      setEditDialog({ open: false, index: null, input: "", output: "" });
      toast.success("Mapping rule updated.");
    }
  };

  const handleAddMapping = () => {
    if (!newInput.trim() || !newOutput.trim()) return;
    setMappings((prev) => [...prev, { id: prev.length, input: newInput.trim(), output: newOutput.trim(), confidence: 85 }]);
    setNewInput("");
    setNewOutput("");
    setAddDialog(false);
    toast.success("New mapping rule added.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure system settings and AI mapping rules.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="general" className="text-xs sm:text-sm">General</TabsTrigger>
          <TabsTrigger value="mapping" className="text-xs sm:text-sm">AI Mapping Rules</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
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
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-kl">Asia/Kuala_Lumpur (GMT+8)</SelectItem>
                      <SelectItem value="asia-sg">Asia/Singapore (GMT+8)</SelectItem>
                      <SelectItem value="asia-jkt">Asia/Jakarta (GMT+7)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 max-w-lg">
                <Label htmlFor="portal-url">Target Agency Portal URL</Label>
                <Input
                  id="portal-url"
                  value={portalUrl}
                  onChange={(e) => setPortalUrl(e.target.value)}
                  placeholder="https://your-agency-portal.com"
                />
                <p className="text-xs text-muted-foreground">
                  The agent will redirect users here after processing via the "Open in Agency Portal" button.
                </p>
              </div>

              <Separator />

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="retention">Data Retention Period</Label>
                  <Select value={retentionDays} onValueChange={setRetentionDays}>
                    <SelectTrigger id="retention">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium">Auto-Retry Failed Files</p>
                    <p className="text-xs text-muted-foreground">Retry processing up to 3 times</p>
                  </div>
                  <Switch checked={autoRetry} onCheckedChange={setAutoRetry} />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleResetGeneral}>
                  <RotateCcw className="h-4 w-4 mr-1.5" /> Reset
                </Button>
                <Button onClick={handleSaveGeneral} disabled={isSaving}>
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1.5" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Mapping Rules */}
        <TabsContent value="mapping">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle className="text-lg">Column Mapping Intelligence</CardTitle>
                  <CardDescription>AI-powered field recognition and standardization rules</CardDescription>
                </div>
                <Button size="sm" onClick={() => setAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-1.5" /> Add Rule
                </Button>
              </div>
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
                {mappings.map((mapping, index) => (
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

                    <div className="flex items-center gap-2 ml-4 z-10">
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
                          "hidden sm:inline-flex",
                          mapping.confidence >= 95
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-warning/10 text-warning border-warning/30"
                        )}
                      >
                        {mapping.confidence >= 95 ? "High" : "Medium"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setEditDialog({ open: true, index, input: mapping.input, output: mapping.output })}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        onClick={() => handleDeleteMapping(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Email Notifications", desc: "Receive email alerts for processing results", checked: emailNotifications, onChange: setEmailNotifications },
                { label: "Failed Processing Alerts", desc: "Get notified when a file fails to process", checked: true, onChange: () => toast.info("Always enabled for security.") },
                { label: "Weekly Summary Report", desc: "Receive a weekly digest of all processing activity", checked: false, onChange: () => toast.success("Weekly summary enabled.") },
                { label: "Agent Status Changes", desc: "Alert when agents go offline unexpectedly", checked: true, onChange: () => {} },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch checked={item.checked} onCheckedChange={item.onChange} />
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button onClick={() => toast.success("Notification preferences saved.")}>
                  <Save className="h-4 w-4 mr-1.5" /> Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Mapping Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => !open && setEditDialog({ open: false, index: null, input: "", output: "" })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Mapping Rule</DialogTitle>
            <DialogDescription>Update the source and target column mapping.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Source Column</Label>
              <Input value={editDialog.input} onChange={(e) => setEditDialog((p) => ({ ...p, input: e.target.value }))} className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label>Target Column</Label>
              <Input value={editDialog.output} onChange={(e) => setEditDialog((p) => ({ ...p, output: e.target.value }))} className="font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, index: null, input: "", output: "" })}>Cancel</Button>
            <Button onClick={handleEditMapping}>
              <CheckCircle2 className="h-4 w-4 mr-1.5" /> Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Mapping Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Mapping Rule</DialogTitle>
            <DialogDescription>Define a new source-to-target column mapping.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Source Column Name</Label>
              <Input value={newInput} onChange={(e) => setNewInput(e.target.value)} placeholder="e.g. Cust_Addr" className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label>Target Schema Column</Label>
              <Input value={newOutput} onChange={(e) => setNewOutput(e.target.value)} placeholder="e.g. customer_address" className="font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddMapping} disabled={!newInput.trim() || !newOutput.trim()}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
