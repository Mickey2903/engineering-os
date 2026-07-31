import { describe, expect, it } from "vitest";

import { ArchitectureHealthRule } from "../../../src/intelligence/rules/ArchitectureHealthRule";
import { mockDatabase } from "../../helpers/mockEngineeringDatabaseReader";


describe("ArchitectureHealthRule", () => {

  it("detects architecture without relations", () => {

    const rule =
      new ArchitectureHealthRule();


    const database =
      mockDatabase([
        {
          id: "ARCH-001",
          type: "architecture",
          title: "System Architecture",

          status: "active",
          tags: [],

          sourcePath:
            "Architecture/ARCH-001.md",

          links: [],

          modifiedTime: Date.now(),
          metadata: {},
        },
      ]);


    const insights =
      rule.evaluate(database);


    expect(insights)
      .toHaveLength(1);


    expect(insights[0]?.title)
      .toBe(
        "Architecture has no relations",
      );


    expect(insights[0]?.objectId)
      .toBe(
        "ARCH-001",
      );
  });


  it("detects interface without relations", () => {

    const rule =
      new ArchitectureHealthRule();


    const database =
      mockDatabase([
        {
          id: "IF-001",
          type: "interface",
          title: "CAN Interface",

          status: "active",
          tags: [],

          sourcePath:
            "Interfaces/IF-001.md",

          links: [],

          modifiedTime: Date.now(),
          metadata: {},
        },
      ]);


    const insights =
      rule.evaluate(database);


    expect(insights)
      .toHaveLength(1);


    expect(insights[0]?.title)
      .toBe(
        "Interface has no relations",
      );
  });


  it("detects component without architecture relation", () => {

    const rule =
      new ArchitectureHealthRule();


    const database =
      mockDatabase([
        {
          id: "COMP-001",
          type: "component",
          title: "Motor Controller",

          status: "active",
          tags: [],

          sourcePath:
            "Components/COMP-001.md",

          links: [],

          modifiedTime: Date.now(),
          metadata: {},

          lifecycle:
            "active",
        },
      ]);


    const insights =
      rule.evaluate(database);


    expect(insights)
      .toHaveLength(1);


    expect(insights[0]?.title)
      .toBe(
        "Component has no architecture relation",
      );
  });


  it("does not report connected architecture objects", () => {

    const rule =
      new ArchitectureHealthRule();


    const database =
      mockDatabase([
        {
          id: "ARCH-002",
          type: "architecture",
          title: "Main Architecture",

          status: "active",
          tags: [],

          sourcePath:
            "Architecture/ARCH-002.md",

          links: [
            "COMP-001",
          ],

          modifiedTime: Date.now(),
          metadata: {},
        },

        {
          id: "COMP-001",
          type: "component",
          title: "Controller",

          status: "active",
          tags: [],

          sourcePath:
            "Components/COMP-001.md",

          links: [
            "ARCH-002",
          ],

          modifiedTime: Date.now(),
          metadata: {},

          lifecycle:
            "active",
        },
      ]);


    const insights =
      rule.evaluate(database);


    expect(insights)
      .toHaveLength(0);
  });

});
