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

export const randomTailwindColor = ({
  prefix = "bg",
}: {
  prefix?: string;
}): string => {
  const colors = [
    "gray",
    "red",
    "yellow",
    "green",
    "blue",
    "indigo",
    "purple",
    "pink",
  ];
  const range = { min: 1, max: 9 };
  const prfx = prefix;

  const random = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const shade = random(range.min, range.max) * 100;
  const color = colors[random(0, colors.length - 1)];

  return `!${prfx}-${color}-${shade}`;
};

export function randomTailwindHexColor(): string {
  const tailwindColors = {
    // red: ["#f87171", "#ef4444", "#dc2626", "#b91c1c"],
    // yellow: ["#facc15", "#eab308", "#ca8a04", "#a16207"],
    green: ["#4ade80", "#22c55e", "#16a34a", "#15803d"],
    // blue: ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8"],
    // purple: ["#c084fc", "#a855f7", "#9333ea", "#7e22ce"],
    // pink: ["#f472b6", "#ec4899", "#db2777", "#be185d"],
  };

  const colors = Object.keys(tailwindColors) as (keyof typeof tailwindColors)[];

  const random = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

  const color = random(colors);
  const shade = random(tailwindColors[color]);

  return shade; // Hex color code
}
