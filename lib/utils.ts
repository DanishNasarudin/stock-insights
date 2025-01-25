import { clsx, type ClassValue } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleTryCatchError = (error: any, label?: string) => {
  const title = label || "Undefined";

  console.error(`${title}: `, error);
  return {
    success: false,
    error:
      error instanceof Error ? `${title}: ${error.message}` : `Error ${title}`,
  };
};

export const handleToastError = (
  error: any,
  message?: string,
  toastId?: string
) => {
  const errorMsg = error.message
    ? error.message
    : message
    ? message
    : "Something went wrong!";
  if (toastId) {
    toast.error(errorMsg, { id: "create-prompt" });
  } else {
    toast.error(errorMsg);
  }
};

export const createURL = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramString = params.toString();
  const queryString = `${paramString.length ? `?` : ""}${paramString}`;

  return `${pathname}${queryString}`;
};

export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  const daySuffix = (d: number): string => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12; // Convert 24-hour time to 12-hour
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours24 >= 12 ? "pm" : "am";

  return `${day}${daySuffix(
    day
  )} ${month} ${year}, ${hours12}:${minutes}${ampm}`;
};
