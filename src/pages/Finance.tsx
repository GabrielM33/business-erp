import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp, CircleDollarSign, Flame } from "lucide-react"; // Example icons
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";

// Define a type for better state management
type FinanceMetric = {
  value: string;
  change?: string; // Optional change indicator
  status?: string; // Optional status indicator (for Burn Rate)
};

type FinanceData = {
  mrr: FinanceMetric;
  grossProfitMargin: FinanceMetric;
  operatingCashFlow: FinanceMetric;
  burnRate: FinanceMetric;
};

export default function Finance() {
  // Use state for finance data
  const [financeData, setFinanceData] = useState<FinanceData>({
    mrr: { value: "$0", change: "+0%" },
    grossProfitMargin: { value: "0%", change: "+0%" },
    operatingCashFlow: { value: "$0", change: "+0%" },
    burnRate: { value: "$0/mo", status: "Stable" },
  });

  // State for managing the dialog
  const [selectedMetricKey, setSelectedMetricKey] = useState<
    keyof FinanceData | null
  >(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control dialog open state explicitly

  const metricDisplayNames: Record<keyof FinanceData, string> = {
    mrr: "Monthly Recurring Revenue (MRR)",
    grossProfitMargin: "Gross Profit Margin",
    operatingCashFlow: "Operating Cash Flow (Last Q)",
    burnRate: "Burn Rate",
  };

  const handleCardClick = (metricKey: keyof FinanceData) => {
    setSelectedMetricKey(metricKey);
    setEditValue(financeData[metricKey].value); // Pre-fill input with current value
    setIsDialogOpen(true); // Open the dialog
  };

  const handleSave = () => {
    if (selectedMetricKey) {
      // Basic validation/formatting might be needed here
      const updatedMetric: FinanceMetric = {
        ...financeData[selectedMetricKey], // Keep existing change/status
        value: editValue,
      };

      // For simplicity, we won't update 'change' or 'status' here.
      // A real implementation would likely recalculate these.

      setFinanceData((prevData) => ({
        ...prevData,
        [selectedMetricKey]: updatedMetric,
      }));
      setIsDialogOpen(false); // Close the dialog
      setSelectedMetricKey(null); // Reset selected metric
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedMetricKey(null);
  };

  // Placeholder chart data
  const revenueTrendData = [
    { date: "Jan", Revenue: 4000 },
    { date: "Feb", Revenue: 3000 },
    { date: "Mar", Revenue: 5000 },
    { date: "Apr", Revenue: 4500 },
    { date: "May", Revenue: 6000 },
    { date: "Jun", Revenue: 5500 },
  ];

  const expenseBreakdownData = [
    { name: "Salaries", Expense: 12000 },
    { name: "Marketing", Expense: 5000 },
    { name: "Software", Expense: 3000 },
    { name: "Office", Expense: 2000 },
    { name: "Other", Expense: 1500 },
  ];

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* MRR Card */}
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick("mrr")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {metricDisplayNames.mrr}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financeData.mrr.value}</div>
              <p className="text-xs text-muted-foreground">
                {financeData.mrr.change} from last period
              </p>
            </CardContent>
          </Card>

          {/* Gross Profit Margin Card */}
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick("grossProfitMargin")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {metricDisplayNames.grossProfitMargin}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financeData.grossProfitMargin.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {financeData.grossProfitMargin.change} from last period
              </p>
            </CardContent>
          </Card>

          {/* Operating Cash Flow Card */}
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick("operatingCashFlow")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {metricDisplayNames.operatingCashFlow}
              </CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financeData.operatingCashFlow.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {financeData.operatingCashFlow.change} from previous quarter
              </p>
            </CardContent>
          </Card>

          {/* Burn Rate Card */}
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick("burnRate")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {metricDisplayNames.burnRate}
              </CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financeData.burnRate.value}
              </div>
              <p className="text-xs text-muted-foreground">
                Monthly operational expense rate ({financeData.burnRate.status})
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section - Uncommented and implemented */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>
                Monthly revenue over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChart
                data={revenueTrendData}
                dataKeys={["Revenue"]}
                height={300}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>
                Major expense categories (Monthly)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={expenseBreakdownData}
                dataKeys={["Expense"]}
                height={300}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog component - Placed outside the main layout flow, controlled by state */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedMetricKey && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Edit {metricDisplayNames[selectedMetricKey]}
                </DialogTitle>
                <DialogDescription>
                  Update the current value for{" "}
                  {metricDisplayNames[selectedMetricKey]}. Click save when
                  you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="metric-value" className="text-right">
                    Value
                  </Label>
                  <Input
                    id="metric-value"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                {/* Use Button with onClick for Cancel */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleSave}>
                  Save changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
