import { useState, useEffect } from "react";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { AgentControls } from "@/components/dashboard/AgentControls";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ManualUploadDialog } from "@/components/dashboard/ManualUploadDialog";
import { StatsGridSkeleton } from "@/components/dashboard/StatsGridSkeleton";
import { AgentControlsSkeleton } from "@/components/dashboard/AgentControlsSkeleton";
import { ActivitySkeleton } from "@/components/dashboard/ActivitySkeleton";
import { useMockData } from "@/contexts/MockDataContext";

export default function Dashboard() {
  const { isLoading, setIsLoading } = useMockData();

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [setIsLoading]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Mission Control</h1>
          <p className="text-sm text-muted-foreground">
            Monitor your ETL pipelines and data processing in real-time.
          </p>
        </div>
        <ManualUploadDialog />
      </div>

      {/* Stats Grid */}
      {isLoading ? <StatsGridSkeleton /> : <StatsGrid />}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          {isLoading ? <AgentControlsSkeleton /> : <AgentControls />}
        </div>
        <div className="lg:col-span-3">
          {isLoading ? <ActivitySkeleton /> : <RecentActivity />}
        </div>
      </div>
    </div>
  );
}
