import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKpi } from "@/hooks/useKpi";
import { Separator } from "@/components/ui/separator";
import { Download, RefreshCw, Upload } from "lucide-react";
import { TimeFrame, KpiGoal } from "@/types/kpi";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { kpiData, resetDailyValues, resetWeeklyValues, resetMonthlyValues } =
    useKpi();

  const handleExportData = () => {
    const dataStr = JSON.stringify(kpiData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "sales-kpi-data.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        localStorage.setItem("kpiData", JSON.stringify(data));
        window.location.reload();
      } catch (error) {
        console.error("Error importing data:", error);
        alert("Invalid data format. Please upload a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="John Smith"
                    defaultValue="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    placeholder="Senior SDR"
                    defaultValue="Senior SDR"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  defaultValue="john@example.com"
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>KPI Resets</CardTitle>
              <CardDescription>
                Reset KPI values for different time periods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="outline" onClick={resetDailyValues}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Daily KPIs
                </Button>
                <Button variant="outline" onClick={resetWeeklyValues}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Weekly KPIs
                </Button>
                <Button variant="outline" onClick={resetMonthlyValues}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Monthly KPIs
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetDailyValues();
                    resetWeeklyValues();
                    resetMonthlyValues();
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset All KPIs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import/Export Data</CardTitle>
              <CardDescription>Manage your KPI data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export KPI Data
                </Button>
                <div className="relative">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import KPI Data
                  </Button>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-medium">Database Status</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your data is currently stored locally in your browser. No data
                  is being sent to any servers.
                </p>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Storage:</span> Local Storage
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Data points:</span>{" "}
                    {kpiData.history.length}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Last updated:</span>{" "}
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clear All Data</CardTitle>
              <CardDescription>
                This will permanently delete all your KPI data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete all data? This action cannot be undone."
                    )
                  ) {
                    localStorage.removeItem("kpiData");
                    window.location.reload();
                  }
                }}
              >
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
