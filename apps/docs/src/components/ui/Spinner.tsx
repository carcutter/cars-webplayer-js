import styles from "./Spinner.module.css";

type Color = "primary" | "neutral";
type Size = "sm" | "md" | "lg";

export type SpinnerProps = {
  color?: Color;
  size?: Size;
};

const colorClassNames: Record<Color, string> = {
  primary: styles.colorPrimary,
  neutral: styles.colorNeutral,
};

const sizeClassNames: Record<Size, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const Spinner: React.FC<SpinnerProps> = ({
  color = "neutral",
  size = "md",
}) => {
  const colorClassName = colorClassNames[color];
  const sizeClassName = sizeClassNames[size];

  return (
    <div className={`${styles.spinner} ${sizeClassName} ${colorClassName}`} />
  );
};

export default Spinner;
