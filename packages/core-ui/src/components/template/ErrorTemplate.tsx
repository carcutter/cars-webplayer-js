import { cn } from "../../utils/style";

type Props = { text: string; className?: string };

const ErrorTemplate: React.FC<Props> = ({ text, className }) => {
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-y-4",
        className
      )}
    >
      <img
        className="h-20 small:h-28"
        src="https://cdn.car-cutter.com/libs/web-player/v3/assets/car_placeholder.png"
      />
      <div className="text-2xl font-bold">{text}</div>
    </div>
  );
};

export default ErrorTemplate;
