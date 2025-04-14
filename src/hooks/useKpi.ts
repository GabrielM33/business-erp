import { useContext } from "react";
import { KpiContext } from "@/context/kpiContextObject";

/**
 * Custom hook to access the KPI context.
 * Ensures the hook is used within a KpiProvider.
 */
export const useKpi = () => {
  const context = useContext(KpiContext);
  if (context === undefined) {
    throw new Error("useKpi must be used within a KpiProvider");
  }
  return context;
};
