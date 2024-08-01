export type SpinnerProps = {
  color?: "primary" | "neutral";
  size?: "sm" | "md" | "lg";
};

const Spinner: React.FC<SpinnerProps> = ({
  color = "neutral",
  size = "md",
}) => {
  let colorClassName: string;
  switch (color) {
    case "primary":
      colorClassName = "border-primary";
      break;
    case "neutral":
      colorClassName = "border-background";
      break;
  }

  let sizeClassName: string;
  switch (size) {
    case "sm":
      sizeClassName = "size-4 border";
      break;
    case "md":
      sizeClassName = "size-8 border-2";
      break;
    case "lg":
      sizeClassName = "size-12 border-4";
      break;
  }

  return (
    <div
      className={`inline-block ${sizeClassName} animate-rotation rounded-full ${colorClassName} border-b-transparent`}
    />
  );
};

export default Spinner;
