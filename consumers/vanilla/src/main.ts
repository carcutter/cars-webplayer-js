import { appendWebPlayer } from "@car-cutter/vanilla-webplayer";

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

appendWebPlayer(
  document.getElementById("player")!,
  { compositionUrl: COMPOSITION_URL, permanentGallery: true },
  {
    customMedias: [{ index: 4, element: customMedia }],
    icons: [{ name: "UI_GALLERY", element: customIcon }],
  }
);
