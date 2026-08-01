import { describe, expect, it } from "vitest";

import { Migration001InitialWorkspace } from "../../src/migrations/Migration001InitialWorkspace";


describe("Migration001InitialWorkspace", () => {

  it("creates required workspace folders", async () => {

    const folders: string[] = [];


    const migration =
      new Migration001InitialWorkspace(
        async (
          path: string,
        ): Promise<void> => {
          folders.push(path);
        },
      );


    await migration.execute();


    expect(
      folders,
    )
      .toContain(
        "Engineering/Reports",
      );


    expect(
      folders,
    )
      .toContain(
        "Engineering/Interfaces",
      );


    expect(
      folders,
    )
      .toHaveLength(2);
  });


  it("has correct version transition", () => {

    const migration =
      new Migration001InitialWorkspace(
        async () => {},
      );


    expect(
      migration.fromVersion,
    )
      .toBe(0);


    expect(
      migration.toVersion,
    )
      .toBe(1);
  });

});
