import { Menu, Bell, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMockData } from "@/contexts/MockDataContext";

interface TopBarProps {
  onToggleSidebar: () => void;
  showMobileMenu?: boolean;
}

export function TopBar({ onToggleSidebar, showMobileMenu = false }: TopBarProps) {
  const { agents } = useMockData();
  const allRunning = agents.email && agents.sftp;

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b bg-card/80 backdrop-blur-sm px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className={showMobileMenu ? "" : "hidden lg:flex"}
        onClick={onToggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Global Status */}
      <div className="hidden md:flex items-center gap-4">
        <Badge 
          variant="outline" 
          className={allRunning 
            ? "bg-success/10 text-success border-success/30 gap-1.5" 
            : "bg-warning/10 text-warning border-warning/30 gap-1.5"
          }
        >
          <CheckCircle2 className="h-3 w-3" />
          {allRunning ? "All Systems Operational" : "Partial Systems Running"}
        </Badge>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md ml-auto">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files, clients..."
            className="pl-9 bg-secondary/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" className="sm:hidden">
          <Search className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium">New file processed</span>
              <span className="text-xs text-muted-foreground">
                CIMB_Overdue_Jan2024.xlsx - 1,247 rows
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium text-warning">Decryption failed</span>
              <span className="text-xs text-muted-foreground">
                Maybank_01.rar - Incorrect password
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  DS
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>DataSync Admin</span>
                <span className="text-xs font-normal text-muted-foreground">
                  admin@datasync.my
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
