import { appendWebPlayerElement } from "@car-cutter/vanilla-webplayer";

function init() {
  const targetElement = document.getElementById("target");

  appendWebPlayerElement(targetElement, {
    compositionUrl:
      "https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json",
    flatten: true,
  });
}

init();
