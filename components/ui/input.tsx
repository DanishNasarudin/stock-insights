import * as React from "react";

import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

export interface InputProps extends React.ComponentProps<"input"> {
  isSearch?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ isSearch = false, className, type, ...props }, ref) => {
    return (
      <div
        className={cn(
          " [&:has(:focus-visible)]:ring-ring flex flex-row-reverse items-center px-2 [&:has(:focus-visible)]:ring-1 rounded-md border-input border bg-transparent shadow-sm [&:has(:disabled)]:cursor-not-allowed [&:has(:disabled)]:opacity-50 transition-colors",
          className
        )}
      >
        <input
          type={type}
          className={cn(
            "peer flex h-9 w-full bg-transparent px-3 py-1 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {isSearch && (
          <SearchIcon
            size={16}
            className="text-input peer-focus-visible:text-ring transition-colors"
          />
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
