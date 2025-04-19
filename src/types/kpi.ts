export interface KpiGoal {
  id: string;
  name: string;
  target: {
    min: number;
    max: number;
  };
  unit: string;
  currentValue: number;
}

export interface DailyGoals {
  newLeadsProspected: KpiGoal;
  emailsSent: KpiGoal;
  DMsSent: KpiGoal;
  followUps: KpiGoal;
  meetingsBooked: KpiGoal;
}

export interface WeeklyGoals {
  meetingsBooked: KpiGoal;
  pipelineGenerated: KpiGoal;
  newAccountsTouched: KpiGoal;
  personalizedLoomVideos: KpiGoal;
}

export interface MonthlyGoals {
  sqlsCreated: KpiGoal;
  opportunitiesCreated: KpiGoal;
  pipelineValueCreated: KpiGoal;
  closedDeals: KpiGoal;
}

export interface KpiData {
  daily: DailyGoals;
  weekly: WeeklyGoals;
  monthly: MonthlyGoals;
  history: {
    date: string;
    metrics: Record<string, number>;
  }[];
}

// New types for chart data
export interface WeeklyActivityTrendDataPoint {
  date: string; // e.g., "Mon", "Tue"
  Leads: number;
  Emails: number;
  DMs: number;
  FollowUps: number;
  Meetings: number;
  [key: string]: string | number; // Add index signature for chart compatibility
}

export interface MonthlyPipelineDataPoint {
  name: string; // e.g., "Week 1", "Week 2"
  Value: number;
  [key: string]: string | number; // Add index signature for chart compatibility
}

// Add KpiContextType definition here
export interface KpiContextType {
  kpiData: KpiData;
  updateKpiValue: (
    timeFrame: TimeFrame,
    category: string,
    value: number
  ) => void;
  updateGoalTarget: (
    timeFrame: TimeFrame,
    category: string,
    min: number,
    max: number
  ) => void;
  addHistoryEntry: (date: string, metrics: Record<string, number>) => void;
  resetDailyValues: () => void;
  resetWeeklyValues: () => void;
  resetMonthlyValues: () => void;
  isLoading: boolean;
  weeklyActivityTrend: WeeklyActivityTrendDataPoint[];
  monthlyPipelineTrend: MonthlyPipelineDataPoint[];
}

export type TimeFrame = "daily" | "weekly" | "monthly";
export type GoalCategory =
  | keyof DailyGoals
  | keyof WeeklyGoals
  | keyof MonthlyGoals;
