import { useEffect } from "react";

type Props = { title: string; error?: unknown };

const ErrorTemplate: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  error,
  children,
}) => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(title, error);
  }, [error, title]);

  return (
    <div className="space-y-2">
      <div className="text-xl">{title}</div>
      {children}
    </div>
  );
};

export default ErrorTemplate;
