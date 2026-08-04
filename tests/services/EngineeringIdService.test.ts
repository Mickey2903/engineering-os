import { describe, expect, it } from "vitest";

import { EngineeringDatabase }
from "../../src/database/EngineeringDatabase";

import { EngineeringIdService }
from "../../src/services/EngineeringIdService";


describe(
  "EngineeringIdService",
  () => {


    it(
      "generates first component id",
      () => {

        const database =
          new EngineeringDatabase();


        const service =
          new EngineeringIdService(
            database,
          );


        expect(
          service.generate(
            "component",
          ),
        )
        .toBe(
          "CMP-001",
        );

      },
    );



    it(
      "increments existing ids",
      () => {

        const database =
          new EngineeringDatabase();


        database.upsert({

          id:
            "CMP-001",

          type:
            "component",

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

        });


        const service =
          new EngineeringIdService(
            database,
          );


        expect(
          service.generate(
            "component",
          ),
        )
        .toBe(
          "CMP-002",
        );

      },
    );


  },
);
