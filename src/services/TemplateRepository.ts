export interface TemplateRepository {
  getTemplate(name: string): Promise<string>;
}
