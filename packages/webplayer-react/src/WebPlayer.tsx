import {
  ensureCustomElementsDefinition,
  type WebPlayerProps,
} from "@car-cutter/core-wc";

ensureCustomElementsDefinition();

const WebPlayer: React.FC<WebPlayerProps> = ({
  compositionUrl,
  flatten,
  infiniteCarrousel,
  permanentGallery,
  imageLoadStrategy,
  minImageWidth,
  maxImageWidth,
  allowFullScreen,
  eventId,
  reverse360,
}) => {
  return (
    // @ts-expect-error: [TODO] Should define into JSX.IntrinsicElements
    <cc-webplayer
      composition-url={compositionUrl}
      flatten={flatten}
      infinite-carrousel={infiniteCarrousel}
      permanent-gallery={permanentGallery}
      image-load-strategy={imageLoadStrategy}
      min-image-width={minImageWidth}
      max-image-width={maxImageWidth}
      allow-full-screen={allowFullScreen}
      event-id={eventId}
      reverse360={reverse360}
    />
  );
};

export default WebPlayer;
