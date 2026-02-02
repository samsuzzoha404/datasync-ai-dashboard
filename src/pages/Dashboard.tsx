import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { AgentControls } from "@/components/dashboard/AgentControls";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ManualUploadDialog } from "@/components/dashboard/ManualUploadDialog";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mission Control</h1>
          <p className="text-muted-foreground">
            Monitor your ETL pipelines and data processing in real-time.
          </p>
        </div>
        <ManualUploadDialog />
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <AgentControls />
        </div>
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
