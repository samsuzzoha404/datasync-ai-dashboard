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
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Column Mapping Intelligence</CardTitle>
                  <CardDescription>AI-powered field recognition and standardization rules</CardDescription>
                </div>
                <Button size="sm" onClick={() => setAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-1.5" /> Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Flow Legend */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-lg border bg-muted/30 px-4 sm:px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source Column</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="h-px w-10 bg-muted-foreground/20" />
                  <MoveRight className="h-3.5 w-3.5 text-primary/60" />
                  <span className="text-xs text-muted-foreground font-medium">AI Mapping</span>
                  <MoveRight className="h-3.5 w-3.5 text-primary/60" />
                  <div className="h-px w-10 bg-muted-foreground/20" />
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Schema</span>
                  <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                </div>
              </div>

              {/* Mapping Rules List */}
              <div className="space-y-2.5">
                {mappings.map((mapping, index) => (
                  <div
                    key={index}
                    className="group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-lg border p-4 sm:p-5 hover:bg-accent/40 transition-all duration-150"
                  >
                    {/* Source → Target row */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Source */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 shrink-0" />
                        <div className="rounded-md bg-muted px-3 py-2 font-mono text-sm border border-border truncate">
                          {mapping.input}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center gap-1.5 shrink-0 px-1">
                        <div className="hidden sm:block h-px w-4 bg-gradient-to-r from-muted-foreground/30 to-primary/40" />
                        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 border border-primary/20">
                          <MoveRight className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="hidden sm:block h-px w-4 bg-gradient-to-l from-muted-foreground/30 to-primary/40" />
                      </div>

                      {/* Target */}
                      <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                        <div className="rounded-md bg-primary/10 text-primary px-3 py-2 font-mono text-sm border border-primary/25 truncate">
                          {mapping.output}
                        </div>
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      </div>
                    </div>

                    {/* Meta & Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="flex flex-col items-start sm:items-end gap-1 w-24">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] text-muted-foreground">Confidence</span>
                          <span className="text-xs font-semibold font-mono">{mapping.confidence}%</span>
                        </div>
                        <Progress value={mapping.confidence} className="h-1.5" />
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-2 py-0.5",
                          mapping.confidence >= 95
                            ? "bg-success/10 text-success border-success/30"
                            : "bg-warning/10 text-warning border-warning/30"
                        )}
                      >
                        {mapping.confidence >= 95 ? "High" : "Medium"}
                      </Badge>

                      <Separator orientation="vertical" className="h-6 hidden sm:block" />

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 sm:h-8 sm:w-8 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                          onClick={() => setEditDialog({ open: true, index, input: mapping.input, output: mapping.output })}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 sm:h-8 sm:w-8 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                          onClick={() => handleDeleteMapping(index)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info Box */}
              <div className="rounded-lg border border-dashed bg-muted/30 p-5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">How it works:</strong> The AI engine analyzes column headers and data
                  patterns from incoming Excel files to automatically map them to your
                  standardized schema. Confidence scores indicate the reliability of each mapping.
                  You can manually override any rule by clicking the edit icon.
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
