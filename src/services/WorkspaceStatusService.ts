import type { WorkspaceStatusReport } from "../models/WorkspaceStatusReport";
import type { WorkspaceVersionService } from "./WorkspaceVersionService";
import type { EngineeringDatabase } from "../database/EngineeringDatabase";


export class WorkspaceStatusService {

  public constructor(
    private readonly versions: WorkspaceVersionService,
    private readonly database: EngineeringDatabase,
  ) {}


  public async generate(): Promise<WorkspaceStatusReport> {

    const workspaceVersion =
      await this.versions.getVersion();


    const entities =
      this.database.all();


    return {

      workspaceVersion,

      indexedObjects:
        entities.length,


      requirements:
        entities.filter(
          (entity) =>
            entity.type === "requirement",
        ).length,


      components:
        entities.filter(
          (entity) =>
            entity.type === "component",
        ).length,


      risks:
        entities.filter(
          (entity) =>
            entity.type === "risk",
        ).length,


      verificationCoverage:
        0,

    };

  }

}
