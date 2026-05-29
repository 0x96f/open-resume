import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base font-normal text-gray-900 shadow-sm outline-none focus-visible:border-[color:var(--theme-primary)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--theme-primary)]",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";
