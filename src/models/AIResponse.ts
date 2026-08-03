export interface AIResponse {

  content: string;

  model?: string;


  context?: {

    objects: {

      id: string;

      title: string;

      type: string;

      confidence: 
        "high" | "medium" | "low";

    }[];

    confidence:
      "high" | "medium" | "low" | "none";

  };

}
