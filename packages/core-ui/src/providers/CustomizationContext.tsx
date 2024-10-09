import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  WEB_PLAYER_WC_TAG,
  type WebPlayerIconProps,
} from "@car-cutter/core";

import { CustomMedia } from "../types/customisable_item";

import { useGlobalContext } from "./GlobalContext";

type IconConfig = Omit<WebPlayerIconProps, "name"> & {
  Icon: React.ReactNode;
};

type CustomMediaWithId = CustomMedia & {
  id: string;
};

type ContextType = {
  getIconConfig: (name: string) => IconConfig | undefined;
  registerIconConfig: (name: string, iconConfig: IconConfig) => void;
  unregisterIconConfig: (name: string) => void;

  customMediaList: CustomMediaWithId[];
  registerCustomMedia: (customMedia: CustomMedia) => CustomMediaWithId["id"];
  unregisterCustomMedia: (id: CustomMediaWithId["id"]) => void;
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

const ICON_WRAPPER_CLASS = "*:size-full";
const CUSTOM_MEDIA_WRAPPER_CLASS = "*:object-cover *:size-full"; // Make sure images are taking the whole space

type ProviderProps = {
  //
};

const CustomizationContextProvider: React.FC<
  React.PropsWithChildren<ProviderProps>
> = ({ children }) => {
  const { compositionUrl } = useGlobalContext();

  const queryWebPlayerElement = useCallback(
    () =>
      document.querySelector(
        `${WEB_PLAYER_WC_TAG}[composition-url="${compositionUrl}"]`
      ),
    [compositionUrl]
  );

  // -- Icon
  const extractIconsFromElement = useCallback((element: Element) => {
    const iconElements = element.querySelectorAll(WEB_PLAYER_ICON_WC_TAG);

    const map = new Map<WebPlayerIconProps["name"], IconConfig>();

    for (const iconElement of iconElements) {
      const name = iconElement.getAttribute("name");

      if (!name) {
        // eslint-disable-next-line no-console
        console.warn("Icon element is missing a name attribute");
        continue;
      }

      const iconHTML = iconElement.innerHTML;
      const Icon = iconHTML ? (
        <div
          className={ICON_WRAPPER_CLASS}
          dangerouslySetInnerHTML={{ __html: iconHTML }}
        />
      ) : undefined;

      if (!Icon) {
        // eslint-disable-next-line no-console
        console.warn(`Icon "${name}" customization is empty.`);
        continue;
      }

      map.set(name, { Icon });
    }

    return map;
  }, []);

  const [iconConfigMap, setIconConfigMap] = useState<Map<string, IconConfig>>(
    () => {
      const webPlayerElement = queryWebPlayerElement();

      // Check if the element does not exist in the DOM (CASE WHEN USING REACT)
      if (!webPlayerElement) {
        return new Map();
      }

      return extractIconsFromElement(webPlayerElement);
    }
  );

  // Update icons when the DOM changes
  useEffect(() => {
    const webPlayerElement = queryWebPlayerElement();

    // Check if the element does not exist in the DOM (CASE WHEN USING REACT)
    if (!webPlayerElement) {
      return;
    }

    const observer = new MutationObserver(() => {
      setIconConfigMap(extractIconsFromElement(webPlayerElement));
    });

    observer.observe(webPlayerElement, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [extractIconsFromElement, queryWebPlayerElement]);

  const getIconConfig = useCallback(
    (key: string) => iconConfigMap.get(key),
    [iconConfigMap]
  );

  // - Set & Reset are only used when using React because the Web Component Icon cannot access the context
  const registerIconConfig = useCallback(
    (key: string, iconConfig: IconConfig) => {
      setIconConfigMap(currentMap => {
        const { Icon, ...config } = iconConfig;

        return new Map(
          currentMap.set(key, {
            ...config,
            Icon: <div className={ICON_WRAPPER_CLASS}>{Icon}</div>,
          })
        );
      });
    },
    []
  );
  const unregisterIconConfig = useCallback((key: string) => {
    setIconConfigMap(currentMap => {
      currentMap.delete(key);
      return new Map(currentMap);
    });
  }, []);

  // -- Custom Media
  const extractCustomMediasFromElement = useCallback((element: Element) => {
    const customMediaElements = element.querySelectorAll(
      WEB_PLAYER_CUSTOM_MEDIA_WC_TAG
    );

    const customMedias = new Array<CustomMediaWithId>();

    for (const customMediaElement of customMediaElements) {
      const Media = customMediaElement.innerHTML;
      if (!Media) {
        // eslint-disable-next-line no-console
        console.warn("Custom media element is empty");
        continue;
      }

      const index = Number(customMediaElement.getAttribute("index"));
      if (Number.isNaN(index)) {
        // eslint-disable-next-line no-console
        console.warn("Custom media element is missing the 'index' attribute");
        continue;
      }

      const thumbnailSrc =
        customMediaElement.getAttribute("thumbnail-src") ?? undefined;

      const id = JSON.stringify({ index, thumbnailSrc });

      customMedias.push({
        id,
        Media: (
          <div
            className={CUSTOM_MEDIA_WRAPPER_CLASS}
            dangerouslySetInnerHTML={{ __html: Media }}
          />
        ),
        index,
        thumbnailSrc,
      });
    }

    return customMedias;
  }, []);

  const [customMediaList, registerCustomMediaList] = useState<
    CustomMediaWithId[]
  >(() => {
    const webPlayerElement = queryWebPlayerElement();

    // Check if the element does not exist in the DOM (CASE WHEN USING REACT)
    if (!webPlayerElement) {
      return [];
    }

    return extractCustomMediasFromElement(webPlayerElement);
  });

  // Update the custom media list when the DOM changes
  useEffect(() => {
    const webPlayerElement = queryWebPlayerElement();

    // Check if the element does not exist in the DOM (CASE WHEN USING REACT)
    if (!webPlayerElement) {
      return;
    }

    const observer = new MutationObserver(() => {
      registerCustomMediaList(extractCustomMediasFromElement(webPlayerElement));
    });

    observer.observe(webPlayerElement, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [extractCustomMediasFromElement, queryWebPlayerElement]);

  // - Set & Reset are only used when using React because the Web Component Icon cannot access the context
  const registerCustomMedia = useCallback((customMedia: CustomMedia) => {
    const { Media, ...props } = customMedia;

    const WrappedMedia = (
      <div className={CUSTOM_MEDIA_WRAPPER_CLASS}>{Media}</div>
    );
    const id = JSON.stringify(props);

    registerCustomMediaList(currentList => [
      ...currentList,
      {
        id,
        Media: WrappedMedia,
        ...props,
      },
    ]);

    return id;
  }, []);
  const unregisterCustomMedia = useCallback((id: CustomMediaWithId["id"]) => {
    registerCustomMediaList(currentList =>
      currentList.filter(customMedia => customMedia.id !== id)
    );
  }, []);

  return (
    <CustomizationContext.Provider
      value={{
        getIconConfig,
        registerIconConfig,
        unregisterIconConfig,

        customMediaList,
        registerCustomMedia,
        unregisterCustomMedia,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export default CustomizationContextProvider;
