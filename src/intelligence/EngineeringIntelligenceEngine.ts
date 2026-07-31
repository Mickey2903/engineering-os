import type { EngineeringDatabaseReader } from "../database/EngineeringDatabaseReader";
import type { EngineeringInsight } from "./EngineeringInsight";
import type { EngineeringRule } from "./EngineeringRule";

export class EngineeringIntelligenceEngine {
  public constructor(
    private readonly rules: readonly EngineeringRule[],
  ) {}

  public analyze(
    database: EngineeringDatabaseReader,
  ): readonly EngineeringInsight[] {
    return this.rules.flatMap(
      (rule) => rule.evaluate(database),
    );
  }
}
