import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateProgress(
  current: number,
  min: number,
  max: number
): number {
  // Handle edge case where max target is zero or negative
  if (max <= 0) {
    // If max is 0 or less, progress calculation is ambiguous.
    // We'll return 100 if current is non-negative (or at least 0), 0 otherwise.
    // Alternatively, could return 0 always, or throw an error.
    return current >= 0 ? 100 : 0;
  }

  // Calculate progress as a percentage of the max target
  const progress = (current / max) * 100;

  // Ensure progress is clamped between 0 and 100
  return Math.min(Math.max(progress, 0), 100);
}

export function getProgressColor(progress: number): string {
  if (progress < 25) return "bg-danger";
  if (progress < 50) return "bg-warning";
  if (progress < 75) return "bg-info";
  return "bg-success";
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
