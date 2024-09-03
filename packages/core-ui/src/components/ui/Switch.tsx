import { cn } from "../../utils/style";

type Props = {
  enabled: boolean;
  onToggle: () => void;
  label?: string;
  className?: string;
};

const Switch: React.FC<React.PropsWithChildren<Props>> = ({
  enabled,
  onToggle,
  label,
  className,
  children,
}) => {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-center gap-x-2",
        className
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={enabled}
        onChange={onToggle}
      />

      {label && <div className="text-xs text-background">{label}</div>}

      <div
        className={cn(
          "flex h-5 w-8 items-center justify-center rounded-full transition-colors",
          enabled ? "bg-primary" : "bg-background/60"
        )}
      >
        <div
          className={cn(
            "flex size-4 items-center justify-center rounded-full p-0.5 transition",
            enabled
              ? "translate-x-1.5 bg-primary-foreground text-primary"
              : "-translate-x-1.5 bg-background text-foreground"
          )}
        >
          {children}
        </div>
      </div>
    </label>
  );
};

export default Switch;
