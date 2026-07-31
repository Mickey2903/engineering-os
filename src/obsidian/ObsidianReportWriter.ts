interface VaultFileLike {
  path: string;
}

interface VaultLike {
  getAbstractFileByPath(path: string): VaultFileLike | null;
  createFolder(path: string): Promise<unknown>;
  create(path: string, content: string): Promise<unknown>;
  modify(file: VaultFileLike, content: string): Promise<unknown>;
}

export class ObsidianReportWriter {
  constructor(private readonly vault: VaultLike) {}

  async write(path: string, content: string): Promise<void> {
    const parts = path.split("/");
    const fileName = parts.pop();

    if (!fileName) {
      throw new Error("Report path must contain a file name");
    }

    let currentFolder = "";

    for (const folder of parts) {
      currentFolder = currentFolder ? `${currentFolder}/${folder}` : folder;

      if (!this.vault.getAbstractFileByPath(currentFolder)) {
        await this.vault.createFolder(currentFolder);
      }
    }

    const existingFile = this.vault.getAbstractFileByPath(path);

    if (existingFile) {
      await this.vault.modify(existingFile, content);
      return;
    }

    await this.vault.create(path, content);
  }
}
