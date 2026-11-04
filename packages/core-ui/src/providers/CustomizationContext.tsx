import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type RefObject,
} from "react";

import {
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  type WebPlayerIconProps,
} from "@car-cutter/core";

import { CustomMedia } from "../types/customizable_item";
import { getWebPlayerHost } from "../utils/web";

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

const CUSTOMIZATION_TAGS: string[] = [
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
];

const ICON_WRAPPER_CLASS = "*:size-full";
const CUSTOM_MEDIA_WRAPPER_CLASS = "*:object-cover *:size-full"; // Make sure images are taking the whole space

type ProviderProps = {
  /** An element of the player, to find the web component hosting it */
  wrapperRef: RefObject<HTMLElement | null>;
};

/** The icons of the web component: its cc-webplayer-icon children */
const extractIconsFromElement = (element: Element) => {
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
};

/** The custom medias of the web component: its cc-webplayer-custom-media children */
const extractCustomMediasFromElement = (element: Element) => {
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

    // Not Number(null), which is 0
    const indexAttribute = customMediaElement.getAttribute("index");
    const index = indexAttribute ? Number(indexAttribute) : NaN;
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
};

const CustomizationContextProvider: React.FC<
  React.PropsWithChildren<ProviderProps>
> = ({ wrapperRef, children }) => {
  // Two sources, kept apart so that neither overwrites the other: the
  // children of the web component hosting the player, and the React
  // children of the player (registered by WebPlayerIcon/WebPlayerCustomMedia)
  const [wcIcons, setWcIcons] = useState<Map<string, IconConfig>>(
    () => new Map()
  );
  const [reactIcons, setReactIcons] = useState<Map<string, IconConfig>>(
    () => new Map()
  );
  const [wcCustomMedias, setWcCustomMedias] = useState<CustomMediaWithId[]>([]);
  const [reactCustomMedias, setReactCustomMedias] = useState<
    CustomMediaWithId[]
  >([]);

  // Read the children of the web component, then when its DOM or their
  // attributes change. Not
  // in a layout effect: its update would run the player's effects
  // synchronously, dispatching its first events before the host page's
  // effects listen to them
  useEffect(() => {
    const webPlayerElement = getWebPlayerHost(wrapperRef.current);

    // No web component (CASE WHEN USING REACT)
    if (!webPlayerElement) {
      return;
    }

    // Nothing to update (and render) while there are none
    const read = () => {
      const icons = extractIconsFromElement(webPlayerElement);
      const customMedias = extractCustomMediasFromElement(webPlayerElement);
      setWcIcons(previous => (previous.size || icons.size ? icons : previous));
      setWcCustomMedias(previous =>
        previous.length || customMedias.length ? customMedias : previous
      );
    };

    read();

    // Attributes of the customizations only, not of their content
    const observer = new MutationObserver(records => {
      if (
        records.some(
          record =>
            record.type === "childList" ||
            CUSTOMIZATION_TAGS.includes((record.target as Element).localName)
        )
      ) {
        read();
      }
    });
    observer.observe(webPlayerElement, {
      childList: true,
      subtree: true,
      attributeFilter: ["index", "thumbnail-src", "name"],
    });

    return () => observer.disconnect();
  }, [wrapperRef]);

  // -- Icon
  // The React ones take precedence, like when they were registered after
  const iconConfigMap = useMemo(
    () => new Map([...wcIcons, ...reactIcons]),
    [wcIcons, reactIcons]
  );

  const getIconConfig = useCallback(
    (key: string) => iconConfigMap.get(key),
    [iconConfigMap]
  );

  // - Set & Reset are only used when using React because the Web Component Icon cannot access the context
  const registerIconConfig = useCallback(
    (key: string, iconConfig: IconConfig) => {
      setReactIcons(currentMap => {
        const { Icon, ...config } = iconConfig;

        return new Map(currentMap).set(key, {
          ...config,
          Icon: <div className={ICON_WRAPPER_CLASS}>{Icon}</div>,
        });
      });
    },
    []
  );
  const unregisterIconConfig = useCallback((key: string) => {
    setReactIcons(currentMap => {
      const map = new Map(currentMap);
      map.delete(key);
      return map;
    });
  }, []);

  // -- Custom Media
  const customMediaList = useMemo(
    () => [...wcCustomMedias, ...reactCustomMedias],
    [wcCustomMedias, reactCustomMedias]
  );

  // - Set & Reset are only used when using React because the Web Component Icon cannot access the context
  const registerCustomMedia = useCallback((customMedia: CustomMedia) => {
    const { Media, ...props } = customMedia;

    const WrappedMedia = (
      <div className={CUSTOM_MEDIA_WRAPPER_CLASS}>{Media}</div>
    );
    const id = JSON.stringify(props);

    setReactCustomMedias(currentList => [
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
    setReactCustomMedias(currentList =>
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
