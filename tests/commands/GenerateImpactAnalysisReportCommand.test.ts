import { describe, expect, it } from "vitest";

import { GenerateImpactAnalysisReportCommand } from "../../src/commands/GenerateImpactAnalysisReportCommand";


describe("GenerateImpactAnalysisReportCommand", () => {

  it("generates an impact analysis report", async () => {

    const report = {

      rootObjectId: "CMP-001",

      affectedObjects: [
        "REQ-001",
        "TEST-001",
      ],

      affectedComponents: [
        "CMP-002",
      ],

      affectedRequirements: [
        "REQ-001",
      ],

      affectedTests: [
        "TEST-001",
      ],

    };


    let writtenPath = "";

    let writtenContent = "";


    const analysis = {

      analyze: (
        _objectId: string,
      ) => report,

    };


    const renderer = {

      render: (
        _report: typeof report,
      ): string => {

        return [
          "# Impact Analysis Report",
          "",
          report.rootObjectId,
        ].join("\n");

      },

    };


    const writer = {

      write: async (
        path: string,
        content: string,
      ): Promise<void> => {

        writtenPath = path;

        writtenContent = content;

      },

    };


    const command =
      new GenerateImpactAnalysisReportCommand(
        analysis,
        renderer,
        writer,
      );


    await command.execute(
      "CMP-001",
    );


    expect(
      writtenPath,
    )
      .toBe(
        "Engineering/Reports/Impact Analysis.md",
      );


    expect(
      writtenContent,
    )
      .toContain(
        "Impact Analysis Report",
      );


    expect(
      writtenContent,
    )
      .toContain(
        "CMP-001",
      );

  });

});
