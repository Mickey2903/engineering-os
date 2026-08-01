
import type { EngineeringFile } from "../models/EngineeringFile";


export class EngineeringAssetScanner {

  public scanFile(
    path: string,
  ): EngineeringFile {

    const extension =
      this.getExtension(path);


    return {
  id: this.generateId(path),

  type: "file",

  title:
    this.getFileName(path),

  status: "active",

  sourcePath: path,

  path,

  extension,

  fileType:
    this.classifyExtension(extension),

  tags:
    this.generateTags(path, extension),

  links: [],

  modifiedTime: Date.now(),

  metadata: {},
};
  }


  private getExtension(
    path: string,
  ): string {

    const parts =
      path.split(".");

    return parts.length > 1
      ? parts.pop()!.toLowerCase()
      : "";
  }


  private getFileName(
    path: string,
  ): string {

    return path
      .split("/")
      .pop() ?? path;
  }


  private classifyExtension(
    extension: string,
  ): EngineeringFile["fileType"] {

    switch (extension) {

      case "step":
      case "stp":
      case "kicad_sch":
      case "kicad_pcb":
      case "kicad_pro":
        return "cad";


      case "pdf":
      case "doc":
      case "docx":
      case "md":
        return "document";


      case "c":
      case "cpp":
      case "h":
      case "hpp":
      case "py":
      case "ts":
      case "js":
        return "software";


      default:
        return "unknown";
    }
  }


  private generateTags(
    path: string,
    extension: string,
  ): readonly string[] {

    const tags = [];

    if (
      extension.startsWith("kicad")
      || extension === "step"
      || extension === "stp"
    ) {
      tags.push("hardware");
      tags.push("cad");
    }

    if (
      extension === "cpp"
      || extension === "c"
      || extension === "py"
      || extension === "ts"
    ) {
      tags.push("software");
    }

    return tags;
  }


  private generateId(
    path: string,
  ): string {

    const hash =
      Math.abs(
        this.simpleHash(path),
      );

    return `FILE-${hash}`;
  }


  private simpleHash(
    input: string,
  ): number {

    let hash = 0;

    for (let i = 0; i < input.length; i++) {
      hash =
        ((hash << 5) - hash)
        + input.charCodeAt(i);

      hash |= 0;
    }

    return hash;
  }
}
