import { describe, expect, it } from "vitest";

import { WorkspaceMigrationRunner } from "../../src/services/WorkspaceMigrationRunner";
import { WorkspaceVersionService } from "../../src/services/WorkspaceVersionService";
import { WorkspaceMigrationService } from "../../src/services/WorkspaceMigrationService";

describe("WorkspaceMigrationRunner", () => {

  it("runs migrations and stores the new version", async () => {

    let storedVersion = 0;
    let executed = false;


    const versions =
  new WorkspaceVersionService(

    async (): Promise<string> => {
      return `
---
version: 0
---
`;
    },


    async (
      _path: string,
      content: string,
    ): Promise<void> => {

      const match =
        content.match(
          /version:\s*(\d+)/,
        );

      if (match) {
        storedVersion =
          Number(match[1]);
      }

    },

  );


    const migrations =
  new WorkspaceMigrationService([
    {
      fromVersion: 0,
      toVersion: 1,

      execute: async (): Promise<void> => {
        executed = true;
      },
    },
  ]);


    const runner =
      new WorkspaceMigrationRunner(
        versions,
        migrations,
        1,
      );


    await runner.run();


    expect(executed)
      .toBe(true);


    expect(storedVersion)
      .toBe(1);

  });



  it("does nothing when workspace is already up to date", async () => {

    let migrated = false;


    const runner =
      new WorkspaceMigrationRunner(
        new WorkspaceVersionService(

  async (): Promise<string> => {
    return `
---
version: 1
---
`;
  },

  async (): Promise<void> => {},

),

        new WorkspaceMigrationService([]),

        1,
      );


    await runner.run();


    expect(migrated)
      .toBe(false);

  });

});
