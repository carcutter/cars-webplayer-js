import { createContext, useCallback, useContext, useState } from "react";

import { WEB_PLAYER_ICON_CUSTOM_ELEMENTS_NAME } from "@/const/custom_elements";

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

export const useCustomizationContextSafe = () => {
  return useContext(CustomizationContext);
};

export const useCustomizationContext = () => {
  const ctx = useCustomizationContextSafe();

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

  // TODO: find a way to make it less hacky
  const getHotspotConfig = useCallback(
    (key: string) => {
      // Check if the key is already in the map (CASE WHEN USING REACT)
      const ctxConfig = hotspotConfigMap.get(key);
      if (ctxConfig) {
        return ctxConfig;
      }

      // Check if the key has been customized in the DOM (CASE WHEN USING WEB COMPONENTS)
      const domElement = document.querySelector(
        `${WEB_PLAYER_ICON_CUSTOM_ELEMENTS_NAME}[feature="${key}"]`
      );

      if (!domElement) {
        return;
      }

      const color = domElement.getAttribute("color") ?? undefined;
      const svgHTML = domElement.innerHTML;
      const Icon = svgHTML ? (
        <div
          className="size-full"
          dangerouslySetInnerHTML={{ __html: svgHTML }}
        />
      ) : undefined;

      if (!color && !Icon) {
        return;
      }

      return { Icon, color };
    },
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
