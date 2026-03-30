import React, { useMemo } from "react";

import { useGlobalContext } from "../../providers/GlobalContext";
import { getThemeConfig } from "../../theme-config";
import { cn } from "../../utils/style";

type Props = { text: string; className?: string };

const ImagePlaceholder: React.FC = () => {
  let url =
    "https://cdn.car-cutter.com/libs/web-player/v3/assets/car_placeholder.png";
  const { themeConfig } = useGlobalContext();
  const theme = useMemo(() => getThemeConfig(themeConfig), [themeConfig]);
  if (theme?.errorImage) {
    url = theme.errorImage;
  }
  const props = {
    className: theme?.errorImage ? undefined : "h-20 small:h-28",
    style: theme?.errorImage ? { height: "12rem", width: "auto" } : undefined,
  };
  return <img {...props} src={url} />;
};

const ErrorTemplate: React.FC<Props> = ({ text, className }) => {
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-y-4",
        className
      )}
    >
      <ImagePlaceholder />
      <div className="text-2xl font-bold">{text}</div>
    </div>
  );
};

export default ErrorTemplate;
