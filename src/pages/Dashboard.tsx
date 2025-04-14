import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCard } from "@/components/ui/kpi-card";
import { KpiDialog } from "@/components/ui/kpi-dialog";
import { Button } from "@/components/ui/button";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { useKpi } from "@/hooks/useKpi";
import { KpiGoal, TimeFrame } from "@/types/kpi";
import { CalendarDays, BarChart3, TrendingUp, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to calculate progress percentage
function calculateProgress(kpi: KpiGoal): number {
  if (kpi.target.max === kpi.target.min)
    return kpi.currentValue >= kpi.target.min ? 100 : 0;
  if (kpi.currentValue <= kpi.target.min) return 0;
  if (kpi.currentValue >= kpi.target.max) return 100;

  const range = kpi.target.max - kpi.target.min;
  const progress = ((kpi.currentValue - kpi.target.min) / range) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

export default function Dashboard() {
  const {
    kpiData,
    resetDailyValues,
    resetWeeklyValues,
    resetMonthlyValues,
    isLoading,
    weeklyActivityTrend,
    monthlyPipelineTrend,
  } = useKpi();
  const [selectedKpi, setSelectedKpi] = useState<{
    kpi: KpiGoal;
    timeFrame: TimeFrame;
    category: string;
  } | null>(null);

  // Generate Weekly Bar Chart data dynamically from kpiData.weekly
  const weeklyBarChartData = Object.entries(kpiData.weekly || {}).map(
    ([key, kpi]) => ({
      name: kpi.name,
      Current: kpi.currentValue,
      // Assuming the target shown is the max target for simplicity, adjust if needed
      Target: kpi.target.max,
    })
  );

  // Add Loading State UI
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-72" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>

        <Skeleton className="h-10 w-[360px]" />

        {/* Skeleton for KPI summary cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-16 mb-1" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton for charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-52 mb-2" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-60 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate average progress (using the updated helper)
  const dailyAvgProgress = Math.round(
    Object.values(kpiData.daily).reduce(
      (sum, kpi) => sum + calculateProgress(kpi),
      0
    ) / Object.values(kpiData.daily).length || 0
  );
  const weeklyAvgProgress = Math.round(
    Object.values(kpiData.weekly).reduce(
      (sum, kpi) => sum + calculateProgress(kpi),
      0
    ) / Object.values(kpiData.weekly).length || 0
  );
  const monthlyAvgProgress = Math.round(
    Object.values(kpiData.monthly).reduce(
      (sum, kpi) => sum + calculateProgress(kpi),
      0
    ) / Object.values(kpiData.monthly).length || 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetDailyValues}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Daily
          </Button>
          <Button variant="outline" size="sm" onClick={resetWeeklyValues}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Weekly
          </Button>
          <Button variant="outline" size="sm" onClick={resetMonthlyValues}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Monthly
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All KPIs</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        {/* All KPIs Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Daily Activity
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dailyAvgProgress}%</div>
                <p className="text-xs text-muted-foreground">
                  Average completion across all daily KPIs
                </p>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Weekly Progress
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{weeklyAvgProgress}%</div>
                <p className="text-xs text-muted-foreground">
                  Average completion across all weekly KPIs
                </p>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Monthly Progress
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyAvgProgress}%</div>
                <p className="text-xs text-muted-foreground">
                  Average completion across all monthly KPIs
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Weekly Activity Trend</CardTitle>
                <CardDescription>
                  Daily activities tracked over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart
                  data={weeklyActivityTrend}
                  dataKeys={["Emails", "Calls", "Meetings"]}
                />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Weekly KPIs vs Target</CardTitle>
                <CardDescription>
                  Current progress against weekly targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={weeklyBarChartData}
                  dataKeys={["Current", "Target"]}
                  // Use appropriate colors, maybe based on weekly theme?
                  colors={["#8B5CF6", "#E2E8F0"]}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Pipeline Generated</CardTitle>
              <CardDescription>
                Pipeline value generated over the last 4 weeks ($)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={monthlyPipelineTrend}
                dataKeys={["Value"]}
                colors={["#EC4899"]} // Use monthly theme color
                height={250}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily KPIs Tab */}
        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Object.entries(kpiData.daily).map(([key, kpi]) => (
              <KpiCard
                key={kpi.id}
                kpi={kpi}
                onClick={() =>
                  setSelectedKpi({
                    kpi,
                    timeFrame: "daily",
                    category: key,
                  })
                }
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daily Activities Breakdown</CardTitle>
              <CardDescription>
                Current progress against daily targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={Object.entries(kpiData.daily).map(([key, kpi]) => ({
                  name: kpi.name,
                  Current: kpi.currentValue,
                  "Min Target": kpi.target.min,
                  "Max Target": kpi.target.max,
                }))}
                dataKeys={["Current", "Min Target", "Max Target"]}
                colors={["#3B82F6", "#E2E8F0", "#94A3B8"]}
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weekly KPIs Tab */}
        <TabsContent value="weekly" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {Object.entries(kpiData.weekly).map(([key, kpi]) => (
              <KpiCard
                key={kpi.id}
                kpi={kpi}
                onClick={() =>
                  setSelectedKpi({
                    kpi,
                    timeFrame: "weekly",
                    category: key,
                  })
                }
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly KPIs Overview</CardTitle>
              <CardDescription>
                Current progress against weekly targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={Object.entries(kpiData.weekly).map(([key, kpi]) => ({
                  name: kpi.name,
                  Current: kpi.currentValue,
                  "Min Target": kpi.target.min,
                  "Max Target": kpi.target.max,
                }))}
                dataKeys={["Current", "Min Target", "Max Target"]}
                colors={["#8B5CF6", "#E2E8F0", "#94A3B8"]}
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly KPIs Tab */}
        <TabsContent value="monthly" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {Object.entries(kpiData.monthly).map(([key, kpi]) => (
              <KpiCard
                key={kpi.id}
                kpi={kpi}
                onClick={() =>
                  setSelectedKpi({
                    kpi,
                    timeFrame: "monthly",
                    category: key,
                  })
                }
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly KPIs Overview</CardTitle>
              <CardDescription>
                Current progress against monthly targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={Object.entries(kpiData.monthly).map(([key, kpi]) => ({
                  name: kpi.name,
                  Current: kpi.currentValue,
                  "Min Target": kpi.target.min,
                  "Max Target": kpi.target.max,
                }))}
                dataKeys={["Current", "Min Target", "Max Target"]}
                colors={["#EC4899", "#E2E8F0", "#94A3B8"]}
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedKpi && (
        <KpiDialog
          open={!!selectedKpi}
          onOpenChange={(open) => !open && setSelectedKpi(null)}
          kpi={selectedKpi.kpi}
          timeFrame={selectedKpi.timeFrame}
          category={selectedKpi.category}
        />
      )}
    </div>
  );
}
