export interface WorkItem {
  id: number;
  title: string;
  url: string;
}
import * as AzureIo from "../io/Azure.io";
import { getWorkItemUrl } from "../util";
import { validateNumber } from "../validation";

export const getWorkItemsFromQuery = async (
  queryId: string
): Promise<WorkItem[]> => {
  const queryResult = await AzureIo.queryById(queryId);

  if (
    queryResult.workItems === undefined ||
    queryResult.workItems.length === 0
  ) {
    return [];
  }

  const ids = queryResult.workItems.map((wi) => validateNumber(wi.id));

  const wis = await AzureIo.getWorkItems(ids);

  const workItems: WorkItem[] = wis.map((wi) => ({
    id: validateNumber(wi.id),
    title: wi.fields!["System.Title"],
    url: getWorkItemUrl(wi.id!),
  }));

  return workItems;
};
