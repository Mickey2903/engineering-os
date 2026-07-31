import { describe, expect, it } from "vitest";
import { ProjectMetadataParser } from "../../src/parser/ProjectMetadataParser";

describe("ProjectMetadataParser", () => {
  it("parses valid project metadata", () => {
    const parser =
      new ProjectMetadataParser();

    const result =
      parser.parse({
        type: "project",
        id: "PLC-001",
        name: "PLC Controller",
        description: "Industrial PLC project",
        projectType: "embedded",
        status: "development",
      });

    expect(result).toEqual({
      id: "PLC-001",
      name: "PLC Controller",
      description: "Industrial PLC project",
      projectType: "embedded",
      status: "development",
    });
  });


  it("returns undefined for non-project metadata", () => {
    const parser =
      new ProjectMetadataParser();

    const result =
      parser.parse({
        type: "requirement",
        id: "REQ-001",
        name: "Motor voltage",
      });

    expect(result).toBeUndefined();
  });


  it("returns undefined when required fields are missing", () => {
    const parser =
      new ProjectMetadataParser();

    const result =
      parser.parse({
        type: "project",
        name: "Missing ID",
      });

    expect(result).toBeUndefined();
  });
});
