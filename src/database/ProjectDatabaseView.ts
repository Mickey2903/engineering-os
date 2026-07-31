import type { EngineeringDatabaseReader } from "./EngineeringDatabaseReader";
import type { EngineeringEntity } from "../models/EngineeringEntity";
import type { EngineeringObjectType } from "../models/EngineeringObject";

export class ProjectDatabaseView {
  public constructor(
    private readonly database: EngineeringDatabaseReader,
    private readonly projectId: string,
  ) {}

  public findByType(
    type: EngineeringObjectType,
  ): readonly EngineeringEntity[] {
    return this.database
      .findByProject(this.projectId)
      .filter((entity) => entity.type === type);
  }

  public findById(
    id: string,
  ): EngineeringEntity | undefined {
    const entity =
      this.database.findById(id);

    if (!entity || entity.projectId !== this.projectId) {
      return undefined;
    }

    return entity;
  }

  public all(): readonly EngineeringEntity[] {
    return this.database.findByProject(
      this.projectId,
    );
  }

  public findByProject(
    projectId: string,
  ): readonly EngineeringEntity[] {
    if (projectId !== this.projectId) {
      return [];
    }

    return this.all();
  }
}
