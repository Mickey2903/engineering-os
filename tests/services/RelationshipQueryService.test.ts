import { describe, expect, it } from "vitest";

import { EngineeringDatabase } from "../../src/database/EngineeringDatabase";
import { RelationshipGraph } from "../../src/services/relationships/RelationshipGraph";
import { RelationshipQueryService } from "../../src/services/relationships/RelationshipQueryService";
import type { Relationship } from "../../src/models/Relationship";


describe("RelationshipQueryService", () => {


  function createTestSetup() {

    const database =
      new EngineeringDatabase();


    database.upsert({
      id: "REQ-001",

      type: "requirement",

      title:
        "Operating voltage",

      status:
        "approved",

      tags: [],

      sourcePath:
        "Requirements/REQ-001.md",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},
    });


    database.upsert({
      id: "CMP-001",

      type: "component",

      title:
        "PLC100 CPU Module",

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


    database.upsert({
      id: "TEST-001",

      type: "verification",

      title:
        "Supply voltage test",

      status:
        "verified",

      tags: [],

      sourcePath:
        "Tests/TEST-001.md",

      links: [],

      modifiedTime:
        Date.now(),

      metadata: {},

      requirementIds: [
        "REQ-001",
      ],
    });


    const relationships:
      Relationship[] = [

      {
        sourceId:
          "REQ-001",

        targetId:
          "CMP-001",

        type:
          "implements",
      },


      {
        sourceId:
          "CMP-001",

        targetId:
          "TEST-001",

        type:
          "verifies",
      },


      {
        sourceId:
          "TEST-001",

        targetId:
          "CMP-001",

        type:
          "verified-by",
      },

    ];


    const graph =
      new RelationshipGraph(
        relationships,
      );


    const queryService =
      new RelationshipQueryService(
        database,
        graph,
      );


    return {
      database,
      graph,
      queryService,
    };

  }



  it("finds outgoing relationships", () => {

    const {
      queryService,
    } =
      createTestSetup();


    const result =
      queryService.findRelated(
        "CMP-001",
        "verifies",
      );


    expect(result)
      .toHaveLength(1);


    expect(result[0]?.id)
      .toBe("TEST-001");

  });

it("returns related entities with relationship type", () => {

  const {
    queryService,
  } =
    createTestSetup();


  const result =
    queryService.findRelatedWithRelationships(
      "CMP-001",
    );


  expect(result)
    .toHaveLength(1);


  expect(
    result[0]?.entity.id,
  )
  .toBe(
    "TEST-001",
  );


  expect(
    result[0]?.relationship,
  )
  .toBe(
    "verifies",
  );

});

  it("finds incoming relationships", () => {

    const {
      queryService,
    } =
      createTestSetup();


    const result =
      queryService.findIncoming(
        "CMP-001",
        "implements",
      );


    expect(result)
      .toHaveLength(1);


    expect(result[0]?.id)
      .toBe("REQ-001");

  });



  it("filters by relationship type", () => {

    const {
      queryService,
    } =
      createTestSetup();


    const result =
      queryService.findRelated(
        "CMP-001",
        "verified-by",
      );


    expect(result)
      .toHaveLength(0);

  });



  it("returns all outgoing relationships without filter", () => {

    const {
      queryService,
    } =
      createTestSetup();


    const result =
      queryService.findRelated(
        "CMP-001",
      );


    expect(result)
      .toHaveLength(1);


    expect(result[0]?.id)
      .toBe("TEST-001");

  });



  it("returns empty array for unknown object", () => {

    const {
      queryService,
    } =
      createTestSetup();


    const result =
      queryService.findRelated(
        "UNKNOWN",
      );


    expect(result)
      .toHaveLength(0);

  });


});
