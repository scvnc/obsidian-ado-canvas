import * as azdev from "azure-devops-node-api";
import { config } from "../config";

const getConnection = () => {
  let orgUrl = `https://dev.azure.com/${config.organizationName}`;

  let authHandler = azdev.getPersonalAccessTokenHandler(
    config.personalAccessToken
  );
  return new azdev.WebApi(orgUrl, authHandler);
};

export async function queryById(id: string) {
  const connection = getConnection();
  const workItemTrackingApi = await connection.getWorkItemTrackingApi();

  return workItemTrackingApi.queryById(id);
}

export const getWorkItems = async (ids: number[]) => {
  const connection = getConnection();
  const workItemTrackingApi = await connection.getWorkItemTrackingApi();

  return workItemTrackingApi.getWorkItems(ids);
};
