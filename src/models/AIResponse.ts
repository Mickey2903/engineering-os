export interface AIResponse {

  content: string;

  model?: string;


  context?: {

    objects: {

  id: string;

  title: string;

  type: string;

  sourcePath: string;

  confidence:
    "high" | "medium" | "low";

}[];
    confidence:
      "high" | "medium" | "low" | "none";

  };

}
