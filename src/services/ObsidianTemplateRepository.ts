import type { DataAdapter } from "obsidian";

import type { TemplateRepository } from "./TemplateRepository";

export class ObsidianTemplateRepository
  implements TemplateRepository {

  public constructor(
    private readonly adapter: DataAdapter,
    private readonly basePath: string,
  ) {}

  public async getTemplate(
    name: string,
  ): Promise<string> {

    return await this.adapter.read(
      `${this.basePath}/${name}`,
    );
  }
}
