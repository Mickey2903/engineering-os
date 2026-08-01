import type { ImpactAnalysisReport } from "../models/ImpactAnalysisReport";


interface ImpactAnalysisProvider {
  analyze(
    objectId: string,
  ): ImpactAnalysisReport;
}


interface ImpactAnalysisRendererLike {
  render(
    report: ImpactAnalysisReport,
  ): string;
}


interface ReportWriter {
  write(
    path: string,
    content: string,
  ): Promise<void>;
}


export class GenerateImpactAnalysisReportCommand {

  public constructor(
    private readonly analysis: ImpactAnalysisProvider,
    private readonly renderer: ImpactAnalysisRendererLike,
    private readonly writer: ReportWriter,
  ) {}


  public async execute(
    objectId: string,
  ): Promise<void> {

    const report =
      this.analysis.analyze(
        objectId,
      );


    const markdown =
      this.renderer.render(
        report,
      );


    await this.writer.write(
      "Engineering/Reports/Impact Analysis.md",
      markdown,
    );

  }

}
