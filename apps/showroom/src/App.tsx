import { sha256 } from "js-sha256";

import {
  WebPlayer,
  generateCompositionUrl as generateCompositionUrlWithHashedCustomer,
} from "@car-cutter/react-webplayer";

import AppContextProvider, { useAppContext } from "./AppContext";
import CompositionUpdatePopover from "./components/molecules/CompositionUpdatePopover";
import CustomisationPopover from "./components/molecules/CustomisationPopover";
import { Button } from "./components/ui/Button";
import { colorToClassName } from "./const/color";
import { radiusToClassName } from "./const/radius";
import { cn } from "./utils/style";

const generateCompositionUrl = (customer: string, id: string) => {
  const isHashed = (str: string) => /^[a-f0-9]{64}$/i.test(str);

  const hashCustomerId = (customerId: string) => sha256(customerId);

  const hashedCustomer = isHashed(customer)
    ? customer
    : hashCustomerId(customer);
  return generateCompositionUrlWithHashedCustomer(hashedCustomer, id);
};

const AppContent: React.FC = () => {
  const {
    customer,
    id,
    dealer,
    product,

    permanentGallery,
    hideCategories,
    color,
    radius,
  } = useAppContext();

  const compositionUrl = generateCompositionUrl(customer, id);

  return (
    <div
      className={cn(
        "mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-y-4 p-1.5 sm:p-2",
        colorToClassName(color),
        radiusToClassName(radius)
      )}
    >
      <header className="flex flex-1 items-center justify-between gap-y-2">
        <div className="space-y-2">
          {dealer && (
            <h2 className="w-fit rounded-ui bg-primary/20 px-4 py-1 text-sm text-primary-contrast transition-all">
              {dealer}
            </h2>
          )}
          {product && <h1 className="text-2xl font-semibold">{product}</h1>}
        </div>

        <div className="grid gap-y-2">
          <CompositionUpdatePopover>
            <Button>Change vehicle</Button>
          </CompositionUpdatePopover>

          <CustomisationPopover>
            <Button variant="outline">Customise</Button>
          </CustomisationPopover>
        </div>
      </header>
      <main className="w-full">
        <WebPlayer
          compositionUrl={compositionUrl}
          infiniteCarrousel
          permanentGallery={permanentGallery}
          hideCategories={hideCategories}
        />
      </main>
      <footer className="flex-[2] self-center">
        <div className="flex gap-x-2">
          <span className="text-sm opacity-70 sm:text-base">Powered by</span>
          <a
            href="https://www.car-cutter.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              className="h-4 sm:h-6"
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
