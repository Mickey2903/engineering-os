import { describe, expect, it, vi } from "vitest";
import { ObsidianReportWriter } from "../../src/obsidian/ObsidianReportWriter";

describe("ObsidianReportWriter", () => {
  it("creates missing folders and writes the report", async () => {
    const getAbstractFileByPath = vi
      .fn()
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);

    const createFolder = vi.fn().mockResolvedValue(undefined);
    const create = vi.fn().mockResolvedValue(undefined);
    const modify = vi.fn().mockResolvedValue(undefined);

    const vault = {
      getAbstractFileByPath,
      createFolder,
      create,
      modify,
    };

    const writer = new ObsidianReportWriter(vault);

    await writer.write("Engineering/Reports/Health Report.md", "# Engineering Health Report");

    expect(createFolder).toHaveBeenCalledWith("Engineering");
    expect(createFolder).toHaveBeenCalledWith("Engineering/Reports");
    expect(create).toHaveBeenCalledWith(
      "Engineering/Reports/Health Report.md",
      "# Engineering Health Report",
    );
    expect(modify).not.toHaveBeenCalled();
  });
});

it("updates an existing report", async () => {
  const existingFile = {
    path: "Engineering/Reports/Health Report.md",
  };

  const getAbstractFileByPath = vi.fn((path: string) => {
    if (path === "Engineering") {
      return { path };
    }

    if (path === "Engineering/Reports") {
      return { path };
    }

    if (path === "Engineering/Reports/Health Report.md") {
      return existingFile;
    }

    return null;
  });

  const createFolder = vi.fn().mockResolvedValue(undefined);
  const create = vi.fn().mockResolvedValue(undefined);
  const modify = vi.fn().mockResolvedValue(undefined);

  const writer = new ObsidianReportWriter({
    getAbstractFileByPath,
    createFolder,
    create,
    modify,
  });

  await writer.write("Engineering/Reports/Health Report.md", "# Updated Engineering Health Report");

  expect(createFolder).not.toHaveBeenCalled();
  expect(create).not.toHaveBeenCalled();
  expect(modify).toHaveBeenCalledWith(existingFile, "# Updated Engineering Health Report");
});
