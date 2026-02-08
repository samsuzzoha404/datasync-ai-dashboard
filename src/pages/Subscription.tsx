import { useState } from "react";
import { Check, CreditCard, ArrowRight, Sparkles, Download, Receipt, Shield, Clock, ChevronDown, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { subscriptionPlans } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const invoices = [
  { id: "INV-2024-001", date: "15/01/2024", amount: 299, status: "paid" as const, plan: "Business" },
  { id: "INV-2023-012", date: "15/12/2023", amount: 299, status: "paid" as const, plan: "Business" },
  { id: "INV-2023-011", date: "15/11/2023", amount: 299, status: "paid" as const, plan: "Business" },
  { id: "INV-2023-010", date: "15/10/2023", amount: 99, status: "paid" as const, plan: "Starter" },
  { id: "INV-2023-009", date: "15/09/2023", amount: 99, status: "paid" as const, plan: "Starter" },
];

export default function Subscription() {
  const [upgradeDialog, setUpgradeDialog] = useState<string | null>(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState("business");
  const [selectedPayment, setSelectedPayment] = useState<string>("card");

  const selectedPlan = subscriptionPlans.find((p) => p.id === upgradeDialog);

  const handleUpgrade = async (planId: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsProcessing(false);
    setCurrentPlanId(planId);
    setUpgradeDialog(null);
    toast.success(`Successfully switched to ${subscriptionPlans.find(p => p.id === planId)?.name} plan!`);
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsProcessing(false);
    setCancelDialog(false);
    toast.success("Subscription cancelled. Access remains until 15/02/2024.");
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading ${invoiceId}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Subscription & Licensing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription, billing, and payment methods.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="plans" className="text-xs sm:text-sm">Plans</TabsTrigger>
          <TabsTrigger value="billing" className="text-xs sm:text-sm">Billing & Invoices</TabsTrigger>
          <TabsTrigger value="payment" className="text-xs sm:text-sm">Payment Methods</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Plan Card */}
            <Card className="shadow-card border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{subscriptionPlans.find(p => p.id === currentPlanId)?.name} Plan</CardTitle>
                      <CardDescription>Your current active subscription</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/30">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly Price</p>
                    <p className="text-2xl font-bold font-mono">
                      RM {subscriptionPlans.find(p => p.id === currentPlanId)?.price ?? "Custom"}
                      {subscriptionPlans.find(p => p.id === currentPlanId)?.price && (
                        <span className="text-sm font-normal text-muted-foreground font-sans">/mo</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Files Processed</p>
                    <div className="mt-1">
                      <p className="text-lg font-semibold font-mono">450 / {currentPlanId === "starter" ? "500" : "Unlimited"}</p>
                      <Progress value={currentPlanId === "starter" ? 90 : 45} className="mt-2 h-2" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Next Billing Date</p>
                    <p className="text-lg font-semibold font-mono">15/02/2024</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Method</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium font-mono">•••• 4242</span>
                    </div>
                  </div>
                </div>
                <Separator className="my-5" />
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" onClick={() => setCancelDialog(true)}>
                    Cancel Subscription
                  </Button>
                  {currentPlanId !== "enterprise" && (
                    <Button size="sm" onClick={() => setUpgradeDialog(currentPlanId === "starter" ? "business" : "enterprise")}>
                      Upgrade Plan <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-medium">Plan Features</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {subscriptionPlans.find(p => p.id === currentPlanId)?.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-medium">Billing Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Period</span>
                  <span className="font-medium font-mono">15/01/2024 - 15/02/2024</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan Cost</span>
                  <span className="font-medium font-mono">RM {subscriptionPlans.find(p => p.id === currentPlanId)?.price ?? "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (SST 8%)</span>
                  <span className="font-medium font-mono">RM {((subscriptionPlans.find(p => p.id === currentPlanId)?.price ?? 0) * 0.08).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span className="font-mono">RM {((subscriptionPlans.find(p => p.id === currentPlanId)?.price ?? 0) * 1.08).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans">
          <div className="grid gap-4 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  "shadow-card relative overflow-hidden transition-all",
                  plan.recommended && "ring-2 ring-primary",
                  plan.id === currentPlanId && "border-success/50 bg-success/5"
                )}
              >
                {plan.recommended && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-2xs font-medium px-3 py-1 rounded-bl-lg">
                    Recommended
                  </div>
                )}
                {plan.id === currentPlanId && (
                  <div className="absolute top-0 left-0 bg-success text-success-foreground text-2xs font-medium px-3 py-1 rounded-br-lg">
                    Current
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.price ? (
                      <span className="text-2xl font-bold text-foreground font-mono">
                        RM {plan.price}
                        <span className="text-sm font-normal text-muted-foreground font-sans">/mo</span>
                      </span>
                    ) : (
                      <span className="text-lg font-medium text-foreground">Custom Pricing</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.limitations?.map((limitation, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.id === currentPlanId ? "secondary" : "default"}
                    className="w-full"
                    disabled={plan.id === currentPlanId}
                    onClick={() => {
                      if (plan.id === "enterprise") {
                        toast.info("Our sales team will contact you within 24 hours.");
                      } else {
                        setUpgradeDialog(plan.id);
                      }
                    }}
                  >
                    {plan.id === currentPlanId ? (
                      "Current Plan"
                    ) : plan.id === "enterprise" ? (
                      "Contact Sales"
                    ) : (
                      <>
                        {subscriptionPlans.findIndex(p => p.id === plan.id) < subscriptionPlans.findIndex(p => p.id === currentPlanId) ? "Downgrade" : "Upgrade"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Billing & Invoices Tab */}
        <TabsContent value="billing">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle className="text-lg">Invoice History</CardTitle>
                  <CardDescription>Download past invoices for your records</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success("Exporting all invoices...")}>
                  <Download className="h-4 w-4 mr-1.5" /> Export All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Invoice</th>
                      <th className="pb-3 font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 font-medium text-muted-foreground">Plan</th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">Amount</th>
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b last:border-0 hover:bg-accent/50 transition-colors">
                        <td className="py-3 font-mono text-xs">{inv.id}</td>
                        <td className="py-3 font-mono text-xs">{inv.date}</td>
                        <td className="py-3">{inv.plan}</td>
                        <td className="py-3 text-right font-mono">RM {inv.amount.toFixed(2)}</td>
                        <td className="py-3">
                          <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-2xs">
                            Paid
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => handleDownloadInvoice(inv.id)}>
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Saved Payment Methods</CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-4 border-primary/30 bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-foreground/10 p-2">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Visa ending in <span className="font-mono">4242</span></p>
                      <p className="text-xs text-muted-foreground">Expires 12/2026</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-2xs">Default</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-foreground/10 p-2">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Mastercard ending in <span className="font-mono">8888</span></p>
                      <p className="text-xs text-muted-foreground">Expires 06/2025</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => toast.success("Card set as default.")}>
                    Set Default
                  </Button>
                </div>
                <Button variant="outline" className="w-full mt-2" onClick={() => toast.info("Add card form would open here.")}>
                  + Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Supported Gateways</CardTitle>
                <CardDescription>Malaysian payment gateways available</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "FPX", name: "FPX Online Banking", desc: "Direct bank transfer" },
                  { label: "Toyyib", name: "ToyyibPay", desc: "Malaysian payment gateway" },
                  { label: "Stripe", name: "Credit/Debit Card", desc: "Visa, Mastercard, AMEX" },
                ].map((gw) => (
                  <div key={gw.label} className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 gradient-primary rounded-md flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {gw.label}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{gw.name}</p>
                        <p className="text-xs text-muted-foreground">{gw.desc}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-2xs">Active</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upgrade Confirmation Dialog */}
      <Dialog open={!!upgradeDialog} onOpenChange={(open) => !open && setUpgradeDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Switch to {selectedPlan?.name} Plan</DialogTitle>
            <DialogDescription>
              {selectedPlan?.price
                ? `You will be charged RM ${(selectedPlan.price * 1.08).toFixed(2)}/mo (incl. SST).`
                : "Our sales team will reach out to discuss custom pricing."}
            </DialogDescription>
          </DialogHeader>
          {selectedPlan?.price && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-mono">RM {selectedPlan.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SST (8%)</span>
                  <span className="font-mono">RM {(selectedPlan.price * 0.08).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span className="font-mono">RM {(selectedPlan.price * 1.08).toFixed(2)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Changes take effect immediately. Prorated charges will apply to your current billing cycle.
              </p>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setUpgradeDialog(null)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={() => upgradeDialog && handleUpgrade(upgradeDialog)} disabled={isProcessing}>
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Confirm Change"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel? You'll retain access until the end of your current billing period (15/02/2024).
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm">
            <p className="font-medium text-warning">What happens when you cancel:</p>
            <ul className="mt-2 space-y-1 text-muted-foreground text-xs">
              <li>• Your AI agents will stop processing files</li>
              <li>• SFTP and email integrations will be disconnected</li>
              <li>• You can reactivate anytime before the period ends</li>
            </ul>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCancelDialog(false)} disabled={isProcessing}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={isProcessing}>
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Cancelling...
                </span>
              ) : (
                "Cancel Subscription"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
