
import type { EngineeringDatabaseReader } from "../../src/database/EngineeringDatabaseReader";

export function mockDatabase(
  entities: readonly unknown[] = [],
): EngineeringDatabaseReader {
  return {
    findById: () => undefined,

    findByType: (type) =>
      entities.filter(
        (entity) =>
          (entity as { type?: string }).type === type,
      ) as never[],

    all: () =>
      entities as never[],

    findByProject: () =>
      entities as never[],
  };
}
