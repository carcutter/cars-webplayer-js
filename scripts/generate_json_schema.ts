import chalk from "chalk";
import { zodToJsonSchema } from "zod-to-json-schema";

import { CompositionSchema } from "../src/types/zod/composition";

import { saveJsonToFile } from "./utils";

const jsonSchema = zodToJsonSchema(CompositionSchema, "composition");

const savePath = "./schemas/composition.schema.json";

saveJsonToFile(savePath, jsonSchema);

console.log(`JSON Schema saved at: ${chalk.blue(savePath)}`);
