import { CourseGenerationprompt } from "../prompts/CourseGeneration.prompt";
import { ChatVertexAI } from "@langchain/google-vertexai"
import { JsonOutputParser } from "@langchain/core/output_parsers";
import {outputUnits} from "@/types";
import { ThumbnailGenerationPrompt } from "@/prompts/ThumbnailGeneration.prompt";


const chatVertexAI = new ChatVertexAI({
  model: "gemini-1.5-pro", 
  temperature: 0.7,
});

export async function generate_thumbnail(
  courseName: string
) {
  
        const chain = ThumbnailGenerationPrompt.pipe(chatVertexAI).pipe(new JsonOutputParser<{image_search_term: string}>());

        const course = await chain.invoke({ topic: courseName });

        return course;
}
