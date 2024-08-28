type Variant = "fill" | "ghost";
type Shape = "button" | "icon";
type Color = "primary" | "neutral";

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  shape?: Shape;
  color?: Color;
};

const coloredVariantClassNames: Record<Variant, Record<Color, string>> = {
  fill: {
    primary: "bg-primary text-primary-foreground hover:opacity-80",
    neutral: "bg-background text-neutral-foreground hover:opacity-80",
  },
  ghost: {
    primary: "bg-transparent text-foreground hover:bg-primary/25",
    neutral: "bg-transparent text-neutral hover:bg-neutral/25",
  },
};

const shapeClassNames: Record<Shape, string> = {
  button: "h-8 px-2",
  icon: "size-8 p-2",
};

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  variant = "fill",
  shape = "button",
  color = "primary",
  className = "",
  children,
  ...props
}) => {
  const coloredVariantClassName = coloredVariantClassNames[variant][color];
  const shapeClassName = shapeClassNames[shape];

  return (
    <button
      className={`${coloredVariantClassName} ${shapeClassName} flex items-center justify-center rounded-ui text-sm transition disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
