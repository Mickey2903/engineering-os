import { describe, expect, it } from "vitest";
import type { TemplateDeploymentService } from "../../src/services/TemplateDeploymentService";
import { InitializeEngineeringWorkspaceCommand } from "../../src/commands/InitializeEngineeringWorkspaceCommand";


describe("InitializeEngineeringWorkspaceCommand", () => {

  it("creates the engineering workspace structure", async () => {

    const folders: string[] = [];


    const writer = {
      createFolder: async (
        path: string,
      ): Promise<void> => {
        folders.push(path);
      },
    };


    const command =
      new InitializeEngineeringWorkspaceCommand(
  writer,
 {
  deploy: async () => ({
    createdTemplates: [],
    skippedTemplates: [],
  }),
} as unknown as TemplateDeploymentService
);


    await command.execute();


    expect(folders)
      .toContain(
        "Engineering",
      );

    expect(folders)
      .toContain(
        "Engineering/Projects",
      );

    expect(folders)
      .toContain(
        "Engineering/Requirements",
      );

    expect(folders)
      .toContain(
        "Engineering/Components",
      );

    expect(folders)
      .toContain(
        "Engineering/Verification",
      );

    expect(folders)
      .toContain(
        "Engineering/Risks",
      );

    expect(folders)
      .toContain(
        "Engineering/Architecture",
      );

    expect(folders)
      .toContain(
        "Engineering/Interfaces",
      );

    expect(folders)
      .toContain(
        "Engineering/Reports",
      );
  });


  it("creates all folders exactly once", async () => {

    const folders: string[] = [];


    const writer = {
      createFolder: async (
        path: string,
      ): Promise<void> => {
        folders.push(path);
      },
    };


    const command =
      new InitializeEngineeringWorkspaceCommand(
  writer,
  {
  deploy: async () => ({
    createdTemplates: [],
    skippedTemplates: [],
  }),
} as unknown as TemplateDeploymentService
);


    const result =
  await command.execute();
  expect(
  result.createdTemplates,
)
.toEqual([]);
  


    expect(new Set(folders).size)
      .toBe(
        folders.length,
      );
  });

});
