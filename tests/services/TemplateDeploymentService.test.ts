import { describe, expect, it } from "vitest";

import { TemplateDeploymentService } from "../../src/services/TemplateDeploymentService";


describe("TemplateDeploymentService", () => {

  it("deploys engineering templates and returns deployment report", async () => {

    const files: Record<string, string> = {};


    const writer = {

  exists: async (
    path: string,
  ): Promise<boolean> => {
    return path in files;
  },


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
      ): Promise<string> => {
        return `content-${name}`;
      },
    };


    const service =
      new TemplateDeploymentService(
        writer,
        templates,
      );


    const result =
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
      Object.keys(files),
    )
      .toHaveLength(7);


    expect(
      result.createdTemplates,
    )
      .toHaveLength(7);


    expect(
      result.skippedTemplates,
    )
      .toHaveLength(0);
  });



  it("writes every template exactly once", async () => {

    const paths: string[] = [];


    const writer = {

  exists: async (
    _path: string,
  ): Promise<boolean> => {
    return false;
  },


  write: async (
    path: string,
  ): Promise<void> => {
    paths.push(path);
  },

};


    const templates = {
      getTemplate: async (
        name: string,
      ): Promise<string> => {
        return `content-${name}`;
      },
    };


    const service =
      new TemplateDeploymentService(
        writer,
        templates,
      );


    const result =
      await service.deploy();


    expect(
      new Set(paths).size,
    )
      .toBe(
        paths.length,
      );


    expect(
      result.createdTemplates,
    )
      .toHaveLength(7);


    expect(
      result.skippedTemplates,
    )
      .toHaveLength(0);
  });
  it("skips existing templates", async () => {

  const written: string[] = [];


  const writer = {

    exists: async (
      path: string,
    ): Promise<boolean> => {
      return (
        path ===
        "Engineering/Requirements/Requirement Template.md"
      );
    },


    write: async (
      path: string,
      _content: string,
    ): Promise<void> => {
      written.push(path);
    },

  };


  const templates = {

    getTemplate: async (
      name: string,
    ): Promise<string> => {
      return `content-${name}`;
    },

  };


  const service =
    new TemplateDeploymentService(
      writer,
      templates,
    );


  const result =
    await service.deploy();


  expect(
    result.skippedTemplates,
  )
    .toContain(
      "Engineering/Requirements/Requirement Template.md",
    );


  expect(
    result.createdTemplates,
  )
    .toHaveLength(6);


  expect(
    written,
  )
    .not
    .toContain(
      "Engineering/Requirements/Requirement Template.md",
    );

});

});
