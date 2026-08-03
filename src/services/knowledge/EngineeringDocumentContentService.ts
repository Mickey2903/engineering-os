import {
  TFile,
  Vault,
} from "obsidian";


export class EngineeringDocumentContentService {

  public constructor(
    private readonly vault: Vault,
  ) {}


  public async readContent(
    sourcePath: string,
  ): Promise<string> {

    const file =
      this.vault.getAbstractFileByPath(
        sourcePath,
      );


    if (!file) {

      return "";

    }


    if (file instanceof TFile) {

  return this.vault.read(
    file,
  );

}


    return "";

  }

}
