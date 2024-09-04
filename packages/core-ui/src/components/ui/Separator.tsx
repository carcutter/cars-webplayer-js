import { cn } from "../../utils/style";

type Color = "primary" | "neutral" | "background" | "foreground";

type Props = {
  color?: Color;
  orientation?: "horizontal" | "vertical";
};

const colorClassNames: Record<Color, string> = {
  primary: "bg-primary/50",
  neutral: "bg-neutral/50",
  background: "bg-background/50",
  foreground: "bg-foreground/50",
};

const Separator: React.FC<Props> = ({
  color = "neutral",
  orientation = "horizontal",
}) => {
  const colorClassName = colorClassNames[color];
  const sizingClasses =
    orientation === "horizontal" ? "h-px w-full" : "w-px h-full";

  return <div className={cn(colorClassName, sizingClasses)} />;
};

export default Separator;
