import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  CalendarDays,
  Gauge,
  LineChart,
  Settings,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

const items: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: <Gauge className="h-5 w-5" />,
    path: "/",
  },
  {
    title: "Daily KPIs",
    icon: <BarChart3 className="h-5 w-5" />,
    path: "/daily",
  },
  {
    title: "Weekly KPIs",
    icon: <LineChart className="h-5 w-5" />,
    path: "/weekly",
  },
  {
    title: "Monthly KPIs",
    icon: <CalendarDays className="h-5 w-5" />,
    path: "/monthly",
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    path: "/settings",
  },
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  return (
    <div
      className={cn("flex h-screen flex-col border-r bg-sidebar", className)}
    >
      <div className="flex h-16 items-center border-b px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-lg text-white"
        >
          <BarChart3 className="h-6 w-6" />
          <span>Envision Studios</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-white",
                location.pathname === item.path
                  ? "bg-sidebar-accent text-white"
                  : "transparent"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-white">Gabriel Moraes</p>
            <p className="text-xs text-white/70">Founder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
