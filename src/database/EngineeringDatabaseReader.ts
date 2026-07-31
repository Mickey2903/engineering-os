import type { EngineeringEntity } from "../models/EngineeringEntity";
import type { EngineeringObjectType } from "../models/EngineeringObject";

export interface EngineeringDatabaseReader {
  findByType(
    type: EngineeringObjectType,
  ): readonly EngineeringEntity[];

  findById(
    id: string,
  ): EngineeringEntity | undefined;

  all(): readonly EngineeringEntity[];
  findByProject(
    projectId: string,
  ): readonly EngineeringEntity[];
}
