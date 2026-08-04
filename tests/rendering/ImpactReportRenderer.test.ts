import { describe, expect, it } from "vitest";

import { ImpactReportRenderer } from "../../src/rendering/ImpactReportRenderer";


describe("ImpactReportRenderer", () => {


  it("renders impact analysis report", () => {


    const renderer =
      new ImpactReportRenderer();


    const result =
      renderer.render({

        root: {
          id: "CMP-001",
          type: "component",
          title: "CPU Module",
          status: "active",
          tags: [],
          sourcePath: "CMP-001.md",
          links: [],
          modifiedTime: Date.now(),
          metadata: {},
        },


        impacted: [

          {
            entity: {
              id: "TEST-001",
              type: "verification",
              title: "Voltage Test",
              status: "verified",
              tags: [],
              sourcePath: "TEST-001.md",
              links: [],
              modifiedTime: Date.now(),
              metadata: {},
            },

            depth: 1,

            severity:
              "critical",

            path: [

              {
                sourceId:
                  "CMP-001",

                targetId:
                  "TEST-001",

                type:
                  "verifies",
              },

            ],
          },

        ],

      });


    expect(result)
      .toContain(
        "CRITICAL Impact",
      );


    expect(result)
      .toContain(
        "CMP-001 → verifies → TEST-001",
      );

  });


});
