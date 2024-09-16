import { Link2 } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "../../utils/style";
import { Button, ButtonProps } from "../ui/Button";

type Props = ButtonProps;

const CopyLinkButton: React.FC<Props> = ({ className, onClick, ...props }) => {
  const [justCopied, setJustCopied] = useState(false);

  useEffect(() => {
    if (!justCopied) {
      return;
    }

    const timeout = setTimeout(() => {
      setJustCopied(false);
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [justCopied]);

  const handleCopyLink = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    navigator.clipboard.writeText(window.location.href);

    setJustCopied(true);

    onClick?.(e);
  };

  return (
    <Button
      className={cn("relative", className)}
      onClick={handleCopyLink}
      {...props}
    >
      <Link2 className={cn(justCopied && "opacity-10")} />
      <span className={cn(justCopied && "opacity-10")}>Copy Link</span>

      {justCopied && <span className="absolute">Copied!</span>}
    </Button>
  );
};

export default CopyLinkButton;
