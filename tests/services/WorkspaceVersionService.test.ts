import { describe, expect, it } from "vitest";

import { WorkspaceVersionService } from "../../src/services/WorkspaceVersionService";


describe("WorkspaceVersionService", () => {

  it("writes workspace version file", async () => {

    let writtenPath = "";
    let writtenContent = "";


    const service =
      new WorkspaceVersionService(
        async (): Promise<string> => {
          return "";
        },

        async (
          path: string,
          content: string,
        ): Promise<void> => {
          writtenPath = path;
          writtenContent = content;
        },
      );


    await service.setVersion(1);


    expect(writtenPath)
      .toBe(
        "Engineering/.workspace-version.md",
      );


    expect(writtenContent)
      .toContain(
        "version: 1",
      );

  });



  it("returns default version when no version exists", async () => {

    const service =
      new WorkspaceVersionService(
        async (): Promise<string> => {
          throw new Error("file not found");
        },

        async (): Promise<void> => {},
      );


    const version =
      await service.getVersion();


    expect(version)
      .toBe(0);

  });

});
