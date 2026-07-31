import type { EngineeringDatabaseReader } from "../database/EngineeringDatabaseReader";
import type { EngineeringInsight } from "./EngineeringInsight";

export interface EngineeringRule {
  readonly id: string;
  readonly name: string;

  evaluate(
    database: EngineeringDatabaseReader,
  ): readonly EngineeringInsight[];
}
