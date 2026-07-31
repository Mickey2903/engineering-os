import { describe, expect, it } from "vitest";
import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import type { EngineeringObject } from "../../src/models/EngineeringObject";

const document = (
  id: string,
  sourcePath: string,
  type: EngineeringObject["type"] = "requirement",
): EngineeringObject => ({
  id,
  title: id,
  type,
  status: "draft",
  sourcePath,
  tags: [],
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

    database.upsert(document("CMP-001", "Components/CMP-001.md", "component"));

    expect(database.removeByPath("Components/CMP-001.md")).toBe(true);
    expect(database.count()).toBe(0);
  });

  it("finds documents by engineering type", () => {
    const database = new EngineeringDatabase();

    database.upsert(document("SYS-PWR-001", "requirement.md"));
    database.upsert(document("CMP-001", "component.md", "component"));

    expect(database.findByType("requirement").map((item) => item.id)).toEqual(["SYS-PWR-001"]);

    expect(database.findByType("component").map((item) => item.id)).toEqual(["CMP-001"]);
  });
});
