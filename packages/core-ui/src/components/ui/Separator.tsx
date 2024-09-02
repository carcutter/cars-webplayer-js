import { cn } from "../../utils/style";

type Props = {
  color?: "background" | "neutral";
  orientation?: "horizontal" | "vertical";
};

const Separator: React.FC<Props> = ({
  color = "neutral",
  orientation = "horizontal",
}) => {
  const colorClassName =
    color === "background" ? "bg-background/50" : "bg-neutral/50";
  const sizingClasses =
    orientation === "horizontal" ? "h-px w-full" : "w-px h-full";

  return <div className={cn(colorClassName, sizingClasses)} />;
};

export default Separator;
