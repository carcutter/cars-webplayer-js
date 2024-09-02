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
          "flex h-6 w-10 items-center justify-center rounded-full transition-colors",
          enabled ? "bg-primary" : "bg-neutral"
        )}
      >
        <div
          className={cn(
            "flex size-5 items-center justify-center rounded-full bg-background transition-transform",
            enabled
              ? "translate-x-2 text-primary"
              : "-translate-x-2 text-neutral"
          )}
        >
          {children}
        </div>
      </div>
    </label>
  );
};

export default Switch;
