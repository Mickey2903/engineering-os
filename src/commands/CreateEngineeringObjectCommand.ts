import type { TemplateService } from "../services/TemplateService";
import type { EngineeringIdService } from "../services/EngineeringIdService";
import type { EngineeringObjectType } from "../models/EngineeringObject";


interface FileWriter {

  write(
    path: string,
    content: string,
  ): Promise<void>;

}


export class CreateEngineeringObjectCommand {


  public constructor(
    private readonly templates:
      TemplateService,

    private readonly ids:
      EngineeringIdService,

    private readonly writer:
      FileWriter,
  ) {}



  public async execute(
    templateName: string,
    type: EngineeringObjectType,
    folder: string,
  ): Promise<string> {


    const template =
      this.templates.find(
        templateName,
      );


    if (!template) {

      throw new Error(
        `Unknown engineering template: ${templateName}`,
      );

    }


    const id =
      this.ids.generate(
        type,
      );


    const content =
      template.content.replace(
        /XXX/g,
        id.replace(
          /^[A-Z]+-/,
          "",
        ),
      );


    const path =
      `${folder}/${id}.md`;


    await this.writer.write(
      path,
      content,
    );


    return id;

  }

}
