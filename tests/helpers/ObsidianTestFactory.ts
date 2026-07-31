import type { CachedMetadata, LinkCache, Pos, TFile } from "obsidian";

export function createPosition(length = 0): Pos {
  return {
    start: {
      line: 0,
      col: 0,
      offset: 0,
    },
    end: {
      line: 0,
      col: length,
      offset: length,
    },
  };
}

export function createLink(link: string): LinkCache {
  return {
    link,
    original: `[[${link}]]`,
    displayText: link,
    position: createPosition(link.length),
  };
}

export function createFile(path: string): TFile {
  const filename = path.split("/").at(-1) ?? path;
  const basename = filename.replace(/\.md$/, "");

  return {
    path,
    name: filename,
    basename,
    extension: "md",
    parent: null,
    vault: {} as TFile["vault"],
    stat: {
      ctime: 100,
      mtime: 200,
      size: 300,
    },
  };
}

export function createMetadata(
  frontmatter: Record<string, unknown> = {},
  links: readonly LinkCache[] = [],
): CachedMetadata {
  return {
    frontmatter,
    links: [...links],
  };
}
