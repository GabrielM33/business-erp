
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { KpiDialog } from "@/components/ui/kpi-dialog";
import { BarChart } from "@/components/charts/BarChart";
import { Button } from "@/components/ui/button";
import { useKpi } from "@/context/KpiContext";
import { KpiGoal } from "@/types/kpi";
import { RefreshCw } from "lucide-react";

export default function DailyKPIs() {
  const { kpiData, resetDailyValues } = useKpi();
  const [selectedKpi, setSelectedKpi] = useState<{ kpi: KpiGoal; category: string } | null>(null);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Daily KPIs</h1>
        <Button variant="outline" size="sm" onClick={resetDailyValues}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Daily Values
        </Button>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {Object.entries(kpiData.daily).map(([key, kpi]) => (
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
          <CardTitle>Daily KPIs Breakdown</CardTitle>
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
            height={400}
          />
        </CardContent>
      </Card>
      
      {selectedKpi && (
        <KpiDialog
          open={!!selectedKpi}
          onOpenChange={(open) => !open && setSelectedKpi(null)}
          kpi={selectedKpi.kpi}
          timeFrame="daily"
          category={selectedKpi.category}
        />
      )}
    </div>
  );
}
