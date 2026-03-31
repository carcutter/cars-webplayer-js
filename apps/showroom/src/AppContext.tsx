import { createContext, useCallback, useContext, useMemo } from "react";

import { isColor } from "./const/color";
import {
  DEFAULT_COLOR,
  DEFAULT_CUSTOMER,
  DEFAULT_ID,
  DEFAULT_RADIUS,
  DEFAULT_WITH_CUSTOM_ICONS,
  DEFAULT_WITH_CUSTOM_MEDIAS,
} from "./const/default";
import { type Radius } from "./const/radius";
import {
  DEFAULT_AUTO_LOAD_360,
  DEFAULT_AUTO_LOAD_INTERIOR_360,
  DEFAULT_CATEGORIES_FILTER,
  DEFAULT_DEMO_SPIN,
  DEFAULT_EXTEND_BEHAVIOR,
  DEFAULT_HIDE_CATEGORIES_NAV,
  DEFAULT_INFINITE_CARROUSEL,
  DEFAULT_INTEGRATION,
  DEFAULT_MEDIA_LOAD_STRATEGY,
  DEFAULT_PERMANENT_GALLERY,
  type ExtendBehavior,
  type MediaLoadStrategy,
} from "./const/webplayer";
import { useSearchParam } from "./hooks/useSearchParam";
import { hexToHSL } from "./utils/style";

type ContextType = {
  customer: string;
  setCustomer: (customer: string) => void;
  isDefaultCustomer: boolean;
  id: string;
  setId: (id: string) => void;
  isDefaultId: boolean;

  dealer: string;
  setDealer: (dealer: string) => void;
  product: string;
  setProduct: (product: string) => void;

  permanentGallery: boolean;
  setPermanentGallery: (permanentGallery: boolean) => void;
  hideCategoriesNav: boolean;
  setHideCategoriesNav: (hideCategoriesNav: boolean) => void;
  categoriesFilter: string;
  setCategoriesFilter: (categoriesFilter: string) => void;
  mediaLoadStrategy: MediaLoadStrategy;
  setMediaLoadStrategy: (mediaLoadStrategy: MediaLoadStrategy) => void;
  integration: boolean;
  setIntegration: (integration: boolean) => void;
  infiniteCarrousel: boolean;
  setInfiniteCarrousel: (infiniteCarrousel: boolean) => void;
  autoLoad360: boolean;
  setAutoLoad360: (autoLoad360: boolean) => void;
  autoLoadInterior360: boolean;
  setAutoLoadInterior360: (autoLoadInterior360: boolean) => void;
  withCustomMedias: boolean;
  setWithCustomMedias: (withCustomMedias: boolean) => void;
  withCustomIcons: boolean;
  setWithCustomIcons: (withCustomIcons: boolean) => void;
  demoSpin: boolean;
  setDemoSpin: (demoSpin: boolean) => void;
  extendBehavior: ExtendBehavior;
  setExtendBehavior: (extendBehavior: ExtendBehavior) => void;
  resetWebPlayerProps: () => void;

  color: string;
  setColor: (color: string) => void;
  customColorStyle: React.CSSProperties | undefined;

  radius: Radius;
  setRadius: (radius: Radius) => void;
};

const AppContext = createContext<ContextType | null>(null);

export const useAppContext = () => {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }

  return ctx;
};

const AppContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [customer, setCustomer, isDefaultCustomer] = useSearchParam(
    "customer",
    DEFAULT_CUSTOMER
  );
  const [id, setId, isDefaultId] = useSearchParam("id", DEFAULT_ID);

  const [dealer, setDealer] = useSearchParam("dealer");
  const [product, setProduct] = useSearchParam("product");

  const [permanentGallery, setPermanentGallery] = useSearchParam<boolean>(
    "permanentGallery",
    DEFAULT_PERMANENT_GALLERY
  );
  const [hideCategoriesNav, setHideCategoriesNav] = useSearchParam<boolean>(
    "hideCategoriesNav",
    DEFAULT_HIDE_CATEGORIES_NAV
  );
  const [categoriesFilter, setCategoriesFilter] = useSearchParam<string>(
    "categoriesFilter",
    DEFAULT_CATEGORIES_FILTER
  );
  const [mediaLoadStrategy, setMediaLoadStrategy] =
    useSearchParam<MediaLoadStrategy>(
      "mediaLoadStrategy",
      DEFAULT_MEDIA_LOAD_STRATEGY
    );
  const [integration, setIntegration] = useSearchParam<boolean>(
    "integration",
    DEFAULT_INTEGRATION
  );
  const [infiniteCarrousel, setInfiniteCarrousel] = useSearchParam<boolean>(
    "infiniteCarrousel",
    DEFAULT_INFINITE_CARROUSEL
  );
  const [autoLoad360, setAutoLoad360] = useSearchParam<boolean>(
    "autoLoad360",
    DEFAULT_AUTO_LOAD_360
  );
  const [autoLoadInterior360, setAutoLoadInterior360] = useSearchParam<boolean>(
    "autoLoadInterior360",
    DEFAULT_AUTO_LOAD_INTERIOR_360
  );
  const [withCustomMedias, setWithCustomMedias] = useSearchParam(
    "withCustomMedias",
    DEFAULT_WITH_CUSTOM_MEDIAS
  );
  const [withCustomIcons, setWithCustomIcons] = useSearchParam(
    "withCustomIcons",
    DEFAULT_WITH_CUSTOM_ICONS
  );
  const [demoSpin, setDemoSpin] = useSearchParam<boolean>(
    "demoSpin",
    DEFAULT_DEMO_SPIN
  );
  const [extendBehavior, setExtendBehavior] = useSearchParam<ExtendBehavior>(
    "extendBehavior",
    DEFAULT_EXTEND_BEHAVIOR
  );

  const [color, setColor] = useSearchParam<string>("color", DEFAULT_COLOR);
  const customColorStyle = useMemo(() => {
    const isCustomColor = !isColor(color);

    if (!isCustomColor) {
      return undefined;
    }

    const hsl = hexToHSL(color);

    const cssColor = `${hsl.h} ${hsl.s}% ${hsl.l}%`;

    return { "--primary": cssColor } as React.CSSProperties;
  }, [color]);

  const [radius, setRadius] = useSearchParam("radius", DEFAULT_RADIUS);

  const resetWebPlayerProps = useCallback(() => {
    setPermanentGallery(DEFAULT_PERMANENT_GALLERY);
    setHideCategoriesNav(DEFAULT_HIDE_CATEGORIES_NAV);
    setCategoriesFilter(DEFAULT_CATEGORIES_FILTER);
    setMediaLoadStrategy(DEFAULT_MEDIA_LOAD_STRATEGY);
    setIntegration(DEFAULT_INTEGRATION);
    setInfiniteCarrousel(DEFAULT_INFINITE_CARROUSEL);
    setAutoLoad360(DEFAULT_AUTO_LOAD_360);
    setAutoLoadInterior360(DEFAULT_AUTO_LOAD_INTERIOR_360);
    setDemoSpin(DEFAULT_DEMO_SPIN);
    setExtendBehavior(DEFAULT_EXTEND_BEHAVIOR);
    setColor(DEFAULT_COLOR);
    setRadius(DEFAULT_RADIUS);
  }, [
    setAutoLoad360,
    setAutoLoadInterior360,
    setCategoriesFilter,
    setColor,
    setDemoSpin,
    setExtendBehavior,
    setHideCategoriesNav,
    setInfiniteCarrousel,
    setIntegration,
    setMediaLoadStrategy,
    setPermanentGallery,
    setRadius,
  ]);

  return (
    <AppContext.Provider
      value={{
        customer,
        setCustomer,
        isDefaultCustomer,
        id,
        setId,
        isDefaultId,

        dealer,
        setDealer,
        product,
        setProduct,

        permanentGallery,
        setPermanentGallery,
        hideCategoriesNav,
        setHideCategoriesNav,
        categoriesFilter,
        setCategoriesFilter,
        mediaLoadStrategy,
        setMediaLoadStrategy,
        integration,
        setIntegration,
        infiniteCarrousel,
        setInfiniteCarrousel,
        autoLoad360,
        setAutoLoad360,
        autoLoadInterior360,
        setAutoLoadInterior360,
        withCustomMedias,
        setWithCustomMedias,
        withCustomIcons,
        setWithCustomIcons,
        demoSpin,
        setDemoSpin,
        extendBehavior,
        setExtendBehavior,
        resetWebPlayerProps,

        color,
        setColor,
        customColorStyle,

        radius,
        setRadius,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
