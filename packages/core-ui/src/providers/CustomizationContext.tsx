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
} from "@car-cutter/core";

import { CustomMedia } from "../types/customisable_item";

import { useGlobalContext } from "./GlobalContext";

type IconConfig = {
  Icon: React.ReactNode;
  color: string;
};

type CustomMediaWithId = CustomMedia & {
  id: string;
};

type PartialIconConfig = Partial<IconConfig>;

type ContextType = {
  getIconConfig: (key: string) => PartialIconConfig | undefined;
  setIconConfig: (key: string, iconConfig: PartialIconConfig) => void;
  resetIconConfig: (key: string) => void;

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

// Make sure images are taking the whole space
const CUSTOM_MEDIA_WRAPPER_CLASS = "*:object-cover *:size-full";

type ProviderProps = {
  //
};

const CustomizationContextProvider: React.FC<
  React.PropsWithChildren<ProviderProps>
> = ({ children }) => {
  const { compositionUrl } = useGlobalContext();

  // -- Icon

  const [iconConfigMap, setIconConfigMap] = useState(
    new Map<string, PartialIconConfig>()
  );

  // HACK: find a way to make it less hacky. Maybe with React Portals? https://github.com/bitovi/react-to-web-component/issues/106
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

  // - Set & Reset are only used when using React because the Web Component Icon cannot access the context
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

  // -- Custom Media
  const queryWebPlayerElement = useCallback(
    () =>
      document.querySelector(
        `${WEB_PLAYER_WC_TAG}[composition-url="${compositionUrl}"]`
      ),
    [compositionUrl]
  );

  const extractCustomMediasFromElement = useCallback((element: Element) => {
    const customMediaElements = element.querySelectorAll(
      WEB_PLAYER_CUSTOM_MEDIA_WC_TAG
    );

    const customMedias = new Array<CustomMediaWithId>();

    for (const customMediaElement of customMediaElements) {
      const Media = customMediaElement.innerHTML;
      const index = Number(customMediaElement.getAttribute("index"));
      const thumbnailSrc =
        customMediaElement.getAttribute("thumbnail-src") ?? undefined;

      if (!Media || Number.isNaN(index)) {
        continue;
      }

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
      attributes: true,
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
        setIconConfig,
        resetIconConfig,

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
