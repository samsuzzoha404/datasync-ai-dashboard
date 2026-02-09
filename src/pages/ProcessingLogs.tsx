import { useState, useMemo } from "react";
import { Mail, Server, Upload, CheckCircle2, Loader2, XCircle, ExternalLink, Search, X, Clock, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useMockData, Activity } from "@/contexts/MockDataContext";
import { cn } from "@/lib/utils";

const sourceIcons = {
  email: Mail,
  sftp: Server,
  upload: Upload,
};

const sourceLabels = { email: "Email", sftp: "SFTP", upload: "Manual Upload" };

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: "Saved",
    className: "bg-success/10 text-success border-success/30",
  },
  processing: {
    icon: Loader2,
    label: "Processing",
    className: "bg-warning/10 text-warning border-warning/30",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    className: "bg-error/10 text-error border-error/30",
  },
};

const ITEMS_PER_PAGE = 5;

export default function ProcessingLogs() {
  const { activities } = useMockData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      const matchesSearch = !search || a.fileName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "success" && a.status === "completed") ||
        (statusFilter === "failed" && a.status === "failed") ||
        (statusFilter === "processing" && a.status === "processing");
      return matchesSearch && matchesStatus;
    });
  }, [activities, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleSearchChange = (val: string) => { setSearch(val); setCurrentPage(1); };
  const handleStatusChange = (val: string) => { setStatusFilter(val); setCurrentPage(1); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Processing Logs</h1>
        <p className="text-sm text-muted-foreground">
          View all file processing events and statuses.
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-semibold">All Processing Events</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by filename..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 h-9 w-full sm:w-[220px] text-sm"
                />
                {search && (
                  <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-9 w-9" onClick={() => handleSearchChange("")}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-9 w-[130px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">File Name</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Source</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground text-right font-mono">Rows</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Timestamp</th>
                  <th className="pb-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((activity) => {
                    const SourceIcon = sourceIcons[activity.source];
                    const status = statusConfig[activity.status];
                    const StatusIcon = status.icon;

                    return (
                      <tr
                        key={activity.id}
                        className="border-b last:border-0 hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedActivity(activity)}
                      >
                        <td className="py-3 pr-4">
                          <span className="font-medium truncate block max-w-[200px]">{activity.fileName}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="rounded-lg bg-secondary p-1.5 w-fit">
                            <SourceIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-right font-mono text-muted-foreground">
                          {activity.rows > 0 ? activity.rows.toLocaleString() : "—"}
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant="outline" className={cn("gap-1", status.className)}>
                            <StatusIcon className={cn("h-3 w-3", activity.status === "processing" && "animate-spin")} />
                            {status.label}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground text-xs">{activity.timestamp}</td>
                        <td className="py-3">
                          {activity.status === "completed" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => { e.stopPropagation(); window.open("https://agency-portal.com", "_blank"); }}
                                >
                                  <ExternalLink className="h-4 w-4 text-primary" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Open in Agency Portal</TooltipContent>
                            </Tooltip>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink isActive={page === currentPage} onClick={() => setCurrentPage(page)}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Side Sheet */}
      <Sheet open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-lg">Processing Details</SheetTitle>
            <SheetDescription>Full log details for this file event.</SheetDescription>
          </SheetHeader>
          {selectedActivity && (
            <div className="mt-6 space-y-6">
              {/* File Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-secondary p-2.5">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{selectedActivity.fileName}</p>
                    <p className="text-xs text-muted-foreground">{sourceLabels[selectedActivity.source]} • {selectedActivity.bank}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Status */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                <Badge variant="outline" className={cn("gap-1.5 text-sm px-3 py-1", statusConfig[selectedActivity.status].className)}>
                  {(() => { const I = statusConfig[selectedActivity.status].icon; return <I className={cn("h-3.5 w-3.5", selectedActivity.status === "processing" && "animate-spin")} />; })()}
                  {statusConfig[selectedActivity.status].label}
                </Badge>
              </div>

              <Separator />

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Rows Processed</p>
                  <p className="text-sm font-semibold font-mono">{selectedActivity.rows > 0 ? selectedActivity.rows.toLocaleString() : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Timestamp</p>
                  <p className="text-sm font-medium">{selectedActivity.timestamp}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Processing Time</p>
                  <p className="text-sm font-semibold font-mono">
                    {selectedActivity.status === "completed" ? `${(Math.random() * 3 + 1).toFixed(1)}s` : selectedActivity.status === "processing" ? "In progress..." : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Source</p>
                  <p className="text-sm font-medium">{sourceLabels[selectedActivity.source]}</p>
                </div>
              </div>

              {/* Error Section */}
              {selectedActivity.status === "failed" && (
                <>
                  <Separator />
                  <div className="rounded-lg border border-error/30 bg-error/5 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-error" />
                      <p className="text-sm font-semibold text-error">Error Details</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedActivity.error || "Unknown error occurred during processing."}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-2">
                      Error Code: ERR_{selectedActivity.status === "failed" ? "DECRYPT_001" : "UNKNOWN"}
                    </p>
                  </div>
                </>
              )}

              {/* Agency Portal Button */}
              {selectedActivity.status === "completed" && (
                <>
                  <Separator />
                  <Button className="w-full gap-2" onClick={() => window.open("https://agency-portal.com", "_blank")}>
                    <ExternalLink className="h-4 w-4" />
                    Open in Agency Portal
                  </Button>
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
