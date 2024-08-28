import {
  ensureCustomElementsDefinition,
  type WebPlayerProps,
} from "@car-cutter/core-wc";

ensureCustomElementsDefinition();

const WebPlayer: React.FC<WebPlayerProps> = ({
  compositionUrl,
  reverse360,
  minImageWidth,
  maxImageWidth,
  imageLoadStrategy,
  flatten,
  infiniteCarrousel,
  eventId,
  allowFullScreen,
  permanentGallery,
}) => {
  return (
    // @ts-expect-error: Should define into the JSX.IntrinsicElements (.d.ts)
    <cc-webplayer
      composition-url={compositionUrl}
      reverse360={reverse360}
      min-image-width={minImageWidth}
      max-image-width={maxImageWidth}
      image-load-strategy={imageLoadStrategy}
      flatten={flatten}
      infinite-carrousel={infiniteCarrousel}
      event-id={eventId}
      allow-full-screen={allowFullScreen}
      permanent-gallery={permanentGallery}
    />
  );
};

export default WebPlayer;
