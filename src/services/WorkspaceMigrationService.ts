import type { WorkspaceMigration } from "../migrations/WorkspaceMigration";


export class WorkspaceMigrationService {

  public constructor(
    private readonly migrations:
      readonly WorkspaceMigration[],
  ) {}


  public async migrate(
    currentVersion: number,
    targetVersion: number,
  ): Promise<number> {

    let version =
      currentVersion;


    while (version < targetVersion) {

      const migration =
        this.migrations.find(
          (item) =>
            item.fromVersion === version,
        );


      if (!migration) {
        throw new Error(
          `No migration found from version ${String(version)}`,
        );
      }


      await migration.execute();


      version =
        migration.toVersion;
    }


    return version;
  }
}
