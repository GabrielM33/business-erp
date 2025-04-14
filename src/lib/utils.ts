
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function calculateProgress(current: number, min: number, max: number): number {
  if (current <= min) return 0;
  if (current >= max) return 100;
  
  const range = max - min;
  const progress = ((current - min) / range) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

export function getProgressColor(progress: number): string {
  if (progress < 25) return 'bg-danger';
  if (progress < 50) return 'bg-warning';
  if (progress < 75) return 'bg-info';
  return 'bg-success';
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
