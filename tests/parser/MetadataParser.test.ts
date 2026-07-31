import { describe, expect, it } from "vitest";
import { isRequirement } from "../../src/models/EngineeringEntity";
import { MetadataParser } from "../../src/parser/MetadataParser";
import { createFile, createLink, createMetadata } from "../helpers/ObsidianTestFactory";

describe("MetadataParser", () => {
  it("parses a requirement into a typed domain object", () => {
    const file = createFile("Requirements/SYS-PWR-001.md");

    const cache = createMetadata(
      {
        id: "SYS-PWR-001",
        title: "Input voltage range",
        type: "requirement",
        status: "approved",
        domain: "power",
        priority: "critical",
        tags: ["power", "safety"],
        acceptance: ["18 V through 28.8 V"],
        verificationMethod: "test",
        parent: "SYS-001",
      },
      [createLink("VER-PWR-001")],
    );

    const entity = new MetadataParser().parse(file, cache);

    expect(isRequirement(entity)).toBe(true);

    if (!isRequirement(entity)) {
      throw new Error("Expected requirement");
    }

    expect(entity.id).toBe("SYS-PWR-001");
    expect(entity.title).toBe("Input voltage range");
    expect(entity.status).toBe("approved");
    expect(entity.domain).toBe("power");
    expect(entity.priority).toBe("critical");
    expect(entity.tags).toEqual(["power", "safety"]);
    expect(entity.acceptanceCriteria).toEqual(["18 V through 28.8 V"]);
    expect(entity.verificationMethod).toBe("test");
    expect(entity.parentId).toBe("SYS-001");
    expect(entity.links).toEqual(["VER-PWR-001"]);
    expect(entity.sourcePath).toBe("Requirements/SYS-PWR-001.md");
  });

  it("uses safe unknown fallbacks", () => {
    const file = createFile("Requirements/Unknown.md");

    const cache = createMetadata({
      type: "requirement",
      domain: "warp",
      priority: "instant",
    });

    const entity = new MetadataParser().parse(file, cache);

    if (!isRequirement(entity)) {
      throw new Error("Expected requirement");
    }

    expect(entity.domain).toBe("unknown");
    expect(entity.priority).toBe("unknown");
    expect(entity.status).toBe("unknown");
  });

  it("uses the filename when id and title are missing", () => {
    const file = createFile("Requirements/SYS-IO-001.md");
    const cache = createMetadata({
      type: "requirement",
    });

    const entity = new MetadataParser().parse(file, cache);

    if (!isRequirement(entity)) {
      throw new Error("Expected requirement");
    }

    expect(entity.id).toBe("SYS-IO-001");
    expect(entity.title).toBe("SYS-IO-001");
  });
});
