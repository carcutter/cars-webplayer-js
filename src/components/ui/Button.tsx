type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "fill" | "ghost";
  shape?: "button" | "icon";
  color?: "primary" | "neutral";
};

const Button: React.FC<React.PropsWithChildren<Props>> = ({
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
        variantClassName = "bg-primary text-background hover:opacity-80";
      } else {
        variantClassName = "bg-background text-neutral hover:opacity-80";
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

  const shapeClassName =
    shape === "button" ? "h-8 px-2 rounded-sm" : "size-8 p-1.5 rounded-full";

  return (
    <button
      className={`${variantClassName} ${shapeClassName} text-sm flex justify-center items-center transition disabled:opacity-75 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
