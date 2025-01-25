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
