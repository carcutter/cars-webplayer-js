export type WebPlayerIconName =
  | "UI_ARROW_RIGHT" // Right arrow navigation (is mirrored on X axis for left arrow)
  | "UI_BURGER" // Toggle Burger menu
  | "UI_CLOSE" // Exit zoom, details or full screen
  | "UI_EXTEND" // Extend the view (and go full screen if possible)
  | "UI_GALLERY" // Toggle gallery view
  | "UI_HOTSPOTS" // Toggle Hotspots
  | "UI_IMAGE" // Hotspot with detail image
  | "UI_MINUS" // Reduce zoom
  | "UI_PAUSE" // Pause video
  | "UI_PLAY" // Play video
  | "UI_PLUS" // Increase zoom
  | "UI_REDUCE" // Reducing an extended view
  | "UI_360" // 360-degree view
  | "UI_VOLUME" // Video volume
  | "UI_VOLUME_OFF" // Muted video
  | "CONTROLS_PREV" // Go to previous media
  | "CONTROLS_NEXT" // Go to next media
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {}); // NOTE: This is a workaround to allow any string value (as the user can also customise hotspots) but keep autocompletion

export type WebPlayerIconProps = {
  name: WebPlayerIconName;
};
