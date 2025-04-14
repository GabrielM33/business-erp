
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { KpiDialog } from "@/components/ui/kpi-dialog";
import { BarChart } from "@/components/charts/BarChart";
import { Button } from "@/components/ui/button";
import { useKpi } from "@/context/KpiContext";
import { KpiGoal } from "@/types/kpi";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MonthlyKPIs() {
  const { kpiData, resetMonthlyValues, isLoading } = useKpi();
  const [selectedKpi, setSelectedKpi] = useState<{ kpi: KpiGoal; category: string } | null>(null);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Monthly KPIs</h1>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Monthly KPIs</h1>
        <Button variant="outline" size="sm" onClick={resetMonthlyValues}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Monthly Values
        </Button>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {Object.entries(kpiData.monthly).map(([key, kpi]) => (
          <KpiCard
            key={kpi.id}
            kpi={kpi}
            onClick={() => setSelectedKpi({
              kpi,
              category: key
            })}
          />
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Monthly KPIs Breakdown</CardTitle>
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
            height={400}
          />
        </CardContent>
      </Card>
      
      {selectedKpi && (
        <KpiDialog
          open={!!selectedKpi}
          onOpenChange={(open) => !open && setSelectedKpi(null)}
          kpi={selectedKpi.kpi}
          timeFrame="monthly"
          category={selectedKpi.category}
        />
      )}
    </div>
  );
}
