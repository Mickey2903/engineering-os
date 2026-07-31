#!/usr/bin/env bash
set -euo pipefail

[[ -f package.json && -d src ]] || { echo 'Voer dit uit in de plugin-root.'; exit 1; }
mkdir -p src/models tests/parser

cat > src/models/EngineeringObject.ts <<'EOF'
export type EngineeringObjectType =
  | "requirement" | "component" | "verification" | "adr" | "risk"
  | "architecture" | "interface" | "test-case" | "manufacturing-item"
  | "document" | "unknown";

export type EngineeringStatus =
  | "draft" | "proposed" | "approved" | "active" | "verified"
  | "rejected" | "deprecated" | "obsolete" | "closed" | "unknown";

export interface EngineeringObject {
  readonly id: string;
  readonly type: EngineeringObjectType;
  readonly title: string;
  readonly status: EngineeringStatus;
  readonly tags: readonly string[];
  readonly sourcePath: string;
  readonly links: readonly string[];
  readonly createdTime?: number;
  readonly modifiedTime: number;
  readonly metadata: Readonly<Record<string, unknown>>;
}
EOF

cat > src/models/Requirement.ts <<'EOF'
import type { EngineeringObject } from "./EngineeringObject";
export type RequirementPriority = "critical" | "high" | "medium" | "low" | "unknown";
export type RequirementDomain =
  | "system" | "power" | "io" | "communication" | "control" | "firmware"
  | "software" | "mechanical" | "safety" | "security" | "manufacturing"
  | "verification" | "unknown";
export type VerificationMethod = "analysis" | "inspection" | "demonstration" | "test" | "review" | "unknown";
export interface Requirement extends EngineeringObject {
  readonly type: "requirement";
  readonly domain: RequirementDomain;
  readonly priority: RequirementPriority;
  readonly description?: string;
  readonly rationale?: string;
  readonly acceptanceCriteria: readonly string[];
  readonly verificationMethod?: VerificationMethod;
  readonly parentId?: string;
}
EOF

cat > src/models/Component.ts <<'EOF'
import type { EngineeringObject } from "./EngineeringObject";
export type ComponentLifecycle = "concept" | "prototype" | "active" | "not-recommended" | "end-of-life" | "obsolete" | "unknown";
export interface Component extends EngineeringObject {
  readonly type: "component";
  readonly manufacturer?: string;
  readonly partNumber?: string;
  readonly datasheet?: string;
  readonly lifecycle: ComponentLifecycle;
}
EOF

cat > src/models/Verification.ts <<'EOF'
import type { EngineeringObject } from "./EngineeringObject";
import type { VerificationMethod } from "./Requirement";
export type VerificationResult = "not-run" | "passed" | "failed" | "blocked" | "not-applicable" | "unknown";
export interface Verification extends EngineeringObject {
  readonly type: "verification";
  readonly method: VerificationMethod;
  readonly requirementIds: readonly string[];
  readonly result: VerificationResult;
}
EOF

cat > src/models/Adr.ts <<'EOF'
import type { EngineeringObject } from "./EngineeringObject";
export type AdrStatus = "proposed" | "accepted" | "rejected" | "superseded" | "deprecated" | "unknown";
export interface Adr extends EngineeringObject {
  readonly type: "adr";
  readonly decisionStatus: AdrStatus;
  readonly context?: string;
  readonly decision?: string;
  readonly consequences: readonly string[];
  readonly supersedesId?: string;
}
EOF

cat > src/models/Risk.ts <<'EOF'
import type { EngineeringObject } from "./EngineeringObject";
export type RiskLevel = "critical" | "high" | "medium" | "low" | "unknown";
export type RiskState = "open" | "mitigating" | "accepted" | "closed" | "unknown";
export interface Risk extends EngineeringObject {
  readonly type: "risk";
  readonly probability?: number;
  readonly impact?: number;
  readonly level: RiskLevel;
  readonly riskState: RiskState;
  readonly mitigation?: string;
  readonly owner?: string;
}
EOF

cat > src/models/EngineeringEntity.ts <<'EOF'
import type { Adr } from "./Adr";
import type { Component } from "./Component";
import type { EngineeringObject } from "./EngineeringObject";
import type { Requirement } from "./Requirement";
import type { Risk } from "./Risk";
import type { Verification } from "./Verification";
export type EngineeringEntity = Requirement | Component | Verification | Adr | Risk | EngineeringObject;
export const isRequirement = (entity: EngineeringEntity): entity is Requirement => entity.type === "requirement";
export const isComponent = (entity: EngineeringEntity): entity is Component => entity.type === "component";
export const isVerification = (entity: EngineeringEntity): entity is Verification => entity.type === "verification";
export const isAdr = (entity: EngineeringEntity): entity is Adr => entity.type === "adr";
export const isRisk = (entity: EngineeringEntity): entity is Risk => entity.type === "risk";
EOF

