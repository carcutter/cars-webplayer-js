import { appendWebPlayerElement } from "@car-cutter/vanilla-webplayer";

function init() {
  const targetElement = document.getElementById("target");

  appendWebPlayerElement(targetElement, {
    compositionUrl:
      "https://cdn.car-cutter.com/gallery/767f46375d752707fcb76a19b8b22bc0040bd3ff59abc43d1c19eb0c04785c68/TEST1/composition_v3.json",
    flatten: true,
  });
}

init();
