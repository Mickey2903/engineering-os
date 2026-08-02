import { describe, expect, it } from "vitest";

import { EngineeringRelatedContextService } from "../../src/services/knowledge/EngineeringRelatedContextService";


describe("EngineeringRelatedContextService", () => {

  it("finds incoming and outgoing related objects", () => {


    const objects = [
      {
        id: "CMP-001",
        type: "component",
        title: "PLC100 CPU Module",
        status: "active",
      },

      {
        id: "REQ-001",
        type: "requirement",
        title: "Operating voltage",
        status: "approved",
      },

      {
        id: "TEST-001",
        type: "verification",
        title: "Supply voltage test",
        status: "verified",
      },

      {
        id: "UNRELATED",
        type: "component",
        title: "Other module",
        status: "active",
      },
    ];


    const graph = {

      outgoing: (
        id: string,
      ) => {

        if (id === "CMP-001") {

          return [
            {
              sourceId: "CMP-001",
              targetId: "TEST-001",
            },
          ];

        }

        return [];

      },


      incoming: (
        id: string,
      ) => {

        if (id === "CMP-001") {

          return [
            {
              sourceId: "REQ-001",
              targetId: "CMP-001",
            },
          ];

        }

        return [];

      },

    };


    const snapshot =
      {
        objects,
        graph,
      } as any;


    const service =
      new EngineeringRelatedContextService(
        snapshot,
      );


    const result =
      service.findRelated(
        "CMP-001",
      );


    expect(result)
      .toHaveLength(2);


    expect(
      result.map(
        (object) =>
          object.id,
      ),
    )
      .toContain("REQ-001");


    expect(
      result.map(
        (object) =>
          object.id,
      ),
    )
      .toContain("TEST-001");


    expect(
      result.map(
        (object) =>
          object.id,
      ),
    )
      .not
      .toContain("UNRELATED");

  });

});
