import { forwardRef } from "react";

import { cn } from "../../utils/style";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const selectChevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.75'%3E%3Cpath d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`;

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full appearance-none rounded-md border border-border bg-background bg-no-repeat px-3 py-2 pr-10 text-sm focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{
          backgroundImage: selectChevron,
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "1rem 1rem",
          ...style,
        }}
        {...props}
      />
    );
  }
);
Select.displayName = "Select";

export { Select };
