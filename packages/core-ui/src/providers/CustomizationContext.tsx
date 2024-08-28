import { createContext, useCallback, useContext, useState } from "react";

import { WEB_PLAYER_ICON_WC_TAG } from "@car-cutter/core";

type IconConfig = {
  Icon: React.ReactNode;
  color: string;
};

type PartialIconConfig = Partial<IconConfig>;

type ContextType = {
  getIconConfig: (key: string) => PartialIconConfig | undefined;
  setIconConfig: (key: string, iconConfig: PartialIconConfig) => void;
  resetIconConfig: (key: string) => void;
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
  const [iconConfigMap, setIconConfigMap] = useState(
    new Map<string, PartialIconConfig>()
  );

  // TODO: find a way to make it less hacky. Maybe with React Portals? https://github.com/bitovi/react-to-web-component/issues/106
  const getIconConfig = useCallback(
    (key: string) => {
      // Check if the key is already in the map (CASE WHEN USING REACT)
      const ctxConfig = iconConfigMap.get(key);
      if (ctxConfig) {
        return ctxConfig;
      }

      // Check if the key has been customized in the DOM (CASE WHEN USING WEB COMPONENTS)
      const domElement = document.querySelector(
        `${WEB_PLAYER_ICON_WC_TAG}[name="${key}"]`
      );

      if (!domElement) {
        return;
      }

      const color = domElement.getAttribute("color") ?? undefined;
      const iconHTML = domElement.innerHTML;
      const Icon = iconHTML ? (
        <div
          className="size-full"
          dangerouslySetInnerHTML={{ __html: iconHTML }}
        />
      ) : undefined;

      if (!color && !Icon) {
        return;
      }

      return { Icon, color };
    },
    [iconConfigMap]
  );
  const setIconConfig = useCallback(
    (key: string, iconConfig: PartialIconConfig) => {
      setIconConfigMap(currentMap => new Map(currentMap.set(key, iconConfig)));
    },
    []
  );
  const resetIconConfig = useCallback((key: string) => {
    setIconConfigMap(currentMap => {
      currentMap.delete(key);
      return new Map(currentMap);
    });
  }, []);

  return (
    <CustomizationContext.Provider
      value={{
        getIconConfig,
        setIconConfig,
        resetIconConfig,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export default CustomizationContextProvider;
