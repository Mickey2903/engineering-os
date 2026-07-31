import { describe, expect, it } from "vitest";

import type { Relationship } from "../../../src/models/Relationship";
import { GraphAlgorithms } from "../../../src/services/graph/GraphAlgorithms";
import { RelationshipGraph } from "../../../src/services/relationships/RelationshipGraph";

describe("GraphAlgorithms findReachable", () => {
  it("finds all reachable nodes", () => {
    const graph = new RelationshipGraph([
      { sourceId: "A", targetId: "B", type: "link" },
      { sourceId: "A", targetId: "C", type: "link" },
      { sourceId: "B", targetId: "D", type: "link" },
      { sourceId: "C", targetId: "E", type: "link" },
    ] satisfies readonly Relationship[]);

    const algorithms = new GraphAlgorithms(graph);

    expect(new Set(algorithms.findReachable("A"))).toEqual(new Set(["B", "C", "D", "E"]));
  });

  it("does not include the start node", () => {
    const graph = new RelationshipGraph([
      { sourceId: "A", targetId: "B", type: "link" },
    ] satisfies readonly Relationship[]);

    const algorithms = new GraphAlgorithms(graph);

    expect(algorithms.findReachable("A")).not.toContain("A");
  });

  it("returns an empty result for an unknown node", () => {
    const graph = new RelationshipGraph([]);
    const algorithms = new GraphAlgorithms(graph);

    expect(algorithms.findReachable("UNKNOWN")).toEqual([]);
  });

  it("handles cycles without looping forever", () => {
    const graph = new RelationshipGraph([
      { sourceId: "A", targetId: "B", type: "link" },
      { sourceId: "B", targetId: "C", type: "link" },
      { sourceId: "C", targetId: "A", type: "link" },
    ] satisfies readonly Relationship[]);

    const algorithms = new GraphAlgorithms(graph);

    expect(new Set(algorithms.findReachable("A"))).toEqual(new Set(["B", "C"]));
  });
});

describe("GraphAlgorithms findAllPaths", () => {
  it("finds all simple paths between two nodes", () => {
    const graph = new RelationshipGraph([
      { sourceId: "A", targetId: "B", type: "link" },
      { sourceId: "A", targetId: "C", type: "link" },
      { sourceId: "B", targetId: "D", type: "link" },
      { sourceId: "C", targetId: "D", type: "link" },
    ] satisfies readonly Relationship[]);

    const algorithms = new GraphAlgorithms(graph);

    expect(algorithms.findAllPaths("A", "D")).toEqual([
      ["A", "B", "D"],
      ["A", "C", "D"],
    ]);
  });

  it("returns an empty array when no path exists", () => {
    const graph = new RelationshipGraph([
      { sourceId: "A", targetId: "B", type: "link" },
      { sourceId: "C", targetId: "D", type: "link" },
    ] satisfies readonly Relationship[]);

    const algorithms = new GraphAlgorithms(graph);

    expect(algorithms.findAllPaths("A", "D")).toEqual([]);
  });

  it("does not revisit nodes in cyclic graphs", () => {
    const graph = new RelationshipGraph([
      { sourceId: "A", targetId: "B", type: "link" },
      { sourceId: "B", targetId: "A", type: "link" },
      { sourceId: "B", targetId: "C", type: "link" },
    ] satisfies readonly Relationship[]);

    const algorithms = new GraphAlgorithms(graph);

    expect(algorithms.findAllPaths("A", "C")).toEqual([["A", "B", "C"]]);
  });
});

it("returns the trivial path when start equals target", () => {
  const graph = new RelationshipGraph([
    { sourceId: "A", targetId: "B", type: "link" },
  ] satisfies readonly Relationship[]);

  const algorithms = new GraphAlgorithms(graph);

  expect(algorithms.findAllPaths("A", "A")).toEqual([["A"]]);
});
