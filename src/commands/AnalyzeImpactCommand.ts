import type { ImpactAnalysisService } from "../services/ImpactAnalysisService";
import type { ImpactReportRenderer } from "../rendering/ImpactReportRenderer";


interface ReportWriter {

  write(
    path: string,
    content: string,
  ): Promise<void>;

}


export class AnalyzeImpactCommand {


  public constructor(
    private readonly impactService:
      ImpactAnalysisService,

    private readonly renderer:
      ImpactReportRenderer,

    private readonly writer:
      ReportWriter,
  ) {}



  public async execute(
    entityId: string,
  ): Promise<void> {


    const analysis =
      this.impactService.analyze(
        entityId,
      );


    if (!analysis) {

      throw new Error(
        `No engineering entity found with id ${entityId}`,
      );

    }


    const markdown =
      this.renderer.render(
        analysis,
      );


    await this.writer.write(
      `Engineering/Reports/Impact Analysis ${entityId}.md`,
      markdown,
    );

  }

}
