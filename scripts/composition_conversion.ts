// -- From a composition.json file, generate a composition_v2.json file

import fs from "fs";

import type {
  Composition as CompositionV2,
  Item as ItemV2,
} from "../src/types/composition";

// -- Composition V1

interface CategoryRoot {
  category: string;
  title: string;
  items: Item[];
}

interface Item {
  image: string;
  hotspots: Hotspot[];
}

interface Hotspot {
  feature: string;
  position: {
    x: number;
    y: number;
  };
  description: {
    short: string;
    long?: string;
  };
  detail?: string;
}

type Composition = Array<CategoryRoot>;

const composition: Composition = JSON.parse(
  fs.readFileSync("./composition.json", "utf8")
);

// Transform
const transformComposition = (composition: Composition): CompositionV2 => {
  return {
    imageHdWidth: 1600,
    imageSubWidths: [100, 300, 512, 640, 768, 1024],

    elements: composition.map(({ category, title, items }) => {
      let itemsV2: ItemV2[];
      if (category === "360") {
        itemsV2 = [
          {
            type: "360",
            images: items.map(item => item.image),
            hotspots: items.map(item => item.hotspots),
          },
        ];
      } else {
        itemsV2 = items.map(item => {
          return {
            type: "image",
            src: item.image,
            hotspots: item.hotspots,
          };
        });
      }

      return {
        category,
        title,
        items: itemsV2,
      };
    }),
  };
};

const transformedComposition = transformComposition(composition);

// Save the new composition
fs.writeFileSync(
  "./composition_v2.json",
  JSON.stringify(transformedComposition, null, 2),
  "utf8"
);
