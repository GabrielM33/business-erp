import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { KpiGoal, TimeFrame } from "@/types/kpi";
import { useKpi } from "@/hooks/useKpi";

interface KpiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpi: KpiGoal;
  timeFrame: TimeFrame;
  category: string;
}

export function KpiDialog({
  open,
  onOpenChange,
  kpi,
  timeFrame,
  category,
}: KpiDialogProps) {
  const { updateKpiValue, updateGoalTarget } = useKpi();

  const [newValue, setNewValue] = useState(kpi.currentValue.toString());
  const [minTarget, setMinTarget] = useState(kpi.target.min.toString());
  const [maxTarget, setMaxTarget] = useState(kpi.target.max.toString());

  const handleSave = () => {
    // Update the current value
    updateKpiValue(timeFrame, category, Number(newValue));

    // Update the target if changed
    if (
      Number(minTarget) !== kpi.target.min ||
      Number(maxTarget) !== kpi.target.max
    ) {
      updateGoalTarget(
        timeFrame,
        category,
        Number(minTarget),
        Number(maxTarget)
      );
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{kpi.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="current-value">Current Value</Label>
            <Input
              id="current-value"
              type="number"
              min="0"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter current value"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="min-target">Min Target</Label>
              <Input
                id="min-target"
                type="number"
                min="0"
                value={minTarget}
                onChange={(e) => setMinTarget(e.target.value)}
                placeholder="Min target"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max-target">Max Target</Label>
              <Input
                id="max-target"
                type="number"
                min="0"
                value={maxTarget}
                onChange={(e) => {
                  const newMax = e.target.value;
                  // Ensure max is >= min
                  if (Number(newMax) >= Number(minTarget)) {
                    setMaxTarget(newMax);
                  }
                }}
                placeholder="Max target"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
