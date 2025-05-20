import { resolve } from "path";

import chalk from "chalk";
import * as TJS from "typescript-json-schema";

import { saveJsonToFile } from "./utils";

const compositionTypeFilePath = resolve("../core/src/types/composition.ts");

const program = TJS.getProgramFromFiles([compositionTypeFilePath]);

const settings: TJS.PartialArgs = {
  required: true,
};
const jsonSchema = TJS.generateSchema(program, "Composition", settings);

const savePath = "../../schemata/composition.schema.json";

saveJsonToFile(savePath, jsonSchema);

console.info(`JSON Schema saved at: ${chalk.blue(savePath)}`);
