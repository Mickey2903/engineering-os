import { describe, expect, it } from "vitest";

import { TemplateService }
from "../../src/services/TemplateService";


describe("TemplateService", () => {


  it("provides engineering templates", () => {

    const service =
      new TemplateService();


    expect(
      service.all().length,
    )
    .toBeGreaterThan(0);


    expect(
      service.find("Component"),
    )
    .toBeDefined();


  });


  it("returns component template content", () => {

    const service =
      new TemplateService();


    const template =
      service.find(
        "Component",
      );


    expect(
      template?.content,
    )
    .toContain(
      "type: component",
    );

  });


});
