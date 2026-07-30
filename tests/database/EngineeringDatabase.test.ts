import { describe, expect, it } from "vitest";
import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import type { EngineeringDocument } from "../../src/models/EngineeringDocument";

const document = (id: string, sourcePath: string): EngineeringDocument => ({
  id,
  title: id,
  type: "requirement",
  sourcePath,
  links: [],
  metadata: {},
  modifiedTime: 1,
});

describe("EngineeringDatabase", () => {
  it("stores and retrieves documents", () => {
    const database = new EngineeringDatabase();
    database.upsert(document("SYS-PWR-001", "Requirements/SYS-PWR-001.md"));

    expect(database.findById("SYS-PWR-001")?.sourcePath).toBe("Requirements/SYS-PWR-001.md");
  });

  it("rejects duplicate IDs from different files", () => {
    const database = new EngineeringDatabase();
    database.upsert(document("SYS-PWR-001", "a.md"));

    expect(() => database.upsert(document("SYS-PWR-001", "b.md"))).toThrow(
      /Duplicate engineering ID/,
    );
  });

  it("removes documents by source path", () => {
    const database = new EngineeringDatabase();
    database.upsert(document("CMP-001", "Components/CMP-001.md"));

    expect(database.removeByPath("Components/CMP-001.md")).toBe(true);
    expect(database.count()).toBe(0);
  });
});
