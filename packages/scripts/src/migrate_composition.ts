// -- From a composition.json file, generate a composition_v3.json file

import fs from "fs";

import chalk from "chalk";
import { z } from "zod";

import type {
  Composition as CompositionV3,
  Hotspot as HotspotV3,
  Item as ItemV3,
} from "@car-cutter/core";

import { saveJsonToFile } from "./utils";

// -- Composition V2

const HotspotV2Schema = z
  .object({
    feature: z.string(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
    description: z.object({
      short: z.string(),
      long: z.string().optional(),
    }),
    detail: z.string().optional(),
  })
  .strict();
type HotspotV2 = z.infer<typeof HotspotV2Schema>;

const ItemV2Schema = z
  .object({
    image: z.string(),
    hotspots: z.array(HotspotV2Schema),
  })
  .strict();

const CategoryRootV2Schema = z
  .object({
    category: z.string(),
    title: z.string(),
    items: z.array(ItemV2Schema),
  })
  .strict();

const CompositionV2Schema = z.array(CategoryRootV2Schema);

type CompositionV2 = z.infer<typeof CompositionV2Schema>;

// Get the composition file path from CLI arguments
const compositionFilePath = process.argv[process.argv.length - 1];

if (!compositionFilePath.endsWith(".json")) {
  console.error("Please provide the composition file path as an argument.");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(compositionFilePath, "utf8"));

const {
  success,
  data: composition,
  error,
} = CompositionV2Schema.safeParse(data);
if (!success) {
  console.error("Failed to parse composition V2", error.errors);
  process.exit(1);
}

// Transform
const transformComposition = (composition: CompositionV2): CompositionV3 => {
  return {
    aspectRatio: "4:3", // HARD-CODED
    imageHdWidth: 1600, // HARD-CODED
    imageSubWidths: [100, 300, 512, 640, 768, 1024], // HARD-CODED

    categories: composition.map(({ category, title, items }) => {
      let itemsV3: ItemV3[];

      const convertHotspot = (hotspot: HotspotV2): HotspotV3 => {
        const description = hotspot.description.short
          ? hotspot.description
          : undefined;

        const detail = hotspot.detail
          ? {
              type: "image" as const,
              src: hotspot.detail,
            }
          : undefined;

        return {
          title: description?.short ?? hotspot.feature,
          icon: hotspot.feature,
          position: hotspot.position,
          description: description?.long,
          detail,
        };
      };

      if (category === "360") {
        itemsV3 = [
          {
            type: "360",
            images: items.map(({ image, hotspots }) => ({
              src: image,
              hotspots: hotspots.map(hotspot => convertHotspot(hotspot)),
            })),
          },
        ];
      } else {
        itemsV3 = items.map(item => {
          return {
            type: "image",
            src: item.image,
            hotspots: item.hotspots.map(hotspot => convertHotspot(hotspot)),
          };
        });
      }

      return {
        id: category,
        title,
        items: itemsV3,
      };
    }),
  };
};

const transformedComposition = transformComposition(composition);

// Save the new composition
const newCompositionFilePath = compositionFilePath.replace(".json", "_v3.json");

saveJsonToFile(newCompositionFilePath, transformedComposition);

console.info(`New composition saved at: ${chalk.blue(newCompositionFilePath)}`);
