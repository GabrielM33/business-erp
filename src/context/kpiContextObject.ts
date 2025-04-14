import { createContext } from "react";
import { KpiContextType } from "@/types/kpi";

/**
 * Defines the React Context object for KPI data.
 * Separated from the Provider component to allow Fast Refresh.
 */
export const KpiContext = createContext<KpiContextType | undefined>(undefined);