cat > src/parser/MetadataParser.ts <<'EOF'
import type { CachedMetadata, TFile } from "obsidian";
import type { Adr, AdrStatus } from "../models/Adr";
import type { Component, ComponentLifecycle } from "../models/Component";
import type { EngineeringEntity } from "../models/EngineeringEntity";
import type { EngineeringObject, EngineeringObjectType, EngineeringStatus } from "../models/EngineeringObject";
import type { Requirement, RequirementDomain, RequirementPriority, VerificationMethod } from "../models/Requirement";
import type { Risk, RiskLevel, RiskState } from "../models/Risk";
import type { Verification, VerificationResult } from "../models/Verification";

const values = <T extends string>(...items: T[]): ReadonlySet<T> => new Set(items);
const types = values<EngineeringObjectType>("requirement", "component", "verification", "adr", "risk", "architecture", "interface", "test-case", "manufacturing-item", "document");
const statuses = values<EngineeringStatus>("draft", "proposed", "approved", "active", "verified", "rejected", "deprecated", "obsolete", "closed", "unknown");
const priorities = values<RequirementPriority>("critical", "high", "medium", "low", "unknown");
const domains = values<RequirementDomain>("system", "power", "io", "communication", "control", "firmware", "software", "mechanical", "safety", "security", "manufacturing", "verification", "unknown");
const methods = values<VerificationMethod>("analysis", "inspection", "demonstration", "test", "review", "unknown");
const lifecycles = values<ComponentLifecycle>("concept", "prototype", "active", "not-recommended", "end-of-life", "obsolete", "unknown");
const results = values<VerificationResult>("not-run", "passed", "failed", "blocked", "not-applicable", "unknown");
const adrStatuses = values<AdrStatus>("proposed", "accepted", "rejected", "superseded", "deprecated", "unknown");
const riskLevels = values<RiskLevel>("critical", "high", "medium", "low", "unknown");
const riskStates = values<RiskState>("open", "mitigating", "accepted", "closed", "unknown");

const text = (value: unknown): string | undefined => typeof value === "string" && value.trim() ? value.trim() : undefined;
const numberValue = (value: unknown): number | undefined => typeof value === "number" && Number.isFinite(value) ? value : undefined;
const list = (value: unknown): readonly string[] => Array.isArray(value)
  ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean)
  : text(value) ? [text(value) as string] : [];
const normalized = <T extends string>(value: unknown, allowed: ReadonlySet<T>, fallback: T): T => {
  const candidate = text(value)?.toLowerCase() as T | undefined;
  return candidate && allowed.has(candidate) ? candidate : fallback;
};

export class MetadataParser {
  public parse(file: TFile, cache: CachedMetadata | null): EngineeringEntity {
    const fm = (cache?.frontmatter ?? {}) as Record<string, unknown>;
    const base: EngineeringObject = {
      id: text(fm.id) ?? file.basename,
      title: text(fm.title) ?? file.basename,
      type: normalized(fm.type, types, "unknown"),
      status: normalized(fm.status, statuses, "unknown"),
      tags: list(fm.tags),
      sourcePath: file.path,
      links: (cache?.links ?? []).map((link) => link.link),
      createdTime: file.stat.ctime,
      modifiedTime: file.stat.mtime,
      metadata: { ...fm },
    };

    switch (base.type) {
      case "requirement": return this.requirement(base, fm);
      case "component": return this.component(base, fm);
      case "verification": return this.verification(base, fm);
      case "adr": return this.adr(base, fm);
      case "risk": return this.risk(base, fm);
      default: return base;
    }
  }

  private requirement(base: EngineeringObject, fm: Record<string, unknown>): Requirement {
    const description = text(fm.description);
    const rationale = text(fm.rationale);
    const verificationMethod = text(fm.verificationMethod);
    const parentId = text(fm.parent);
    return {
      ...base, type: "requirement",
      domain: normalized(fm.domain, domains, "unknown"),
      priority: normalized(fm.priority, priorities, "unknown"),
      ...(description ? { description } : {}),
      ...(rationale ? { rationale } : {}),
      acceptanceCriteria: list(fm.acceptanceCriteria ?? fm.acceptance),
      ...(verificationMethod ? { verificationMethod: normalized(verificationMethod, methods, "unknown") } : {}),
      ...(parentId ? { parentId } : {}),
    };
  }

  private component(base: EngineeringObject, fm: Record<string, unknown>): Component {
    const manufacturer = text(fm.manufacturer); const partNumber = text(fm.partNumber); const datasheet = text(fm.datasheet);
    return { ...base, type: "component", ...(manufacturer ? { manufacturer } : {}), ...(partNumber ? { partNumber } : {}), ...(datasheet ? { datasheet } : {}), lifecycle: normalized(fm.lifecycle, lifecycles, "unknown") };
  }

