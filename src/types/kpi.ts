
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
  emailsSent: KpiGoal;
  coldCallsMade: KpiGoal;
  linkedinConnections: KpiGoal;
  newLeadsProspected: KpiGoal;
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

export type TimeFrame = 'daily' | 'weekly' | 'monthly';
export type GoalCategory = keyof DailyGoals | keyof WeeklyGoals | keyof MonthlyGoals;
