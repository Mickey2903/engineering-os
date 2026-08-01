export interface WorkspaceInitializationReport {
  readonly createdFolders: readonly string[];

  readonly createdTemplates: readonly string[];

  readonly skippedTemplates: readonly string[];
}
