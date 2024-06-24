type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={`h-10 px-2 rounded bg-slate-500 transition hover:bg-slate-400 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
