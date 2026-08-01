import { describe, expect, it } from "vitest";

import { GenerateWorkspaceStatusReportCommand } from "../../src/commands/GenerateWorkspaceStatusReportCommand";


describe("GenerateWorkspaceStatusReportCommand", () => {

  it("generates a workspace status report", async () => {

    let writtenPath = "";
    let writtenContent = "";


    const service = {
      generate: async () => ({
        workspaceVersion: 1,
        indexedObjects: 10,
        requirements: 4,
        components: 3,
        risks: 2,
        verificationCoverage: 50,
      }),
    };


    const renderer = {
      render: (
        report: {
          workspaceVersion: number;
        },
      ) =>
        `Version: ${String(report.workspaceVersion)}`,
    };


    const writer = {
      write: async (
        path: string,
        content: string,
      ) => {

        writtenPath = path;
        writtenContent = content;

      },
    };


    const command =
      new GenerateWorkspaceStatusReportCommand(
        service,
        renderer,
        writer,
      );


    await command.execute();


    expect(writtenPath)
      .toBe(
        "Engineering/Reports/Workspace Status.md",
      );


    expect(writtenContent)
      .toContain(
        "Version: 1",
      );

  });

});
