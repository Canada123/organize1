import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility for merging Tailwind CSS class names conditionally. Combines `clsx`
 * and `tailwind-merge` so classes are deduplicated correctly.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
