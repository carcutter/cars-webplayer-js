// -- From a composition.json file, generate a composition_v2.json file

import fs from "fs";

import chalk from "chalk";
import { z } from "zod";

import type {
  Composition as CompositionV2,
  Hotspot as HotspotV2,
  Item as ItemV2,
} from "../src/types/composition";

import { saveJsonToFile } from "./utils";

// -- Composition V1

const HotspotV1Schema = z
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
type HotspotV1 = z.infer<typeof HotspotV1Schema>;

const ItemV1Schema = z
  .object({
    image: z.string(),
    hotspots: z.array(HotspotV1Schema),
  })
  .strict();

const CategoryRootV1Schema = z
  .object({
    category: z.string(),
    title: z.string(),
    items: z.array(ItemV1Schema),
  })
  .strict();

const CompositionV1Schema = z.array(CategoryRootV1Schema);

type CompositionV1 = z.infer<typeof CompositionV1Schema>;

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
} = CompositionV1Schema.safeParse(data);
if (!success) {
  console.error("Failed to parse composition V1", error.errors);
  process.exit(1);
}

// Transform
const transformComposition = (composition: CompositionV1): CompositionV2 => {
  return {
    aspectRatio: "4:3",
    imageHdWidth: 1600,
    imageSubWidths: [100, 300, 512, 640, 768, 1024],

    categories: composition.map(({ category, title, items }) => {
      let itemsV2: ItemV2[];

      const convertHotspot = (hotspot: HotspotV1): HotspotV2 => {
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
          feature: hotspot.feature,
          position: hotspot.position,
          description,
          detail,
        };
      };

      if (category === "360") {
        itemsV2 = [
          {
            type: "360",
            images: items.map(item => item.image),
            hotspots: items.map(({ hotspots }) =>
              hotspots.map(hotspot => convertHotspot(hotspot))
            ),
          },
        ];
      } else {
        itemsV2 = items.map(item => {
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
        items: itemsV2,
      };
    }),
  };
};

const transformedComposition = transformComposition(composition);

// Save the new composition
const newCompositionFilePath = compositionFilePath.replace(".json", "_v2.json");

saveJsonToFile(newCompositionFilePath, transformedComposition);

console.info(`New composition saved at: ${chalk.blue(newCompositionFilePath)}`);
