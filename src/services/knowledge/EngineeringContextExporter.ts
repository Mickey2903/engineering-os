import type { EngineeringContext } from "../../models/EngineeringContext";
import type { EngineeringContextExport } from "../../models/EngineeringContextExport";


export class EngineeringContextExporter {

  public export(
    context: EngineeringContext,
  ): EngineeringContextExport {

    const objects = [
      ...(context.root
        ? [context.root]
        : []),

      ...context.related,
    ];


    return {
  generatedAt:
    Date.now(),

  ...(context.root
    ? {
        rootId: context.root.id,
        rootType: context.root.type,
      }
    : {}),

  objects:
    objects.map(
  (object) => ({
    id:
      object.id,

    type:
      object.type,

    title:
      object.title,

    status:
      object.status,

    sourcePath:
      object.sourcePath,

    tags:
      object.tags,

    metadata:
      object.metadata,
  }),
),
};

  }

}
