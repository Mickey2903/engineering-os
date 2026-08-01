import type { WorkspaceMigration } from "./WorkspaceMigration";


export class Migration001InitialWorkspace
  implements WorkspaceMigration {

  public readonly fromVersion = 0;

  public readonly toVersion = 1;


  public constructor(
    private readonly createFolder: (
      path: string,
    ) => Promise<void>,
  ) {}


  public async execute(): Promise<void> {

    await this.createFolder(
      "Engineering/Reports",
    );

    await this.createFolder(
      "Engineering/Interfaces",
    );

  }
}
