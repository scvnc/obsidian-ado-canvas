import { beforeEach, describe, expect, it, vi } from "vitest";
import { getWorkItemsFromQuery, WorkItem } from "../services/work-item.service";

import * as AzureIO from "../io/Azure.io";
import { WorkItemReference } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { getWorkItemUrl } from "../util";

import { config } from "../config";

// TODO: move to common test setup
vi.spyOn(config, "projectName", "get").mockReturnValue("testProject");
vi.spyOn(config, "organizationName", "get").mockReturnValue("testOrg");

vi.mock("../io/Azure.io");

const createWorkItemReference = (id: number): WorkItemReference => {
  return {
    id,
    url: `https://fake.azure.com/${id}`,
  };
};

const createAzWorkItem = (id: number) => {
  return {
    id: id,
    fields: {
      "System.Title": `Title for ${id}`,
    },
  };
};

describe("Work Item Service", () => {
  let result: WorkItem[];

  beforeEach(async () => {
    // Return 3 items
    vi.mocked(AzureIO.queryById).mockResolvedValue({
      workItems: [
        createWorkItemReference(1234),
        createWorkItemReference(4567),
        createWorkItemReference(8765),
      ],
    });

    vi.mocked(AzureIO.getWorkItems).mockResolvedValue([
      createAzWorkItem(8765),
      createAzWorkItem(4567),
      createAzWorkItem(1234),
    ]);

    result = await getWorkItemsFromQuery("abcdefg");
  });

  it("retrieves all the work item ids of a particular Work-Item query", async () => {
    expect(AzureIO.queryById).toHaveBeenCalledWith("abcdefg");
  });

  it("obtains the details for all the work-items of the query", () => {
    expect(AzureIO.getWorkItems).toHaveBeenCalled();

    const idsOfCall = vi.mocked(AzureIO.getWorkItems).mock.lastCall?.at(0);

    [1234, 8765, 4567].forEach((expectedId) => {
      expect(idsOfCall).toContain(expectedId);
    });
  });

  it("maps to a consolidated model", () => {
    [
      { id: 1234, title: "Title for 1234", url: getWorkItemUrl(1234) },
      { id: 4567, title: "Title for 4567", url: getWorkItemUrl(4567) },
      { id: 8765, title: "Title for 8765", url: getWorkItemUrl(8765) },
    ].forEach((expectedRecord) => {
      expect(result.length).not.toEqual(0);

      expect(result).toContainEqual(expectedRecord);
    });
  });
});
