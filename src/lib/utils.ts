import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: string) {
  const num = parseInt(value.replace(/[^\d]/g, ''));
  if (!value || isNaN(num)) return '';
  return '$' + num.toLocaleString('en-US');
};