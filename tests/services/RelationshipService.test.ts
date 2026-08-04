import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import { RelationshipService } from "../../src/services/RelationshipService";


describe("RelationshipService", () => {

  it("creates inverse relationships automatically", () => {

    const database =
      new EngineeringDatabase();


    database.upsert({

      id: "REQ-001",

      type: "requirement",

      title:
        "CPU requirement",

      status:
        "approved",

      tags: [],

      sourcePath:
        "Requirements/REQ-001.md",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {

        implements: [
          "CMP-001",
        ],

      },

    });


    database.upsert({

      id: "CMP-001",

      type: "component",

      title:
        "CPU Module",

      status:
        "active",

      tags: [],

      sourcePath:
        "Components/CMP-001.md",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},

      lifecycle:
        "prototype",

    });


    const service =
      new RelationshipService(
        database,
      );


    const graph =
      service.buildGraph();


    const outgoing =
      graph.outgoing(
        "REQ-001",
      );


    expect(
      outgoing,
    )
    .toContainEqual({
      sourceId:
        "REQ-001",

      targetId:
        "CMP-001",

      type:
        "implements",
    });


    const incoming =
      graph.outgoing(
        "CMP-001",
      );


    expect(
      incoming,
    )
    .toContainEqual({
      sourceId:
        "CMP-001",

      targetId:
        "REQ-001",

      type:
        "implemented-by",
    });

  });

});
