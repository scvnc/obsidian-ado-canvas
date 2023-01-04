import { config } from "./config";

export const getWorkItemUrl = (id: number) => {
  return `https://${config.organizationName}.visualstudio.com/${config.projectName}/_workitems/edit/${id}/`;
};
