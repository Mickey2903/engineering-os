import type { WorkspaceMigrationService } from "./WorkspaceMigrationService";
import type { WorkspaceVersionService } from "./WorkspaceVersionService";


export class WorkspaceMigrationRunner {

  public constructor(
    private readonly versions: WorkspaceVersionService,
    private readonly migrations: WorkspaceMigrationService,
    private readonly targetVersion: number,
  ) {}


  public async run(): Promise<void> {

    const current =
      await this.versions.getVersion();


    console.log(
      "[Engineering  Migration] Current version:",
      current,
    );


    if (current >= this.targetVersion) {

      console.log(
        "[Engineering  Migration] Workspace already up to date",
      );

      return;
    }


    console.log(
      "[Engineering  Migration] Starting migration",
    );


    const version =
      await this.migrations.migrate(
        current,
        this.targetVersion,
      );


    console.log(
      "[Engineering  Migration] Migration result:",
      version,
    );


    await this.versions.setVersion(
      version,
    );


    console.log(
      "[Engineering  Migration] Version saved",
    );

  }

}
