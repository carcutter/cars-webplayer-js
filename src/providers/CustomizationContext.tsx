import { createContext, useCallback, useContext, useState } from "react";

type HotspotConfig = {
  Icon: React.ReactNode;
  color: string;
};

type PartialHotspotConfig = Partial<HotspotConfig>;

type ContextType = {
  getHotspotConfig: (key: string) => PartialHotspotConfig | undefined;
  setHotspotConfig: (key: string, iconConfig: PartialHotspotConfig) => void;
};

const CustomizationContext = createContext<ContextType | null>(null);

export const useCustomizationContext = () => {
  const ctx = useContext(CustomizationContext);

  if (!ctx) {
    throw new Error(
      "useCustomizationContext must be used within a CustomizationContextProvider"
    );
  }

  return ctx;
};

type ProviderProps = {
  //
};

const CustomizationContextProvider: React.FC<
  React.PropsWithChildren<ProviderProps>
> = ({ children }) => {
  const [hotspotConfigMap, setHotspotConfigMap] = useState(
    new Map<string, PartialHotspotConfig>()
  );

  const getHotspotConfig = useCallback(
    (key: string) => hotspotConfigMap.get(key),
    [hotspotConfigMap]
  );
  const setHotspotConfig = useCallback(
    (key: string, iconConfig: PartialHotspotConfig) => {
      setHotspotConfigMap(
        currentMap => new Map(currentMap.set(key, iconConfig))
      );
    },
    []
  );

  return (
    <CustomizationContext.Provider
      value={{
        getHotspotConfig,
        setHotspotConfig,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export default CustomizationContextProvider;
