import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  // Split the name into words
  const words = name.split(" ");

  // Map each word to its first character and convert to uppercase
  const initials = words.map((word) => word[0].toUpperCase());

  // Join the initials into a single string
  return initials.join("");
}
