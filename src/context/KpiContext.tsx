import { useState, useEffect, ReactNode } from "react";
import {
  KpiData,
  TimeFrame,
  WeeklyActivityTrendDataPoint,
  MonthlyPipelineDataPoint,
} from "@/types/kpi";
import { v4 as uuidv4 } from "@/lib/uuid";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { KpiContext } from "./kpiContextObject";

const initialKpiData: KpiData = {
  daily: {
    newLeadsProspected: {
      id: uuidv4(),
      name: "New Leads Prospected",
      target: { min: 50, max: 100 },
      unit: "",
      currentValue: 0,
    },
    emailsSent: {
      id: uuidv4(),
      name: "Emails Sent",
      target: { min: 30, max: 60 },
      unit: "",
      currentValue: 0,
    },
    linkedinDMsSent: {
      id: uuidv4(),
      name: "LinkedIn DMs Sent",
      target: { min: 10, max: 20 },
      unit: "",
      currentValue: 0,
    },
    followUps: {
      id: uuidv4(),
      name: "Follow Ups",
      target: { min: 15, max: 30 },
      unit: "",
      currentValue: 0,
    },
    meetingsBooked: {
      id: uuidv4(),
      name: "Meetings Booked",
      target: { min: 1, max: 2 },
      unit: "",
      currentValue: 0,
    },
  },
  weekly: {
    meetingsBooked: {
      id: uuidv4(),
      name: "Meetings Booked",
      target: { min: 5, max: 10 },
      unit: "",
      currentValue: 0,
    },
    pipelineGenerated: {
      id: uuidv4(),
      name: "Pipeline Generated",
      target: { min: 25000, max: 100000 },
      unit: "$",
      currentValue: 0,
    },
    newAccountsTouched: {
      id: uuidv4(),
      name: "New Accounts Touched",
      target: { min: 30, max: 60 },
      unit: "",
      currentValue: 0,
    },
    personalizedLoomVideos: {
      id: uuidv4(),
      name: "Personalized Loom Videos",
      target: { min: 5, max: 10 },
      unit: "",
      currentValue: 0,
    },
  },
  monthly: {
    sqlsCreated: {
      id: uuidv4(),
      name: "SQLs Created",
      target: { min: 20, max: 40 },
      unit: "",
      currentValue: 0,
    },
    opportunitiesCreated: {
      id: uuidv4(),
      name: "Opportunities Created",
      target: { min: 10, max: 20 },
      unit: "",
      currentValue: 0,
    },
    pipelineValueCreated: {
      id: uuidv4(),
      name: "Pipeline Value Created",
      target: { min: 100000, max: 500000 },
      unit: "$",
      currentValue: 0,
    },
    closedDeals: {
      id: uuidv4(),
      name: "Closed Deals",
      target: { min: 2, max: 5 },
      unit: "",
      currentValue: 0,
    },
  },
  history: [],
};

