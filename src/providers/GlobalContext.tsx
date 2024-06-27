import { createContext, useContext, useState } from "react";

import { WebPlayerProps } from "@/types/props";

type ContextType = Required<
  Pick<WebPlayerProps, "flatten" | "maxItemsShown">
> & {
  aspectRatioClass: string;

  showHotspots: boolean;
  setShowHotspots: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalContext = createContext<ContextType | null>(null);

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext);

  if (!ctx) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }

  return ctx;
};

type ProviderProps = Required<WebPlayerProps>;

const GlobalContextProvider: React.FC<
  React.PropsWithChildren<ProviderProps>
> = ({ aspectRatio, children, ...props }) => {
  const aspectRatioClass = aspectRatio === "4:3" ? "aspect-4/3" : "aspect-16/9";

  const [showHotspots, setShowHotspots] = useState(true);

  return (
    <GlobalContext.Provider
      value={{
        ...props,

        aspectRatioClass,

        showHotspots,
        setShowHotspots,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
