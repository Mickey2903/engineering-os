import type { AIService } from "./AIService";
import type { AIResponse } from "../../models/AIResponse";
import type { EngineeringContextService } from "../knowledge/EngineeringContextService";
import type { EngineeringContextExporter } from "../knowledge/EngineeringContextExporter";
import type { EngineeringRelatedContextService } from "../knowledge/EngineeringRelatedContextService";
import type { EngineeringContextResolver } from "./EngineeringContextResolver";
import type { EngineeringContextFormatter } from "./memory/EngineeringContextFormatter";
import type { EngineeringDocumentContentService } 
from "../knowledge/EngineeringDocumentContentService";
import type { RelationshipType } from "../../models/Relationship";
export class EngineeringAssistantService {

public constructor(
  private readonly aiService: AIService,
  private readonly contextService: EngineeringContextService,
  private readonly exporter: EngineeringContextExporter,
  private readonly relatedContextService: EngineeringRelatedContextService,
  private readonly contextResolver: EngineeringContextResolver,
  private readonly contextFormatter: EngineeringContextFormatter,
  private readonly contentService: EngineeringDocumentContentService,
) {}


  public async getAvailableModels(): Promise<string[]> {

  const models =
    await this.aiService.getAvailableModels();

  return models;

}

public async ask(
  question: string,
  objectId?: string,
  model?: string,
): Promise<AIResponse> {


  let engineeringContext =
    "No engineering object context available.";


  const resolved =
  this.contextResolver.resolve(
    question,
    objectId,
  );

const resolvedContext =
  resolved;


if (resolved.objects.length > 0) {


  const combinedContexts = [];


for (const object of resolved.objects) {

  const context =
    this.contextService.generateContext(
      object.objectId,
    );


  if (!context.root) {
    continue;
  }


  const related =
    this.relatedContextService.findRelated(
      object.objectId,
    );


  const documentContent =
    await this.contentService.readContent(
      context.root.sourcePath,
    );


  combinedContexts.push(
  {
    root:
      context.root,

    documentContent,

    related: [
  ...context.related.map(
    (item) => ({
      id:
        item.entity.id,

      type:
        item.entity.type,

      title:
        item.entity.title,

      status:
        item.entity.status,

      relationship:
  item.relationship.type as RelationshipType,
    }),
  ),

  ...related.map(
    (item) => ({
      id:
        item.id,

      type:
        item.type,

      title:
        item.title,

      status:
        item.status,

       relationship:
      "link" as RelationshipType,
    }),
  ),
],
  },
);

}


  engineeringContext =
  this.contextFormatter.format(
    combinedContexts,
  );
}





  const prompt =
    `
Engineering context:
${engineeringContext}

Question:
${question}
`;


  const response =
  await this.aiService.generate(
    {
      prompt,

      ...(model
        ? { model }
        : {}),
    },
  );


return {
  ...response,

  context: {

    objects:
      resolvedContext.objects.map(
        (object) => ({
          id:
            object.objectId,

          title:
            object.objectTitle,

          type:
            object.objectType,

          confidence:
            object.confidence,
            
           sourcePath:
  object.sourcePath, 
        }),
      ),

    confidence:
      resolvedContext.confidence,

  },

};
}
}

    