export const KpiProvider = ({ children }: { children: ReactNode }) => {
  const [kpiData, setKpiData] = useState<KpiData>(initialKpiData);
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyActivityTrend, setWeeklyActivityTrend] = useState<
    WeeklyActivityTrendDataPoint[]
  >([]);
  const [monthlyPipelineTrend, setMonthlyPipelineTrend] = useState<
    MonthlyPipelineDataPoint[]
  >([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const getWeekStartDate = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const getMonthStartDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  useEffect(() => {
    const loadKpiData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data: goalsData, error: goalsError } = await supabase
          .from("kpi_goals")
          .select("*")
          .eq("user_id", user.id);

        if (goalsError) throw goalsError;

        const newKpiData = JSON.parse(JSON.stringify(initialKpiData));

        if (goalsData && goalsData.length > 0) {
          goalsData.forEach((goal) => {
            const { time_frame, category, min_target, max_target } = goal;
            if (time_frame === "daily" && category in newKpiData.daily) {
              newKpiData.daily[
                category as keyof typeof newKpiData.daily
              ].target = { min: min_target, max: max_target };
            } else if (
              time_frame === "weekly" &&
              category in newKpiData.weekly
            ) {
              newKpiData.weekly[
                category as keyof typeof newKpiData.weekly
              ].target = { min: min_target, max: max_target };
            } else if (
              time_frame === "monthly" &&
              category in newKpiData.monthly
            ) {
              newKpiData.monthly[
                category as keyof typeof newKpiData.monthly
              ].target = { min: min_target, max: max_target };
            }
          });
        }

        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        const { data: todayEntriesData, error: todayEntriesError } =
          await supabase
            .from("kpi_entries")
            .select("*")
            .eq("user_id", user.id)
            .eq("entry_date", todayStr);

        if (todayEntriesError) throw todayEntriesError;

        if (todayEntriesData && todayEntriesData.length > 0) {
          todayEntriesData.forEach((entry) => {
            const { time_frame, category, value } = entry;
            if (time_frame === "daily" && category in newKpiData.daily) {
              newKpiData.daily[
                category as keyof typeof newKpiData.daily
              ].currentValue = value;
            } else if (
              time_frame === "weekly" &&
              category in newKpiData.weekly
            ) {
              newKpiData.weekly[
                category as keyof typeof newKpiData.weekly
              ].currentValue = value;
            } else if (
              time_frame === "monthly" &&
              category in newKpiData.monthly
            ) {
              newKpiData.monthly[
                category as keyof typeof newKpiData.monthly
              ].currentValue = value;
            }
          });
        }

        setKpiData(newKpiData);

        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

        const { data: dailyEntries, error: dailyEntriesError } = await supabase
          .from("kpi_entries")
          .select("entry_date, category, value")
          .eq("user_id", user.id)
          .eq("time_frame", "daily")
          .in("category", [
            "newLeadsProspected",
            "emailsSent",
            "linkedinDMsSent",
            "followUps",
            "meetingsBooked",
          ])
          .gte("entry_date", sevenDaysAgoStr)
          .lte("entry_date", todayStr)
          .order("entry_date", { ascending: true });

        if (dailyEntriesError) throw dailyEntriesError;

        const trendData: WeeklyActivityTrendDataPoint[] = [];
        type TempTrendDataType = {
          Leads: number;
          Emails: number;
          DMs: number;
          FollowUps: number;
          Meetings: number;
        };
        const tempTrendData: { [date: string]: TempTrendDataType } = {};
        const dateMap: { [dateStr: string]: string } = {};

        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
          });
          dateMap[dateStr] = dayName;
          tempTrendData[dateStr] = {
            Leads: 0,
            Emails: 0,
            DMs: 0,
            FollowUps: 0,
            Meetings: 0,
          };
        }

        if (dailyEntries) {
          dailyEntries.forEach((entry) => {
            if (tempTrendData[entry.entry_date]) {
              switch (entry.category) {
                case "newLeadsProspected":
                  tempTrendData[entry.entry_date].Leads = entry.value;
                  break;
                case "emailsSent":
                  tempTrendData[entry.entry_date].Emails = entry.value;
                  break;
                case "linkedinDMsSent":
                  tempTrendData[entry.entry_date].DMs = entry.value;
                  break;
                case "followUps":
                  tempTrendData[entry.entry_date].FollowUps = entry.value;
                  break;
                case "meetingsBooked":
                  tempTrendData[entry.entry_date].Meetings = entry.value;
                  break;
              }
            }
          });
        }

        Object.keys(tempTrendData)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .forEach((dateStr) => {
            const dataPoint: WeeklyActivityTrendDataPoint = {
              date: dateMap[dateStr],
              Leads: tempTrendData[dateStr].Leads,
              Emails: tempTrendData[dateStr].Emails,
              DMs: tempTrendData[dateStr].DMs,
              FollowUps: tempTrendData[dateStr].FollowUps,
              Meetings: tempTrendData[dateStr].Meetings,
            };
            trendData.push(dataPoint);
          });

        setWeeklyActivityTrend(trendData);

        const weekStartDates: string[] = [];
        const initialWeekStart = getWeekStartDate(new Date(today));
        for (let i = 0; i < 4; i++) {
          const weekStartDate = new Date(initialWeekStart);
          weekStartDate.setDate(initialWeekStart.getDate() - i * 7);
          weekStartDates.push(weekStartDate.toISOString().split("T")[0]);
        }
        weekStartDates.reverse();

        const fourWeeksAgoStr = weekStartDates[0];

        const { data: weeklyPipelineEntries, error: weeklyPipelineError } =
          await supabase
            .from("kpi_entries")
            .select("entry_date, value")
            .eq("user_id", user.id)
            .eq("time_frame", "weekly")
            .eq("category", "pipelineGenerated")
            .gte("entry_date", fourWeeksAgoStr)
            .lte("entry_date", todayStr)
            .order("entry_date", { ascending: true });

        if (weeklyPipelineError) throw weeklyPipelineError;

        const pipelineTrend: MonthlyPipelineDataPoint[] = [];
        const tempPipelineData: { [weekNum: number]: number } = {};

        if (weeklyPipelineEntries) {
          weeklyPipelineEntries.forEach((entry) => {
            for (let i = 0; i < weekStartDates.length; i++) {
              const weekStart = new Date(weekStartDates[i]);
              const nextWeekStart = new Date(weekStart);
              nextWeekStart.setDate(weekStart.getDate() + 7);
              const entryDate = new Date(entry.entry_date);

              if (entryDate >= weekStart && entryDate < nextWeekStart) {
                tempPipelineData[i + 1] =
                  (tempPipelineData[i + 1] || 0) + entry.value;
                break;
              }
            }
          });
        }

        for (let i = 1; i <= 4; i++) {
          pipelineTrend.push({
            name: `Week ${i}`,
            Value: tempPipelineData[i] || 0,
          });
        }

        setMonthlyPipelineTrend(pipelineTrend);
      } catch (error: unknown) {
        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast({
          title: "Error loading KPI data",
          description: errorMessage,
          variant: "destructive",
        });
        setWeeklyActivityTrend([]);
        setMonthlyPipelineTrend([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadKpiData();
  }, [user, toast]);

  const updateKpiValue = async (
    timeFrame: TimeFrame,
    category: string,
    value: number
  ) => {
    if (!user) return;

    setKpiData((prevData) => {
      const newData = { ...prevData };

      if (timeFrame === "daily" && category in newData.daily) {
        newData.daily = {
          ...newData.daily,
          [category]: {
            ...newData.daily[category as keyof typeof newData.daily],
            currentValue: value,
          },
        };
      } else if (timeFrame === "weekly" && category in newData.weekly) {
        newData.weekly = {
          ...newData.weekly,
          [category]: {
            ...newData.weekly[category as keyof typeof newData.weekly],
            currentValue: value,
          },
        };
      } else if (timeFrame === "monthly" && category in newData.monthly) {
        newData.monthly = {
          ...newData.monthly,
          [category]: {
            ...newData.monthly[category as keyof typeof newData.monthly],
            currentValue: value,
          },
        };
      }

      return newData;
    });

    try {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("kpi_entries")
        .select("id")
        .eq("user_id", user.id)
        .eq("time_frame", timeFrame)
        .eq("category", category)
        .eq("entry_date", today)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data?.id) {
        const { error: updateError } = await supabase
          .from("kpi_entries")
          .update({ value })
          .eq("id", data.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("kpi_entries")
          .insert({
            user_id: user.id,
            time_frame: timeFrame,
            category,
            value,
            entry_date: today,
          });

        if (insertError) throw insertError;
      }
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error saving data",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const updateGoalTarget = async (
    timeFrame: TimeFrame,
    category: string,
    min: number,
    max: number
  ) => {
    if (!user) return;

    setKpiData((prevData) => {
      const newData = { ...prevData };

      if (timeFrame === "daily" && category in newData.daily) {
        newData.daily = {
          ...newData.daily,
          [category]: {
            ...newData.daily[category as keyof typeof newData.daily],
            target: { min, max },
          },
        };
      } else if (timeFrame === "weekly" && category in newData.weekly) {
        newData.weekly = {
          ...newData.weekly,
          [category]: {
            ...newData.weekly[category as keyof typeof newData.weekly],
            target: { min, max },
          },
        };
      } else if (timeFrame === "monthly" && category in newData.monthly) {
        newData.monthly = {
          ...newData.monthly,
          [category]: {
            ...newData.monthly[category as keyof typeof newData.monthly],
            target: { min, max },
          },
        };
      }

      return newData;
    });

    try {
      const { data, error } = await supabase
        .from("kpi_goals")
        .select("id")
        .eq("user_id", user.id)
        .eq("time_frame", timeFrame)
        .eq("category", category)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data?.id) {
        const { error: updateError } = await supabase
          .from("kpi_goals")
          .update({
            min_target: min,
            max_target: max,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("kpi_goals").insert({
          user_id: user.id,
          time_frame: timeFrame,
          category,
          min_target: min,
          max_target: max,
        });

        if (insertError) throw insertError;
      }
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error saving goal",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const addHistoryEntry = async (
    date: string,
    metrics: Record<string, number>
  ) => {
    if (!user) return;

    setKpiData((prevData) => ({
      ...prevData,
      history: [...prevData.history, { date, metrics }],
    }));
  };

  const resetValues = async (timeFrame: TimeFrame) => {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    try {
      const { error } = await supabase
        .from("kpi_entries")
        .delete()
        .eq("user_id", user.id)
        .eq("time_frame", timeFrame)
        .eq("entry_date", today);

      if (error) throw error;

      setKpiData((prevData) => {
        const newData = { ...prevData };

        if (timeFrame === "daily") {
          Object.keys(newData.daily).forEach((key) => {
            newData.daily[key as keyof typeof newData.daily].currentValue = 0;
          });
        } else if (timeFrame === "weekly") {
          Object.keys(newData.weekly).forEach((key) => {
            newData.weekly[key as keyof typeof newData.weekly].currentValue = 0;
          });
        } else if (timeFrame === "monthly") {
          Object.keys(newData.monthly).forEach((key) => {
            newData.monthly[
              key as keyof typeof newData.monthly
            ].currentValue = 0;
          });
        }

        return newData;
      });

      toast({
        title: `${
          timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)
        } values reset`,
        description: "All values have been reset to zero",
      });
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error resetting values",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const resetDailyValues = () => resetValues("daily");
  const resetWeeklyValues = () => resetValues("weekly");
  const resetMonthlyValues = () => resetValues("monthly");

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
        isLoading,
        weeklyActivityTrend,
        monthlyPipelineTrend,
      }}
    >
      {children}
    </KpiContext.Provider>
  );
};
