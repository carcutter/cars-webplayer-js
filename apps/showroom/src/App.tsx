import { sha256 } from "js-sha256";
import { useEffect, useMemo, useState } from "react";

import {
  WebPlayer,
  type Composition,
  WebPlayerCustomMedia,
  WebPlayerIcon,
  generateCompositionUrl as generateCompositionUrlWithCustomerToken,
} from "@car-cutter/react-webplayer";

import AppContextProvider, { useAppContext } from "./AppContext";
import CompositionUpdatePopover from "./components/molecules/CompositionUpdatePopover";
import CustomizationDrawer from "./components/molecules/CustomizationDrawer";
import { Button } from "./components/ui/Button";
import { colorToClassName, isColor } from "./const/color";
import { radiusToClassName } from "./const/radius";
import {
  DEFAULT_CATEGORIES_FILTER,
  type CategoryFilterOption,
} from "./const/webplayer";
import { cn } from "./utils/style";

const generateCompositionUrl = (customer: string, id: string) => {
  const isToken = (str: string) => /^[a-f0-9]{64}$/i.test(str);

  const customerIdToToken = (customerId: string) => sha256(customerId);

  const customerToken = isToken(customer)
    ? customer
    : customerIdToToken(customer);
  return generateCompositionUrlWithCustomerToken(customerToken, id);
};

const isValidCustomerToken = (customerId: string) =>
  /^[a-f0-9]{64}$/i.test(customerId);

const AppContent: React.FC = () => {
  const {
    customer,
    id,
    dealer,
    product,

    autoLoad360,
    autoLoadInterior360,
    categoriesFilter,
    extendBehavior,
    permanentGallery,
    hideCategoriesNav,
    infiniteCarrousel,
    integration,
    mediaLoadStrategy,
    withCustomMedias,
    withCustomIcons,
    demoSpin,

    color,
    customColorStyle,

    radius,
  } = useAppContext();

  const hasValidCustomer = !!customer && isValidCustomerToken(customer);

  if (!hasValidCustomer) {
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, document.title, url.toString());
  }

  const compositionUrl = generateCompositionUrl(customer, id);
  const [categoryFilterOptions, setCategoryFilterOptions] = useState<
    CategoryFilterOption[]
  >([]);

  useEffect(() => {
    if (!hasValidCustomer) {
      setCategoryFilterOptions([]);
      return;
    }

    let isCancelled = false;

    const loadCompositionCategories = async () => {
      try {
        const response = await fetch(compositionUrl);
        const composition = (await response.json()) as Composition;

        if (isCancelled) {
          return;
        }

        setCategoryFilterOptions(
          composition.categories.map(({ id: categoryId, title }) => ({
            value: categoryId,
            label: title || categoryId,
          }))
        );
      } catch (error) {
        if (!isCancelled) {
          setCategoryFilterOptions([]);
        }
      }
    };

    void loadCompositionCategories();

    return () => {
      isCancelled = true;
    };
  }, [compositionUrl, hasValidCustomer]);

  const resolvedCategoriesFilter = useMemo(
    () =>
      categoriesFilter === DEFAULT_CATEGORIES_FILTER
        ? undefined
        : categoriesFilter,
    [categoriesFilter]
  );

  return (
    <div
      className={cn(
        "mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-y-4 p-1.5",
        "sm:p-2",
        isColor(color) && colorToClassName(color),
        radiusToClassName(radius)
      )}
      style={customColorStyle}
    >
      <header className="flex flex-1 items-center justify-between gap-y-2">
        <div className="space-y-2">
          {dealer && (
            <h2 className="w-fit rounded-ui bg-primary/20 px-4 py-1 text-sm transition-all">
              {dealer}
            </h2>
          )}
          {product && <h1 className="text-2xl font-semibold">{product}</h1>}
        </div>

        <div className="grid gap-y-2">
          <CompositionUpdatePopover>
            <Button>Change vehicle</Button>
          </CompositionUpdatePopover>

          <CustomizationDrawer categoryFilterOptions={categoryFilterOptions}>
            <Button variant="outline">Customize</Button>
          </CustomizationDrawer>
        </div>
      </header>
      <main className="w-full">
        <WebPlayer
          compositionUrl={compositionUrl}
          autoLoad360={autoLoad360}
          autoLoadInterior360={autoLoadInterior360}
          categoriesFilter={resolvedCategoriesFilter}
          extendBehavior={extendBehavior}
          infiniteCarrousel={infiniteCarrousel}
          integration={integration}
          mediaLoadStrategy={mediaLoadStrategy}
          permanentGallery={permanentGallery}
          hideCategoriesNav={hideCategoriesNav}
          demoSpin={demoSpin}
        >
          {withCustomMedias && (
            <>
              <WebPlayerCustomMedia
                index={4}
                thumbnailSrc="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_thumbnail_audi.png"
              >
                <img src="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_image_1.jpg" />
              </WebPlayerCustomMedia>
              <WebPlayerCustomMedia index={-2}>
                <img src="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_image_2.jpg" />
              </WebPlayerCustomMedia>
            </>
          )}
          {withCustomIcons && (
            <WebPlayerIcon name="UI_ARROW_RIGHT">
              <svg
                viewBox="2 2 12 12"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                />
              </svg>
            </WebPlayerIcon>
          )}
        </WebPlayer>
      </main>
      <footer className="flex-[2] self-center">
        <div className="flex gap-x-2">
          <span className={cn("text-sm opacity-70", "sm:text-base")}>
            Powered by
          </span>
          <a
            href="https://www.car-cutter.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              className={cn("h-4", "sm:h-6")}
              src="https://cloud.car-cutter.com/web-player/app/share/CarCutter.svg"
              alt="CarCutter"
            />
          </a>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
};

export default App;
