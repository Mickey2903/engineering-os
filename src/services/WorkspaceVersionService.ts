export class WorkspaceVersionService {

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
    return 0;
  }


public async setVersion(
  version: number,
): Promise<void> {

  console.log(
    "[PLC Version] Writing version:",
    version,
  );

  await this.writeFile(
    "Engineering/.workspace-version.md",
    `---
version: ${String(version)}
---
`,
  );

}

}