  private verification(base: EngineeringObject, fm: Record<string, unknown>): Verification {
    return { ...base, type: "verification", method: normalized(fm.method, methods, "unknown"), requirementIds: list(fm.requirementIds ?? fm.requirements), result: normalized(fm.result, results, "unknown") };
  }

  private adr(base: EngineeringObject, fm: Record<string, unknown>): Adr {
    const context = text(fm.context); const decision = text(fm.decision); const supersedesId = text(fm.supersedes);
    return { ...base, type: "adr", decisionStatus: normalized(fm.decisionStatus ?? fm.status, adrStatuses, "unknown"), ...(context ? { context } : {}), ...(decision ? { decision } : {}), consequences: list(fm.consequences), ...(supersedesId ? { supersedesId } : {}) };
  }

  private risk(base: EngineeringObject, fm: Record<string, unknown>): Risk {
    const probability = numberValue(fm.probability); const impact = numberValue(fm.impact); const mitigation = text(fm.mitigation); const owner = text(fm.owner);
    return { ...base, type: "risk", ...(probability !== undefined ? { probability } : {}), ...(impact !== undefined ? { impact } : {}), level: normalized(fm.level, riskLevels, "unknown"), riskState: normalized(fm.riskState ?? fm.state, riskStates, "unknown"), ...(mitigation ? { mitigation } : {}), ...(owner ? { owner } : {}) };
  }
}
EOF

cat > src/database/EngineeringDatabase.ts <<'EOF'
import type { EngineeringEntity } from "../models/EngineeringEntity";
import type { EngineeringObjectType } from "../models/EngineeringObject";
export class EngineeringDatabase {
  private readonly entitiesById = new Map<string, EngineeringEntity>();
  private readonly idByPath = new Map<string, string>();
  public upsert(entity: EngineeringEntity): void {
    const oldId = this.idByPath.get(entity.sourcePath);
    if (oldId && oldId !== entity.id) this.entitiesById.delete(oldId);
    const duplicate = this.entitiesById.get(entity.id);
    if (duplicate && duplicate.sourcePath !== entity.sourcePath) throw new Error(`Duplicate engineering ID "${entity.id}" in "${duplicate.sourcePath}" and "${entity.sourcePath}".`);
    this.entitiesById.set(entity.id, entity);
    this.idByPath.set(entity.sourcePath, entity.id);
  }
  public removeByPath(path: string): boolean { const id = this.idByPath.get(path); if (!id) return false; this.idByPath.delete(path); return this.entitiesById.delete(id); }
  public findById(id: string): EngineeringEntity | undefined { return this.entitiesById.get(id); }
  public findByType(type: EngineeringObjectType): readonly EngineeringEntity[] { return this.all().filter((entity) => entity.type === type); }
  public all(): readonly EngineeringEntity[] { return [...this.entitiesById.values()]; }
  public count(): number { return this.entitiesById.size; }
  public clear(): void { this.entitiesById.clear(); this.idByPath.clear(); }
}
EOF

cat > tests/parser/MetadataParser.test.ts <<'EOF'
import { describe, expect, it } from "vitest";
import type { CachedMetadata, TFile } from "obsidian";
import { isRequirement } from "../../src/models/EngineeringEntity";
import { MetadataParser } from "../../src/parser/MetadataParser";
const file = { path: "Requirements/SYS-PWR-001.md", basename: "SYS-PWR-001", extension: "md", stat: { ctime: 1, mtime: 2, size: 3 } } as TFile;
describe("MetadataParser", () => {
  it("parses a typed requirement", () => {
    const cache = { frontmatter: { id: "SYS-PWR-001", title: "Input voltage", type: "requirement", status: "approved", domain: "power", priority: "critical", tags: ["power"], acceptance: ["18 V through 28.8 V"], verificationMethod: "test", parent: "SYS-001" }, links: [{ link: "VER-PWR-001", original: "", displayText: "" }] } as CachedMetadata;
    const entity = new MetadataParser().parse(file, cache);
    expect(isRequirement(entity)).toBe(true);
    if (!isRequirement(entity)) throw new Error("Expected requirement");
    expect(entity.domain).toBe("power");
    expect(entity.priority).toBe("critical");
    expect(entity.acceptanceCriteria).toEqual(["18 V through 28.8 V"]);
    expect(entity.parentId).toBe("SYS-001");
  });
  it("uses safe unknown fallbacks", () => {
    const entity = new MetadataParser().parse(file, { frontmatter: { type: "requirement", domain: "warp", priority: "instant" } } as CachedMetadata);
    if (!isRequirement(entity)) throw new Error("Expected requirement");
    expect(entity.domain).toBe("unknown"); expect(entity.priority).toBe("unknown"); expect(entity.status).toBe("unknown");
  });
});
EOF

# Verwijder het oude model als het nog bestaat en niet meer wordt geïmporteerd.
rm -f src/models/EngineeringDocument.ts

npm run format
npm run check

echo 'Issue #6 gereed.'
echo 'Commit: git add . && git commit -m "feat: add engineering domain model" && git push'
