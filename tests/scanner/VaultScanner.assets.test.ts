import { describe, expect, it } from "vitest";
import { EngineeringAssetScanner } from "../../src/services/EngineeringAssetScanner";

describe("EngineeringAssetScanner asset discovery", () => {

  it("detects CAD assets", () => {
    const scanner =
      new EngineeringAssetScanner();

    const file =
      scanner.scanFile(
        "Projects/PLC100/Hardware/CPU_Board.kicad_sch",
      );

    expect(file.type)
      .toBe("file");

    expect(file.fileType)
      .toBe("cad");

    expect(file.extension)
      .toBe("kicad_sch");

    expect(file.metadata.projectId)
      .toBe("PLC100");
  });


  it("detects document assets", () => {
    const scanner =
      new EngineeringAssetScanner();

    const file =
      scanner.scanFile(
        "Projects/PLC100/Documentation/UserManual.pdf",
      );

    expect(file.fileType)
      .toBe("document");
  });


  it("detects software assets", () => {
    const scanner =
      new EngineeringAssetScanner();

    const file =
      scanner.scanFile(
        "Projects/PLC100/Software/main.cpp",
      );

    expect(file.fileType)
      .toBe("software");
  });

});

