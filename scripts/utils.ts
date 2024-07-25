import fs from "fs";

export function saveJsonToFile(path: string, json: unknown) {
  fs.writeFileSync(path, JSON.stringify(json, null, 2), "utf8");
}
