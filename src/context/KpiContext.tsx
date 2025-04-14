import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { KpiData, KpiGoal, TimeFrame } from "@/types/kpi";
import { v4 as uuidv4 } from "@/lib/uuid";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
  isLoading: boolean;
}

const KpiContext = createContext<KpiContextType | undefined>(undefined);

export const KpiProvider = ({ children }: { children: ReactNode }) => {
  const [kpiData, setKpiData] = useState<KpiData>(initialKpiData);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadKpiGoals = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('kpi_goals')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const newKpiData = { ...initialKpiData };
          
          data.forEach(goal => {
            const { time_frame, category, min_target, max_target } = goal;
            
            if (time_frame === 'daily' && category in newKpiData.daily) {
              newKpiData.daily[category as keyof typeof newKpiData.daily].target = {
                min: min_target,
                max: max_target
              };
            } else if (time_frame === 'weekly' && category in newKpiData.weekly) {
              newKpiData.weekly[category as keyof typeof newKpiData.weekly].target = {
                min: min_target,
                max: max_target
              };
            } else if (time_frame === 'monthly' && category in newKpiData.monthly) {
              newKpiData.monthly[category as keyof typeof newKpiData.monthly].target = {
                min: min_target,
                max: max_target
              };
            }
          });
          
          const today = new Date().toISOString().split('T')[0];
          const { data: entriesData, error: entriesError } = await supabase
            .from('kpi_entries')
            .select('*')
            .eq('user_id', user.id)
            .eq('entry_date', today);
            
          if (entriesError) throw entriesError;
          
          if (entriesData && entriesData.length > 0) {
            entriesData.forEach(entry => {
              const { time_frame, category, value } = entry;
              
              if (time_frame === 'daily' && category in newKpiData.daily) {
                newKpiData.daily[category as keyof typeof newKpiData.daily].currentValue = value;
              } else if (time_frame === 'weekly' && category in newKpiData.weekly) {
                newKpiData.weekly[category as keyof typeof newKpiData.weekly].currentValue = value;
              } else if (time_frame === 'monthly' && category in newKpiData.monthly) {
                newKpiData.monthly[category as keyof typeof newKpiData.monthly].currentValue = value;
              }
            });
          }
          
          setKpiData(newKpiData);
        }
      } catch (error: any) {
        toast({
          title: "Error loading KPI data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadKpiGoals();
  }, [user]);

  const updateKpiValue = async (timeFrame: TimeFrame, category: string, value: number) => {
    if (!user) return;
    
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
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('kpi_entries')
        .select('id')
        .eq('user_id', user.id)
        .eq('time_frame', timeFrame)
        .eq('category', category)
        .eq('entry_date', today)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data?.id) {
        const { error: updateError } = await supabase
          .from('kpi_entries')
          .update({ value })
          .eq('id', data.id);
          
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('kpi_entries')
          .insert({ 
            user_id: user.id,
            time_frame: timeFrame,
            category,
            value,
            entry_date: today
          });
          
        if (insertError) throw insertError;
      }
    } catch (error: any) {
      toast({
        title: "Error saving data",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateGoalTarget = async (timeFrame: TimeFrame, category: string, min: number, max: number) => {
    if (!user) return;
    
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
    
    try {
      const { data, error } = await supabase
        .from('kpi_goals')
        .select('id')
        .eq('user_id', user.id)
        .eq('time_frame', timeFrame)
        .eq('category', category)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data?.id) {
        const { error: updateError } = await supabase
          .from('kpi_goals')
          .update({ 
            min_target: min,
            max_target: max,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
          
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('kpi_goals')
          .insert({ 
            user_id: user.id,
            time_frame: timeFrame,
            category,
            min_target: min,
            max_target: max
          });
          
        if (insertError) throw insertError;
      }
    } catch (error: any) {
      toast({
        title: "Error saving goal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addHistoryEntry = async (date: string, metrics: Record<string, number>) => {
    if (!user) return;
    
    setKpiData(prevData => ({
      ...prevData,
      history: [...prevData.history, { date, metrics }]
    }));
  };

  const resetValues = async (timeFrame: TimeFrame) => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { error } = await supabase
        .from('kpi_entries')
        .delete()
        .eq('user_id', user.id)
        .eq('time_frame', timeFrame)
        .eq('entry_date', today);
        
      if (error) throw error;
      
      setKpiData(prevData => {
        const newData = { ...prevData };
        
        if (timeFrame === 'daily') {
          Object.keys(newData.daily).forEach(key => {
            newData.daily[key as keyof typeof newData.daily].currentValue = 0;
          });
        } else if (timeFrame === 'weekly') {
          Object.keys(newData.weekly).forEach(key => {
            newData.weekly[key as keyof typeof newData.weekly].currentValue = 0;
          });
        } else if (timeFrame === 'monthly') {
          Object.keys(newData.monthly).forEach(key => {
            newData.monthly[key as keyof typeof newData.monthly].currentValue = 0;
          });
        }
        
        return newData;
      });
      
      toast({
        title: `${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} values reset`,
        description: "All values have been reset to zero"
      });
    } catch (error: any) {
      toast({
        title: "Error resetting values",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetDailyValues = () => resetValues('daily');
  const resetWeeklyValues = () => resetValues('weekly');
  const resetMonthlyValues = () => resetValues('monthly');

  return (
    <KpiContext.Provider 
      value={{ 
        kpiData, 
        updateKpiValue, 
        updateGoalTarget, 
        addHistoryEntry,
        resetDailyValues,
        resetWeeklyValues,
        resetMonthlyValues,
        isLoading
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
