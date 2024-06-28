export type AspectRatio = "4:3" | "16:9";

export type WebPlayerProps = {
  aspectRatio?: AspectRatio;
  flatten?: boolean;
  maxItemsShown?: number;
};
