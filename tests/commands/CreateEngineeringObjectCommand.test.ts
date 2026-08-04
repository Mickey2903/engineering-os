import { describe, expect, it, vi } from "vitest";

import { TemplateService }
from "../../src/services/TemplateService";

import { EngineeringIdService }
from "../../src/services/EngineeringIdService";

import { EngineeringDatabase }
from "../../src/database/EngineeringDatabase";

import { CreateEngineeringObjectCommand }
from "../../src/commands/CreateEngineeringObjectCommand";


describe(
  "CreateEngineeringObjectCommand",
  () => {


    it(
      "creates engineering object from template",
      async () => {


        const writer = {

          write:
            vi.fn()
              .mockResolvedValue(
                undefined,
              ),

        };


        const database =
          new EngineeringDatabase();


        const command =
          new CreateEngineeringObjectCommand(
            new TemplateService(),

            new EngineeringIdService(
              database,
            ),

            writer,
          );


        const id =
          await command.execute(
            "Component",
            "component",
            "Components",
          );


        expect(id)
          .toBe(
            "CMP-001",
          );


        expect(
          writer.write,
        )
        .toHaveBeenCalled();


        expect(
          writer.write.mock.calls[0]?.[0],
        )
        .toBe(
          "Components/CMP-001.md",
        );


        expect(
          writer.write.mock.calls[0]?.[1],
        )
        .toContain(
          "id: CMP-001",
        );

      },
    );


  },
);
