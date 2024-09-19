import { cn } from "../../utils/style";

type Color = "primary" | "foreground" | "background";
type Size = "sm" | "md" | "lg";

export type SpinnerProps = {
  color?: Color;
  size?: Size;
};

const colorClassNames: Record<Color, string> = {
  primary: "border-primary",
  foreground: "border-foreground",
  background: "border-background",
};

const sizeClassNames: Record<Size, string> = {
  sm: "size-4 border",
  md: "size-8 border-2",
  lg: "size-12 border-4",
};

const Spinner: React.FC<SpinnerProps> = ({
  color = "foreground",
  size = "md",
}) => {
  const colorClassName = colorClassNames[color];
  const sizeClassName = sizeClassNames[size];

  return (
    <div
      className={cn(
        "inline-block animate-rotation rounded-full border-b-transparent",
        sizeClassName,
        colorClassName
      )}
    />
  );
};

export default Spinner;
