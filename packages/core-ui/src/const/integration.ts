import type { WebPlayerProps } from "@car-cutter/core";

const integrationConfig: Omit<WebPlayerProps, "compositionUrl"> = {
  hideCategoriesNav: true,
  infiniteCarrousel: false,
  permanentGallery: false,
};

const validMaxItemsShownValues = [1, 1.5, 2, 2.5] as const;

export { integrationConfig, validMaxItemsShownValues };
