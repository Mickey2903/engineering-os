export class WorkspaceVersionService {

  private readonly versionPath =
    "Engineering/.workspace-version.md";


  public constructor(
    private readonly readFile: (
      path: string,
    ) => Promise<string>,

    private readonly writeFile: (
      path: string,
      content: string,
    ) => Promise<void>,
  ) {}


  public async getVersion(): Promise<number> {

    try {

      const content =
        await this.readFile(
          this.versionPath,
        );


      const match =
        content.match(
          /version:\s*(\d+)/,
        );


      if (!match) {
        return 0;
      }


      return Number(match[1]);

    } catch {

      return 0;

    }

  }


  public async setVersion(
    version: number,
  ): Promise<void> {

    await this.writeFile(
      this.versionPath,

      `---
version: ${String(version)}
---
`,
    );

  }

}
