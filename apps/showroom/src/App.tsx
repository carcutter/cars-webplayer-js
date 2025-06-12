import { sha256 } from "js-sha256";

import {
  WebPlayer,
  WebPlayerCustomMedia,
  WebPlayerIcon,
  generateCompositionUrl as generateCompositionUrlWithCustomerToken,
} from "@car-cutter/react-webplayer";

import AppContextProvider, { useAppContext } from "./AppContext";
import CompositionUpdatePopover from "./components/molecules/CompositionUpdatePopover";
import CustomizationPopover from "./components/molecules/CustomizationPopover";
import { Button } from "./components/ui/Button";
import { colorToClassName, isColor } from "./const/color";
import { radiusToClassName } from "./const/radius";
import { cn } from "./utils/style";

const generateCompositionUrl = (customer: string, id: string) => {
  const isToken = (str: string) => /^[a-f0-9]{64}$/i.test(str);

  const customerIdToToken = (customerId: string) => sha256(customerId);

  const customerToken = isToken(customer)
    ? customer
    : customerIdToToken(customer);
  return generateCompositionUrlWithCustomerToken(customerToken, id);
};

const isNotHashed = (customerId: string) => {
  return /^[a-f0-9]{64}$/i.test(customerId);
};

const AppContent: React.FC = () => {
  const {
    customer,
    id,
    dealer,
    product,

    permanentGallery,
    hideCategoriesNav,
    withCustomMedias,
    withCustomIcons,

    color,
    customColorStyle,

    radius,
  } = useAppContext();

  if (!customer || !isNotHashed(customer)) {
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, document.title, url.toString());
  }

  const compositionUrl = generateCompositionUrl(customer, id);

  return (
    <div
      className={cn(
        "sm:p-2 mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-y-4 p-1.5",
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

          <CustomizationPopover>
            <Button variant="outline">Customize</Button>
          </CustomizationPopover>
        </div>
      </header>
      <main className="w-full">
        <WebPlayer
          compositionUrl={compositionUrl}
          infiniteCarrousel
          permanentGallery={permanentGallery}
          hideCategoriesNav={hideCategoriesNav}
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
          <span className="sm:text-base text-sm opacity-70">Powered by</span>
          <a
            href="https://www.car-cutter.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              className="sm:h-6 h-4"
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
