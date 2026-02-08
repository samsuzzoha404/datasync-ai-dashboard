import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Link2,
  FileText,
  CreditCard,
  Settings,
  Zap,
  Shield,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Connections", href: "/connections", icon: Link2 },
  { name: "Processing Logs", href: "/logs", icon: FileText },
  { name: "Subscription", href: "/subscription", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0 gradient-sidebar border-sidebar-border">
        <SheetHeader className="flex h-16 flex-row items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-success border-2 border-sidebar" />
            </div>
            <div className="flex flex-col">
              <SheetTitle className="text-sm font-semibold text-sidebar-accent-foreground text-left">
                DataSync AI
              </SheetTitle>
              <span className="text-2xs text-sidebar-muted">ETL Platform</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-sidebar-muted hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
          >
            <X className="h-5 w-5" />
          </Button>
        </SheetHeader>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* License Status */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="rounded-lg bg-sidebar-accent/50 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-xs font-medium text-sidebar-accent-foreground">License Active</span>
            </div>
            <Badge className="bg-success/20 text-success hover:bg-success/30 text-2xs">
              Business Plan
            </Badge>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
