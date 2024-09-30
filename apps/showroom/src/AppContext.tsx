import { createContext, useContext, useMemo } from "react";

import { isColor } from "./const/color";
import {
  DEFAULT_COLOR,
  DEFAULT_CUSTOMER,
  DEFAULT_HIDE_CATEGORIES,
  DEFAULT_ID,
  DEFAULT_PERMANENT_GALLERY,
  DEFAULT_RADIUS,
  DEFAULT_WITH_CUSTOM_MEDIAS,
} from "./const/default";
import { type Radius } from "./const/radius";
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
  hideCategories: boolean;
  setHideCategories: (hideCategories: boolean) => void;
  withCustomMedias: boolean;
  setWithCustomMedias: (withCustomMedias: boolean) => void;

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

  const [permanentGallery, setPermanentGallery] = useSearchParam(
    "permanentGallery",
    DEFAULT_PERMANENT_GALLERY
  );
  const [hideCategories, setHideCategories] = useSearchParam(
    "hideCategories",
    DEFAULT_HIDE_CATEGORIES
  );
  const [withCustomMedias, setWithCustomMedias] = useSearchParam(
    "withCustomMedias",
    DEFAULT_WITH_CUSTOM_MEDIAS
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
        hideCategories,
        setHideCategories,
        withCustomMedias,
        setWithCustomMedias,

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
