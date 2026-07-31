import { describe, expect, it } from "vitest";

import { TemplateDeploymentService } from "../../src/services/TemplateDeploymentService";


describe("TemplateDeploymentService", () => {

  it("deploys engineering templates", async () => {

    const files: Record<string, string> = {};


    const writer = {
      write: async (
        path: string,
        content: string,
      ): Promise<void> => {
        files[path] = content;
      },
    };

const templates = {
  getTemplate: async (
    name: string,
  ): Promise<string> =>
    `content-${name}`,
};
    const service =
      new TemplateDeploymentService(
  writer,
  templates,
      );


    await service.deploy();


    expect(
      files[
        "Engineering/Requirements/Requirement Template.md"
      ],
    )
      .toBe(
        "content-Requirement.md",
      );


    expect(
      files[
        "Engineering/Components/Component Template.md"
      ],
    )
      .toBe(
        "content-Component.md",
      );


    expect(
      files[
        "Engineering/Risks/Risk Template.md"
      ],
    )
      .toBe(
        "content-Risk.md",
      );


    expect(
      Object.keys(files).length,
    )
      .toBe(7);
  });


  it("writes every template exactly once", async () => {

    const paths: string[] = [];


    const writer = {
      write: async (
        path: string,
      ): Promise<void> => {
        paths.push(path);
      },
    };

const templates = {
  getTemplate: async (
    name: string,
  ): Promise<string> =>
    `content-${name}`,
};
    const service =
      new TemplateDeploymentService(
  writer,
  templates,
);


    await service.deploy();


    expect(
      new Set(paths).size,
    )
      .toBe(
        paths.length,
      );
  });

});
