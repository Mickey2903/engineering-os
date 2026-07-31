import { describe, expect, it } from "vitest";

import { ComponentHealthRule } from "../../../src/intelligence/rules/ComponentHealthRule";
import { mockDatabase } from "../../helpers/mockEngineeringDatabaseReader";


describe("ComponentHealthRule", () => {

  it("detects unknown lifecycle", () => {

    const rule =
      new ComponentHealthRule();


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
            "unknown",
        },
      ]);


    const insights =
      rule.evaluate(database);


    expect(insights)
      .toHaveLength(2);


    expect(
      insights.some(
        (i) =>
          i.title ===
          "Missing component lifecycle",
      ),
    )
      .toBe(true);
  });


  it("detects obsolete components", () => {

    const rule =
      new ComponentHealthRule();


    const database =
      mockDatabase([
        {
          id: "COMP-002",
          type: "component",
          title: "Old Sensor",

          status: "active",
          tags: [],

          sourcePath:
            "Components/COMP-002.md",

          links: [
            "REQ-001",
          ],

          modifiedTime: Date.now(),
          metadata: {},

          lifecycle:
            "obsolete",
        },
      ]);


    const insights =
      rule.evaluate(database);


    expect(insights)
      .toHaveLength(1);


    expect(insights[0]?.title)
      .toBe(
        "Obsolete component",
      );
  });


  it("does not report healthy components", () => {

    const rule =
      new ComponentHealthRule();


    const database =
      mockDatabase([
        {
          id: "COMP-003",
          type: "component",
          title: "Motor Driver",

          status: "active",
          tags: [],

          sourcePath:
            "Components/COMP-003.md",

          links: [
            "REQ-001",
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

