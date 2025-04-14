
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCard } from "@/components/ui/kpi-card";
import { KpiDialog } from "@/components/ui/kpi-dialog";
import { Button } from "@/components/ui/button";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { useKpi } from "@/context/KpiContext";
import { KpiGoal, TimeFrame } from "@/types/kpi";
import { CalendarDays, BarChart3, TrendingUp, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const { kpiData, resetDailyValues, resetWeeklyValues, resetMonthlyValues } = useKpi();
  const [selectedKpi, setSelectedKpi] = useState<{ kpi: KpiGoal; timeFrame: TimeFrame; category: string } | null>(null);
  
  // Mock data for charts
  const areaChartData = [
    { date: "Mon", Emails: 65, Calls: 28, Meetings: 1 },
    { date: "Tue", Emails: 59, Calls: 33, Meetings: 1 },
    { date: "Wed", Emails: 80, Calls: 42, Meetings: 2 },
    { date: "Thu", Emails: 81, Calls: 45, Meetings: 1 },
    { date: "Fri", Emails: 56, Calls: 31, Meetings: 0 },
  ];

  const barChartData = [
    { name: "Emails", Current: 341, Target: 375 },
    { name: "Calls", Current: 179, Target: 225 },
    { name: "Connections", Current: 15, Target: 15 },
    { name: "Leads", Current: 27, Target: 22 },
    { name: "Meetings", Current: 5, Target: 8 },
  ];

  const pipelineData = [
    { name: "Week 1", Value: 45000 },
    { name: "Week 2", Value: 63000 },
    { name: "Week 3", Value: 58000 },
    { name: "Week 4", Value: 87000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales KPI Dashboard</h1>
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
                <CardTitle className="text-sm font-medium">Daily Activity</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((
                    calculateDailyProgress(kpiData.daily.emailsSent) +
                    calculateDailyProgress(kpiData.daily.coldCallsMade) +
                    calculateDailyProgress(kpiData.daily.linkedinConnections) +
                    calculateDailyProgress(kpiData.daily.newLeadsProspected) +
                    calculateDailyProgress(kpiData.daily.meetingsBooked)
                  ) / 5)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Average completion across all daily KPIs
                </p>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((
                    calculateDailyProgress(kpiData.weekly.meetingsBooked) +
                    calculateDailyProgress(kpiData.weekly.pipelineGenerated) +
                    calculateDailyProgress(kpiData.weekly.newAccountsTouched) +
                    calculateDailyProgress(kpiData.weekly.personalizedLoomVideos)
                  ) / 4)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Average completion across all weekly KPIs
                </p>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Monthly Progress</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((
                    calculateDailyProgress(kpiData.monthly.sqlsCreated) +
                    calculateDailyProgress(kpiData.monthly.opportunitiesCreated) +
                    calculateDailyProgress(kpiData.monthly.pipelineValueCreated) +
                    calculateDailyProgress(kpiData.monthly.closedDeals)
                  ) / 4)}%
                </div>
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
                  Daily activities tracked over the current week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart data={areaChartData} dataKeys={["Emails", "Calls", "Meetings"]} />
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
                  data={barChartData} 
                  dataKeys={["Current", "Target"]} 
                  colors={["#3B82F6", "#E2E8F0"]} 
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Pipeline Generated</CardTitle>
              <CardDescription>
                Pipeline value generated week by week ($)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={pipelineData} 
                dataKeys={["Value"]} 
                colors={["#8B5CF6"]} 
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
                onClick={() => setSelectedKpi({ 
                  kpi, 
                  timeFrame: 'daily', 
                  category: key 
                })} 
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
                  "Max Target": kpi.target.max
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
                onClick={() => setSelectedKpi({ 
                  kpi, 
                  timeFrame: 'weekly', 
                  category: key 
                })} 
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
                  "Max Target": kpi.target.max
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
                onClick={() => setSelectedKpi({ 
                  kpi, 
                  timeFrame: 'monthly', 
                  category: key 
                })} 
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
                  "Max Target": kpi.target.max
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

// Helper function to calculate progress percentage
function calculateDailyProgress(kpi: KpiGoal): number {
  if (kpi.currentValue <= kpi.target.min) return 0;
  if (kpi.currentValue >= kpi.target.max) return 100;
  
  const range = kpi.target.max - kpi.target.min;
  const progress = ((kpi.currentValue - kpi.target.min) / range) * 100;
  return Math.min(Math.max(progress, 0), 100);
}
