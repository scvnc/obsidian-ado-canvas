import * as dotenv from "dotenv";
import * as WorkItemService from "./services/work-item.service";
import fs from "fs";
import { CanvasUpdater } from "./canvas";
import { exit } from "process";

dotenv.config();

const path = process.env.CANVAS_FILE;
const queryId = process.env.QUERY_ID;

(async () => {
  if (!path || !queryId) {
    console.log("queryId path");
    exit(1);
  }
  const n = await WorkItemService.getWorkItemsFromQuery(queryId);

  const canvas = await fs.promises.readFile(path, "utf-8").then(JSON.parse);

  const updater = CanvasUpdater(canvas);

  updater.applyWorkItems(n);
  updater.markRemoved(n);

  await fs.promises.writeFile(path, JSON.stringify(updater.canvas), "utf-8");
})();
