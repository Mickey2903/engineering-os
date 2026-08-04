export interface TemplateDefinition {

  readonly name: string;

  readonly content: string;

}


export class TemplateService {


  private readonly templates:
    readonly TemplateDefinition[];


  public constructor() {

    this.templates = [

      {
        name:
          "Component",

        content:
`---
id: CMP-XXX
type: component
title:
status: draft
lifecycle: concept
---

# Component


## Description


## Requirements


## Interfaces


## Verification

`,
      },


      {
        name:
          "Requirement",

        content:
`---
id: REQ-XXX
type: requirement
title:
status: draft
domain:
priority:
---

# Requirement


## Description


## Acceptance Criteria


## Verification

`,
      },


      {
        name:
          "Verification",

        content:
`---
id: TEST-XXX
type: verification
title:
status: draft
---

# Verification


## Purpose


## Procedure


## Result

`,
      },


      {
        name:
          "Risk",

        content:
`---
id: RISK-XXX
type: risk
status: open
severity:
---

# Risk


## Description


## Mitigation

`,
      },


      {
        name:
          "ADR",

        content:
`---
id: ADR-XXX
type: adr
status: proposed
---

# Decision


## Context


## Decision


## Consequences

`,
      },

    ];

  }



  public all():
  readonly TemplateDefinition[] {

    return this.templates;

  }



  public find(
    name: string,
  ):
  TemplateDefinition | undefined {

    return this.templates.find(
      template =>
        template.name === name,
    );

  }

}
