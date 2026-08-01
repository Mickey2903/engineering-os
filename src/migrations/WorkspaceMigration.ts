export interface WorkspaceMigration {

  readonly fromVersion: number;

  readonly toVersion: number;


  execute(): Promise<void>;

}
