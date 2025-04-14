
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { KpiData, KpiGoal, TimeFrame, GoalCategory } from "@/types/kpi";
import { v4 as uuidv4 } from "@/lib/uuid";

const initialKpiData: KpiData = {
  daily: {
    emailsSent: {
      id: uuidv4(),
      name: "Emails Sent",
      target: { min: 50, max: 100 },
      unit: "",
      currentValue: 0
    },
    coldCallsMade: {
      id: uuidv4(),
      name: "Cold Calls Made",
      target: { min: 30, max: 60 },
      unit: "",
      currentValue: 0
    },
    linkedinConnections: {
      id: uuidv4(),
      name: "LinkedIn Connections",
      target: { min: 10, max: 20 },
      unit: "",
      currentValue: 0
    },
    newLeadsProspected: {
      id: uuidv4(),
      name: "New Leads Prospected",
      target: { min: 15, max: 30 },
      unit: "",
      currentValue: 0
    },
    meetingsBooked: {
      id: uuidv4(),
      name: "Meetings Booked",
      target: { min: 1, max: 2 },
      unit: "",
      currentValue: 0
    }
  },
  weekly: {
    meetingsBooked: {
      id: uuidv4(),
      name: "Meetings Booked",
      target: { min: 5, max: 10 },
      unit: "",
      currentValue: 0
    },
    pipelineGenerated: {
      id: uuidv4(),
      name: "Pipeline Generated",
      target: { min: 25000, max: 100000 },
      unit: "$",
      currentValue: 0
    },
    newAccountsTouched: {
      id: uuidv4(),
      name: "New Accounts Touched",
      target: { min: 30, max: 60 },
      unit: "",
      currentValue: 0
    },
    personalizedLoomVideos: {
      id: uuidv4(),
      name: "Personalized Loom Videos",
      target: { min: 5, max: 10 },
      unit: "",
      currentValue: 0
    }
  },
  monthly: {
    sqlsCreated: {
      id: uuidv4(),
      name: "SQLs Created",
      target: { min: 20, max: 40 },
      unit: "",
      currentValue: 0
    },
    opportunitiesCreated: {
      id: uuidv4(),
      name: "Opportunities Created",
      target: { min: 10, max: 20 },
      unit: "",
      currentValue: 0
    },
    pipelineValueCreated: {
      id: uuidv4(),
      name: "Pipeline Value Created",
      target: { min: 100000, max: 500000 },
      unit: "$",
      currentValue: 0
    },
    closedDeals: {
      id: uuidv4(),
      name: "Closed Deals",
      target: { min: 2, max: 5 },
      unit: "",
      currentValue: 0
    }
  },
  history: []
};

interface KpiContextType {
  kpiData: KpiData;
  updateKpiValue: (timeFrame: TimeFrame, category: string, value: number) => void;
  updateGoalTarget: (timeFrame: TimeFrame, category: string, min: number, max: number) => void;
  addHistoryEntry: (date: string, metrics: Record<string, number>) => void;
  resetDailyValues: () => void;
  resetWeeklyValues: () => void;
  resetMonthlyValues: () => void;
}

const KpiContext = createContext<KpiContextType | undefined>(undefined);

export const KpiProvider = ({ children }: { children: ReactNode }) => {
  const [kpiData, setKpiData] = useState<KpiData>(() => {
    const savedData = localStorage.getItem('kpiData');
    return savedData ? JSON.parse(savedData) : initialKpiData;
  });

  useEffect(() => {
    localStorage.setItem('kpiData', JSON.stringify(kpiData));
  }, [kpiData]);

  const updateKpiValue = (timeFrame: TimeFrame, category: string, value: number) => {
    setKpiData(prevData => {
      const newData = { ...prevData };
      
      if (timeFrame === 'daily' && category in newData.daily) {
        newData.daily = {
          ...newData.daily,
          [category]: {
            ...newData.daily[category as keyof typeof newData.daily],
            currentValue: value
          }
        };
      } else if (timeFrame === 'weekly' && category in newData.weekly) {
        newData.weekly = {
          ...newData.weekly,
          [category]: {
            ...newData.weekly[category as keyof typeof newData.weekly],
            currentValue: value
          }
        };
      } else if (timeFrame === 'monthly' && category in newData.monthly) {
        newData.monthly = {
          ...newData.monthly,
          [category]: {
            ...newData.monthly[category as keyof typeof newData.monthly],
            currentValue: value
          }
        };
      }
      
      return newData;
    });
  };

  const updateGoalTarget = (timeFrame: TimeFrame, category: string, min: number, max: number) => {
    setKpiData(prevData => {
      const newData = { ...prevData };
      
      if (timeFrame === 'daily' && category in newData.daily) {
        newData.daily = {
          ...newData.daily,
          [category]: {
            ...newData.daily[category as keyof typeof newData.daily],
            target: { min, max }
          }
        };
      } else if (timeFrame === 'weekly' && category in newData.weekly) {
        newData.weekly = {
          ...newData.weekly,
          [category]: {
            ...newData.weekly[category as keyof typeof newData.weekly],
            target: { min, max }
          }
        };
      } else if (timeFrame === 'monthly' && category in newData.monthly) {
        newData.monthly = {
          ...newData.monthly,
          [category]: {
            ...newData.monthly[category as keyof typeof newData.monthly],
            target: { min, max }
          }
        };
      }
      
      return newData;
    });
  };

  const addHistoryEntry = (date: string, metrics: Record<string, number>) => {
    setKpiData(prevData => ({
      ...prevData,
      history: [...prevData.history, { date, metrics }]
    }));
  };

  const resetDailyValues = () => {
    setKpiData(prevData => {
      const newDaily = { ...prevData.daily };
      
      // Type-safe way to reset each value
      (Object.keys(newDaily) as Array<keyof typeof newDaily>).forEach(key => {
        newDaily[key] = {
          ...newDaily[key],
          currentValue: 0
        };
      });
      
      return {
        ...prevData,
        daily: newDaily
      };
    });
  };

  const resetWeeklyValues = () => {
    setKpiData(prevData => {
      const newWeekly = { ...prevData.weekly };
      
      // Type-safe way to reset each value
      (Object.keys(newWeekly) as Array<keyof typeof newWeekly>).forEach(key => {
        newWeekly[key] = {
          ...newWeekly[key],
          currentValue: 0
        };
      });
      
      return {
        ...prevData,
        weekly: newWeekly
      };
    });
  };

  const resetMonthlyValues = () => {
    setKpiData(prevData => {
      const newMonthly = { ...prevData.monthly };
      
      // Type-safe way to reset each value
      (Object.keys(newMonthly) as Array<keyof typeof newMonthly>).forEach(key => {
        newMonthly[key] = {
          ...newMonthly[key],
          currentValue: 0
        };
      });
      
      return {
        ...prevData,
        monthly: newMonthly
      };
    });
  };

  return (
    <KpiContext.Provider 
      value={{ 
        kpiData, 
        updateKpiValue, 
        updateGoalTarget, 
        addHistoryEntry,
        resetDailyValues,
        resetWeeklyValues,
        resetMonthlyValues
      }}
    >
      {children}
    </KpiContext.Provider>
  );
};

export const useKpi = () => {
  const context = useContext(KpiContext);
  if (context === undefined) {
    throw new Error('useKpi must be used within a KpiProvider');
  }
  return context;
};
