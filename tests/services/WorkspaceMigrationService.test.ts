import { describe, expect, it } from "vitest";

import { WorkspaceMigrationService } from "../../src/services/WorkspaceMigrationService";
import type { WorkspaceMigration } from "../../src/migrations/WorkspaceMigration";


describe("WorkspaceMigrationService", () => {

  it("executes a migration from current to target version", async () => {

    const executed: number[] = [];


    const migration: WorkspaceMigration = {

      fromVersion: 0,

      toVersion: 1,

      execute: async (): Promise<void> => {
        executed.push(1);
      },

    };


    const service =
      new WorkspaceMigrationService(
        [
          migration,
        ],
      );


    const version =
      await service.migrate(
        0,
        1,
      );


    expect(version)
      .toBe(1);


    expect(executed)
      .toEqual([1]);
  });



  it("executes multiple migrations in sequence", async () => {

    const executed: number[] = [];


    const migrations: WorkspaceMigration[] = [

      {
        fromVersion: 0,
        toVersion: 1,

        execute: async () => {
          executed.push(1);
        },
      },


      {
        fromVersion: 1,
        toVersion: 2,

        execute: async () => {
          executed.push(2);
        },
      },

    ];


    const service =
      new WorkspaceMigrationService(
        migrations,
      );


    const version =
      await service.migrate(
        0,
        2,
      );


    expect(version)
      .toBe(2);


    expect(executed)
      .toEqual([
        1,
        2,
      ]);
  });



  it("throws when a migration is missing", async () => {

    const service =
      new WorkspaceMigrationService(
        [],
      );


    await expect(
      service.migrate(
        0,
        1,
      ),
    )
      .rejects
      .toThrow(
        "No migration found from version 0",
      );

  });

});
