import { forwardRef } from "react";

import { cn } from "../../utils/style";

type Variant = "fill" | "outline" | "ghost";
type Color = "primary" | "foreground";
type Size = "sm" | "md";

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  color?: Color;
  size?: Size;
};

const coloredVariantClassNames: Record<Variant, Record<Color, string>> = {
  fill: {
    primary: "bg-primary text-primary-foreground hover:opacity-80",
    foreground: "bg-foreground text-background hover:opacity-80",
  },
  outline: {
    primary: "border border-primary text-primary hover:bg-primary/10",
    foreground:
      "border border-foreground text-foreground hover:bg-foreground/10",
  },
  ghost: {
    primary: "text-primary hover:bg-primary/10",
    foreground: "text-foreground hover:bg-foreground/10",
  },
};

const sizeClassNames: Record<Size, string> = {
  sm: "h-7 px-1.5 text-xs sm:h-8 sm:px-2 sm:text-sm rounded-ui",
  md: "h-8 px-2 text-sm sm:h-10 sm:px-4 sm:text-base rounded-ui-md",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "fill", color = "primary", size = "md", ...props },
    ref
  ) => {
    const coloredVariantClassName = coloredVariantClassNames[variant][color];
    const sizeClassName = sizeClassNames[size];

    return (
      <button
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-x-1.5 transition-all disabled:opacity-60 sm:gap-x-2",
          coloredVariantClassName,
          sizeClassName,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
