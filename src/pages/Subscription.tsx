import { Check, CreditCard, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { subscriptionPlans } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Subscription() {
  const currentPlan = subscriptionPlans.find((p) => p.id === "business");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscription & Licensing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>

      {/* Current Plan */}
      <Card className="shadow-card border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Business Plan</CardTitle>
                <CardDescription>Your current active subscription</CardDescription>
              </div>
            </div>
            <Badge className="bg-success/10 text-success border-success/30">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Price</p>
              <p className="text-2xl font-bold">
                RM 299<span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Files Processed</p>
              <div className="mt-1">
                <p className="text-lg font-semibold">450 / Unlimited</p>
                <Progress value={45} className="mt-2 h-2" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Billing Date</p>
              <p className="text-lg font-semibold">Feb 15, 2024</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <div className="flex items-center gap-2 mt-1">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">•••• 4242</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "shadow-card relative overflow-hidden",
                plan.recommended && "ring-2 ring-primary"
              )}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-2xs font-medium px-3 py-1 rounded-bl-lg">
                  Recommended
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  {plan.price ? (
                    <span className="text-2xl font-bold text-foreground">
                      RM {plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/mo</span>
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
                      <span className="h-4 w-4 flex items-center justify-center">—</span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.id === "business" ? "secondary" : "default"}
                  className="w-full"
                  disabled={plan.id === "business"}
                >
                  {plan.id === "business" ? (
                    "Current Plan"
                  ) : plan.id === "enterprise" ? (
                    "Contact Sales"
                  ) : (
                    <>
                      Upgrade <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Payment Methods</CardTitle>
          <CardDescription>
            Supported payment gateways for Malaysian businesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 rounded-lg border px-4 py-3">
              <div className="h-8 w-16 gradient-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
                FPX
              </div>
              <span className="text-sm font-medium">FPX Online Banking</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border px-4 py-3">
              <div className="h-8 w-16 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
                Toyyib
              </div>
              <span className="text-sm font-medium">ToyyibPay</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border px-4 py-3">
              <div className="h-8 w-16 gradient-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
                Stripe
              </div>
              <span className="text-sm font-medium">Credit/Debit Card</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
