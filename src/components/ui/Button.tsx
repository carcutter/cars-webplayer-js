export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "fill" | "ghost";
  shape?: "button" | "icon";
  color?: "primary" | "neutral";
};

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  variant = "fill",
  shape = "button",
  color = "primary",
  className = "",
  children,
  ...props
}) => {
  let variantClassName: string;

  switch (variant) {
    case "fill":
      if (color === "primary") {
        variantClassName =
          "bg-primary text-primary-foreground hover:opacity-80";
      } else {
        variantClassName =
          "bg-background text-neutral-foreground hover:opacity-80";
      }
      break;
    case "ghost":
      if (color === "primary") {
        variantClassName = "bg-transparent text-foreground hover:bg-primary/25";
      } else {
        variantClassName = "bg-transparent text-neutral hover:bg-neutral/25";
      }
      break;
  }

  const shapeClassName = shape === "button" ? "h-8 px-2" : "size-8 p-2";

  return (
    <button
      className={`${variantClassName} ${shapeClassName} flex items-center justify-center rounded-ui text-sm transition disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
