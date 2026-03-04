import { resolve } from "path";

import chalk from "chalk";
import { createGenerator } from "ts-json-schema-generator";

import { saveJsonToFile } from "./utils";

const compositionTypeFilePath = resolve("../core/src/types/composition.ts");
const tsconfigPath = resolve("../core/tsconfig.json");

const schemaGenerator = createGenerator({
  path: compositionTypeFilePath,
  tsconfig: tsconfigPath,
  type: "Composition",
  additionalProperties: false,
});

const jsonSchema = schemaGenerator.createSchema("Composition");

const savePath = "../../schemata/composition.schema.json";

saveJsonToFile(savePath, jsonSchema);

console.info(`JSON Schema saved at: ${chalk.blue(savePath)}`);
