import { describe, expect, it } from "vitest";

import { RelationshipGraph } from "../../src/services/relationships/RelationshipGraph";


describe("RelationshipGraph", () => {

  it("finds dependencies and dependents", () => {

    const graph =
  new RelationshipGraph([
    {
      sourceId: "REQ-001",
      targetId: "CMP-001",
      type: "link",
    },
    {
      sourceId: "CMP-001",
      targetId: "TEST-001",
      type: "verified-by",
    },
  ]);


    expect(
      graph.dependencies("CMP-001"),
    )
      .toEqual([
        "TEST-001",
      ]);


    expect(
      graph.dependents("CMP-001"),
    )
      .toEqual([
        "REQ-001",
      ]);

  });

});
