import { describe, expect, it } from "vitest";
import { EngineeringAssetScanner } from "../../src/services/EngineeringAssetScanner";

describe("EngineeringAssetScanner", () => {

  it("classifies CAD files", () => {
    const scanner =
      new EngineeringAssetScanner();

    const file =
      scanner.scanFile(
        "Hardware/CPU_Board.kicad_sch",
      );

    expect(file.type)
      .toBe("file");

    expect(file.fileType)
      .toBe("cad");

    expect(file.extension)
      .toBe("kicad_sch");
  });


  it("classifies document files", () => {
    const scanner =
      new EngineeringAssetScanner();

    const file =
      scanner.scanFile(
        "Documentation/UserManual.pdf",
      );

    expect(file.fileType)
      .toBe("document");
  });


  it("classifies software files", () => {
    const scanner =
      new EngineeringAssetScanner();

    const file =
      scanner.scanFile(
        "Software/main.cpp",
      );

    expect(file.fileType)
      .toBe("software");
  });

});
