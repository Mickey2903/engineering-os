export interface WorkspaceStatusReport {

  readonly workspaceVersion: number;

  readonly indexedObjects: number;

  readonly requirements: number;

  readonly components: number;

  readonly risks: number;

  readonly verificationCoverage: number;

}

