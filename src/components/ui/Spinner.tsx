type Color = "primary" | "neutral";
type Size = "sm" | "md" | "lg";

export type SpinnerProps = {
  color?: Color;
  size?: Size;
};

const colorClassNames: Record<Color, string> = {
  primary: "border-primary",
  neutral: "border-background",
};

const sizeClassNames: Record<Size, string> = {
  sm: "size-4 border",
  md: "size-8 border-2",
  lg: "size-12 border-4",
};

const Spinner: React.FC<SpinnerProps> = ({
  color = "neutral",
  size = "md",
}) => {
  const colorClassName = colorClassNames[color];
  const sizeClassName = sizeClassNames[size];

  return (
    <div
      className={`inline-block ${sizeClassName} animate-rotation rounded-full ${colorClassName} border-b-transparent`}
    />
  );
};

export default Spinner;
