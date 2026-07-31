import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../../src/database/EngineeringDatabase";
import { ComponentRepository } from "../../../src/database/repositories/ComponentRepository";
import type { Component } from "../../../src/models/Component";

function createComponent(id: string, overrides: Partial<Component> = {}): Component {
  return {
    id,
    type: "component",
    title: id,
    status: "draft",
    tags: [],
    sourcePath: `Components/${id}.md`,
    links: [],
    createdTime: 0,
    modifiedTime: 0,
    metadata: {},
    manufacturer: "Unknown",
    partNumber: id,
    datasheet: "",
    lifecycle: "unknown",
    ...overrides,
  };
}

describe("ComponentRepository", () => {
  it("finds components by manufacturer", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createComponent("CMP-001", {
        manufacturer: "STMicroelectronics",
      }),
    );
    database.upsert(
      createComponent("CMP-002", {
        manufacturer: "Texas Instruments",
      }),
    );
    database.upsert(
      createComponent("CMP-003", {
        manufacturer: "STMicroelectronics",
      }),
    );

    const repository = new ComponentRepository(database);

    expect(repository.findByManufacturer("STMicroelectronics")).toHaveLength(2);
    expect(repository.findByManufacturer("Texas Instruments")).toHaveLength(1);
    expect(repository.findByManufacturer("Unknown manufacturer")).toEqual([]);
  });

  it("finds components by part number", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createComponent("CMP-001", {
        partNumber: "STM32H743",
      }),
    );
    database.upsert(
      createComponent("CMP-002", {
        partNumber: "TPS26600",
      }),
    );

    const repository = new ComponentRepository(database);

    expect(repository.findByPartNumber("STM32H743")).toHaveLength(1);
    expect(repository.findByPartNumber("TPS26600")).toHaveLength(1);
    expect(repository.findByPartNumber("UNKNOWN")).toEqual([]);
  });

  it("finds components by lifecycle", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createComponent("CMP-001", {
        lifecycle: "active",
      }),
    );
    database.upsert(
      createComponent("CMP-002", {
        lifecycle: "obsolete",
      }),
    );

    const repository = new ComponentRepository(database);

    expect(repository.findByLifecycle("active")).toHaveLength(1);
    expect(repository.findByLifecycle("obsolete")).toHaveLength(1);
  });

  it("finds components by tag", () => {
    const database = new EngineeringDatabase();

    database.upsert(
      createComponent("CMP-001", {
        tags: ["mcu", "control"],
      }),
    );
    database.upsert(
      createComponent("CMP-002", {
        tags: ["power", "protection"],
      }),
    );

    const repository = new ComponentRepository(database);

    expect(repository.findByTag("mcu")).toHaveLength(1);
    expect(repository.findByTag("power")).toHaveLength(1);
    expect(repository.findByTag("unknown")).toEqual([]);
  });
});
