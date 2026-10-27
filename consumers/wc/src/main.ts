import {
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  WEB_PLAYER_ICON_WC_TAG,
  WEB_PLAYER_WC_TAG,
  ensureCustomElementsDefinition,
  webPlayerCustomMediaPropsToAttributes,
  webPlayerIconPropsToAttributes,
  webPlayerPropsToAttributes,
} from "@car-cutter/wc-webplayer";

const COMPOSITION_URL =
  "https://cdn.car-cutter.com/libs/web-player/v3/demos/composition_v3.json";

// Events are dispatched on document, as cc-webplayer:<name>
for (const name of [
  "composition-loading",
  "composition-loaded",
  "item-change",
]) {
  document.addEventListener(`cc-webplayer:${name}`, () => {
    const li = document.createElement("li");
    li.textContent = name;
    document.getElementById("events")!.append(li);
  });
}

const customMedia = Object.assign(document.createElement("div"), {
  id: "custom-media",
  textContent: "Custom media",
});
const customIcon = document.createElement("span");
customIcon.id = "custom-icon";
customIcon.innerHTML =
  '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg>';

ensureCustomElementsDefinition();

const create = (tag: string, attributes: Record<string, string>) => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value)
  );
  return element;
};

const player = create(
  WEB_PLAYER_WC_TAG,
  webPlayerPropsToAttributes({
    compositionUrl: COMPOSITION_URL,
    permanentGallery: true,
  })
);
const media = create(
  WEB_PLAYER_CUSTOM_MEDIA_WC_TAG,
  webPlayerCustomMediaPropsToAttributes({ index: 4 })
);
media.append(customMedia);
const icon = create(
  WEB_PLAYER_ICON_WC_TAG,
  webPlayerIconPropsToAttributes({ name: "UI_GALLERY" })
);
icon.append(customIcon);
player.append(media, icon);
document.getElementById("player")!.append(player);
