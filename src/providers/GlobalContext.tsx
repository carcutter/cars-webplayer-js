import { createContext, useContext, useState } from "react";

type ContextType = {
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

type ProviderProps = {
  aspectRatioClass: string;
};

const GlobalContextProvider: React.FC<
  React.PropsWithChildren<ProviderProps>
> = ({ aspectRatioClass, children }) => {
  const [showHotspots, setShowHotspots] = useState(true);

  return (
    <GlobalContext.Provider
      value={{
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
