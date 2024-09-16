import { createContext, useContext } from "react";

import { type Color } from "./const/color";
import {
  DEFAULT_COLOR,
  DEFAULT_CUSTOMER,
  DEFAULT_HIDE_CATEGORIES,
  DEFAULT_ID,
  DEFAULT_PERMANENT_GALLERY,
  DEFAULT_RADIUS,
} from "./const/default";
import { type Radius } from "./const/radius";
import { useSearchParam } from "./hooks/useSearchParam";

type ContextType = {
  customer: string;
  setCustomer: (customer: string) => void;
  id: string;
  setId: (id: string) => void;

  dealer: string;
  setDealer: (dealer: string) => void;
  product: string;
  setProduct: (product: string) => void;

  permanentGallery: boolean;
  setPermanentGallery: (permanentGallery: boolean) => void;
  hideCategories: boolean;
  setHideCategories: (hideCategories: boolean) => void;
  color: Color;
  setColor: (color: Color) => void;
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
  const [customer, setCustomer] = useSearchParam("customer", DEFAULT_CUSTOMER);
  const [id, setId] = useSearchParam("id", DEFAULT_ID);

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

  const [color, setColor] = useSearchParam("color", DEFAULT_COLOR);
  const [radius, setRadius] = useSearchParam("radius", DEFAULT_RADIUS);

  return (
    <AppContext.Provider
      value={{
        customer,
        setCustomer,
        id,
        setId,

        dealer,
        setDealer,
        product,
        setProduct,

        permanentGallery,
        setPermanentGallery,
        hideCategories,
        setHideCategories,

        color,
        setColor,
        radius,
        setRadius,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
