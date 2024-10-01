export type WebPlayerIconName =
  | "UI_ARROW_RIGHT"
  | "UI_BURGER"
  | "UI_CLOSE"
  | "UI_EXTEND"
  | "UI_GALLERY"
  | "UI_HOTSPOTS"
  | "UI_IMAGE"
  | "UI_MINUS"
  | "UI_PAUSE"
  | "UI_PLAY"
  | "UI_PLUS"
  | "UI_REDUCE"
  | "UI_360"
  | "UI_VOLUME"
  | "UI_VOLUME_OFF"
  | "CONTROLS_PREV" // Is wrapping "UI_ARROW_RIGHT" icon and mirroring it on X axis
  | "CONTROLS_NEXT" // Is wrapping "UI_ARROW_RIGHT" icon
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {}); // NOTE: This is a workaround to allow any string value (as the user can also customise hotspots) but keep autocompletion

export type WebPlayerIconProps = {
  name: WebPlayerIconName;
};
