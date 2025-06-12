import { useGlobalContext } from "../../providers/GlobalContext";
import { cn } from "../../utils/style";
import CdnImage from "../atoms/CdnImage";

export type DetailsOverlayProps = {
  className?: string;
  children?: React.ReactNode;
  isVisible: boolean;
  url: string | undefined;
  title: string | undefined;
  description: string | undefined;
  clickHandler: (e: React.MouseEvent) => void;
  resetHandler?: () => void;
  extendMode?: boolean;
  variant?: "centered" | "aside" | "fullwidth";
  maxItemsShown?: number;
  aspectRatioStyle?: React.CSSProperties;
};

/**
 * DetailsOverlay component renders a details block with image and description over the carousel.
 *
 * This component provides a unified interface for displaying overlay content with three distinct layout variants:
 *
 * **Variants:**
 * - `centered`: Side panel that slides in from the right (max-width 60%)
 * - `aside`: Centered modal that slides up from bottom (responsive width based on maxItemsShown)
 * - `fullwidth`: Fixed aspect ratio modal (4:3) with custom width calculation
 *
 * **Automatic Variant Selection:**
 * - Uses `centered` when not in integration mode or in fullscreen
 * - Uses `aside` when in integration mode and not fullscreen
 * - Manual override available via `variant` prop
 *
 * **Features:**
 * - Responsive design with different text sizes for small/large screens
 * - Support for extend mode with larger text sizing
 * - Smooth transitions with opacity and transform animations
 * - Click-outside-to-close functionality
 * - Optional children for additional UI elements (e.g., close button)
 * - Dynamic width calculation for integration scenarios
 *
 * **Image Handling:**
 * - Renders CdnImage with dynamic srcSet and sizes attributes
 * - Different aspect ratios per variant (50% height for centered, flexible for aside, 85% for fullwidth)
 * - Object-contain fitting with background fallback
 *
 * @param className - Optional CSS class name for additional styling
 * @param children - Optional React children (typically close button or other controls)
 * @param isVisible - Controls visibility and animations of the overlay
 * @param url - Image URL to display in the overlay (optional)
 * @param title - Title text to display below the image (optional)
 * @param description - Description text to display below the title (optional)
 * @param clickHandler - Handler for overlay background clicks (typically for closing)
 * @param resetHandler - Optional handler for reset functionality (deprecated, use clickHandler)
 * @param extendMode - Whether extend mode is active (affects text sizing)
 * @param variant - Layout variant override ("centered" | "aside" | "fullwidth")
 * @param maxItemsShown - Number of items shown in carousel (affects width calculation, defaults to 1)
 *
 * @example
 * ```tsx
 * <DetailsOverlay
 *   isVisible={showDetails}
 *   url={imageUrl}
 *   title="Detail Title"
 *   description="Detail description text"
 *   clickHandler={handleOverlayClick}
 *   extendMode={isExtended}
 *   variant="centered"
 * >
 *   <CloseButton onClick={closeDetails} />
 * </DetailsOverlay>
 * ```
 */

const DetailsOverlay: React.FC<DetailsOverlayProps> = ({
  className,
  children,
  isVisible,
  url,
  title,
  description,
  clickHandler,
  extendMode,
  variant,
  aspectRatioStyle,
  maxItemsShown = 1,
}) => {
  const { isFullScreen, integration } = useGlobalContext();

  const determineVariant = () => {
    if (variant) return variant;
    if (!integration || isFullScreen) return "centered";
    return "aside";
  };

  const currentVariant = determineVariant();

  if (currentVariant === "centered") {
    return (
      <div
        className={cn(
          className,
          "absolute inset-0 z-overlay flex justify-end overflow-hidden bg-foreground/60 transition-opacity duration-details",
          isVisible ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={clickHandler}
      >
        <div
          className={cn(
            "flex h-full max-w-[60%] flex-col bg-background transition-transform duration-details",
            isVisible ? "translate-x-0" : "translate-x-full"
          )}
        >
          {children}
          {isVisible && (
            <>
              <CdnImage
                className="max-h-[50%] w-full bg-foreground/65 object-contain"
                src={url || ""}
                style={aspectRatioStyle}
                imgInPlayerWidthRatio={0.6}
              />
              <div
                className={cn(
                  "flex-1 space-y-1 overflow-y-auto px-2 py-1 small:p-3",
                  extendMode && "large:p-4"
                )}
              >
                {title && (
                  <span
                    className={cn(
                      "text-sm font-semibold small:text-base small:font-bold",
                      extendMode && "large:text-lg"
                    )}
                  >
                    {title}
                  </span>
                )}
                {description && (
                  <p
                    className={cn(
                      "text-xs text-foreground/65 small:text-sm",
                      extendMode && "large:text-base"
                    )}
                  >
                    {description}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (currentVariant === "aside") {
    return (
      <div
        className={cn(
          className,
          "absolute inset-0 z-overlay flex items-center justify-center overflow-hidden bg-foreground/60 transition-opacity duration-details",
          isVisible ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={clickHandler}
      >
        <div
          className={cn(
            "relative flex h-full flex-col bg-background transition-transform duration-details",
            isVisible ? "translate-y-0" : "translate-y-full"
          )}
          style={{
            width: integration
              ? `${100 / (isFullScreen ? 1 : maxItemsShown)}%`
              : `${100 / maxItemsShown}%`,
          }}
        >
          {children}
          {isVisible && (
            <>
              <CdnImage
                className="min-h-0 w-full flex-1 bg-foreground/65 object-contain"
                src={url || ""}
                style={aspectRatioStyle}
                imgInPlayerWidthRatio={0.6}
              />
              <div className="min-h-[15%] shrink-0 space-y-1 p-2 small:p-3">
                {title && (
                  <span
                    className={cn(
                      "block text-xs font-semibold leading-tight small:text-base small:font-bold",
                      extendMode && "large:text-lg"
                    )}
                  >
                    {title}
                  </span>
                )}
                {description && (
                  <p
                    className={cn(
                      "text-[10px] leading-tight text-foreground/65 small:text-sm",
                      extendMode && "large:text-base"
                    )}
                  >
                    {description}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        className,
        "absolute inset-0 z-overlay flex items-center justify-center overflow-hidden bg-foreground/60 transition-opacity duration-details",
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      onClick={clickHandler}
    >
      <div
        className={cn(
          "relative flex aspect-[4/3] flex-col bg-background transition-transform duration-details",
          isVisible ? "translate-y-0" : "translate-y-full"
        )}
        style={{
          width: integration
            ? `${100 / (isFullScreen ? 1 : maxItemsShown)}%`
            : `${100 / maxItemsShown}%`,
        }}
      >
        {children}
        {isVisible && url && (
          <>
            <CdnImage
              className="h-[85%] w-full bg-foreground/65 object-contain"
              src={url}
              imgInPlayerWidthRatio={0.6}
            />
            <div className="h-[15%] space-y-1 overflow-y-auto px-2 py-1 small:p-3">
              {title && (
                <span
                  className={cn(
                    "text-sm font-semibold small:text-base small:font-bold",
                    extendMode && "large:text-lg"
                  )}
                >
                  {title}
                </span>
              )}
              {description && (
                <p
                  className={cn(
                    "text-xs text-foreground/65 small:text-sm",
                    extendMode && "large:text-base"
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailsOverlay;
