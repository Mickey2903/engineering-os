"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => PlcEngineeringToolsPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/database/EngineeringDatabase.ts
var EngineeringDatabase = class {
  documentsById = /* @__PURE__ */ new Map();
  idByPath = /* @__PURE__ */ new Map();
  upsert(document) {
    const existingIdForPath = this.idByPath.get(document.sourcePath);
    if (existingIdForPath && existingIdForPath !== document.id) {
      this.documentsById.delete(existingIdForPath);
    }
    const existingDocument = this.documentsById.get(document.id);
    if (existingDocument && existingDocument.sourcePath !== document.sourcePath) {
      throw new Error(
        `Duplicate engineering ID "${document.id}" in "${existingDocument.sourcePath}" and "${document.sourcePath}".`
      );
    }
    this.documentsById.set(document.id, document);
    this.idByPath.set(document.sourcePath, document.id);
  }
  removeByPath(path) {
    const id = this.idByPath.get(path);
    if (!id) return false;
    this.idByPath.delete(path);
    return this.documentsById.delete(id);
  }
  findById(id) {
    return this.documentsById.get(id);
  }
  all() {
    return [...this.documentsById.values()];
  }
  count() {
    return this.documentsById.size;
  }
  clear() {
    this.documentsById.clear();
    this.idByPath.clear();
  }
};

// src/parser/MetadataParser.ts
var supportedTypes = /* @__PURE__ */ new Set([
  "requirement",
  "verification",
  "component",
  "adr",
  "risk",
  "architecture"
]);
function asString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
function parseType(value) {
  const type = asString(value)?.toLowerCase();
  return type && supportedTypes.has(type) ? type : "unknown";
}
var MetadataParser = class {
  parse(file, cache) {
    const frontmatter = cache?.frontmatter ?? {};
    const id = asString(frontmatter.id) ?? file.basename;
    const title = asString(frontmatter.title) ?? file.basename;
    const status = asString(frontmatter.status);
    const links = (cache?.links ?? []).map((link) => link.link);
    return {
      id,
      title,
      type: parseType(frontmatter.type),
      ...status ? { status } : {},
      sourcePath: file.path,
      links,
      metadata: { ...frontmatter },
      modifiedTime: file.stat.mtime
    };
  }
};

// src/scanner/VaultScanner.ts
var VaultScanner = class {
  constructor(vault, metadataCache, parser, database, logger) {
    this.vault = vault;
    this.metadataCache = metadataCache;
    this.parser = parser;
    this.database = database;
    this.logger = logger;
  }
  scanFile(file) {
    if (file.extension !== "md") return;
    const metadata = this.metadataCache.getFileCache(file);
    const document = this.parser.parse(file, metadata);
    this.database.upsert(document);
  }
  scanAll() {
    const files = this.vault.getMarkdownFiles();
    let indexed = 0;
    let errors = 0;
    this.database.clear();
    for (const file of files) {
      try {
        this.scanFile(file);
        indexed += 1;
      } catch (error) {
        errors += 1;
        this.logger.error(`Could not index ${file.path}`, error);
      }
    }
    return { scanned: files.length, indexed, errors };
  }
  remove(path) {
    this.database.removeByPath(path);
  }
};

// src/core/EngineeringCore.ts
var EngineeringCore = class {
  constructor(app, logger) {
    this.app = app;
    this.logger = logger;
    this.scanner = new VaultScanner(
      app.vault,
      app.metadataCache,
      new MetadataParser(),
      this.database,
      logger
    );
  }
  database = new EngineeringDatabase();
  scanner;
  initialize() {
    const result = this.scanner.scanAll();
    this.logger.info("Initial Vault scan complete.", result);
  }
  updateFile(file) {
    this.scanner.scanFile(file);
  }
  removeFile(path) {
    this.scanner.remove(path);
  }
  shutdown() {
    this.database.clear();
  }
};

// src/core/Logger.ts
var ConsoleLogger = class {
  constructor(scope) {
    this.scope = scope;
  }
  debug(message, context) {
    console.debug(`[${this.scope}] ${message}`, context ?? "");
  }
  info(message, context) {
    console.info(`[${this.scope}] ${message}`, context ?? "");
  }
  warn(message, context) {
    console.warn(`[${this.scope}] ${message}`, context ?? "");
  }
  error(message, context) {
    console.error(`[${this.scope}] ${message}`, context ?? "");
  }
};

// main.ts
var PlcEngineeringToolsPlugin = class extends import_obsidian.Plugin {
  core;
  onload() {
    const logger = new ConsoleLogger("PLC Engineering Tools");
    this.core = new EngineeringCore(this.app, logger);
    this.app.workspace.onLayoutReady(() => {
      this.core?.initialize();
    });
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        this.core?.updateFile(file);
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        if (file instanceof import_obsidian.TFile) {
          this.core?.removeFile(file.path);
        }
      })
    );
    this.addCommand({
      id: "show-engineering-index-status",
      name: "Show engineering index status",
      callback: () => {
        const count = this.core?.database.count() ?? 0;
        new import_obsidian.Notice(`Engineering index contains ${String(count)} Markdown documents.`);
      }
    });
    logger.info("Plugin loaded.");
  }
  onunload() {
    this.core?.shutdown();
    this.core = void 0;
  }
};
