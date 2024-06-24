type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const IconButton: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={`size-10 flex justify-center items-center text-white rounded-full bg-slate-500 transition hover:bg-slate-400 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
