import type { CanvasData, CanvasTextData } from "obsidian/canvas";
import { config } from "./config";
import { WorkItem } from "./services/work-item.service";

const DELETED_COLOR = "#490e0e";
const ID_PREFIX = "AZDO_";

const _getCanvasId = (id: number) =>
  `${ID_PREFIX}${config.organizationName}_${id}`;

const _getCanvasTitle = (workItem: WorkItem) =>
  `[${workItem.id} - ${workItem.title}](${workItem.url})`;

export const CanvasUpdater = (canvas: CanvasData) => {
  let _canvas = canvas;

  return {
    applyWorkItems(workItem: WorkItem[]) {
      workItem.forEach((wi) => {
        const canvasId = _getCanvasId(wi.id);
        const canvasText = _getCanvasTitle(wi);

        const existingItem = _canvas.nodes.find((v) => v.id === canvasId);

        if (existingItem) {
          (existingItem as CanvasTextData).text = canvasText;
        } else {
          const newNode: CanvasTextData = {
            type: "text",
            text: canvasText,
            id: canvasId,
            x: 0,
            y: 0,
            width: 300,
            height: 100,
          };
          _canvas.nodes.push(newNode);
        }
      });
    },

    markRemoved(workItems: WorkItem[]) {
      const consideredActiveAzNodes = workItems.map((wi) =>
        _getCanvasId(wi.id)
      );
      const nodesToMarkDeleted = _canvas.nodes
        .filter((node) => node.id.startsWith(ID_PREFIX))
        .filter((azNode) => !consideredActiveAzNodes.includes(azNode.id))
        .filter((azNode) => azNode.color !== DELETED_COLOR);

      nodesToMarkDeleted.forEach((node) => {
        node.color = DELETED_COLOR;
      });
    },

    get canvas() {
      return _canvas;
    },
  };
};
