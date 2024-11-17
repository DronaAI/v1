import { CourseGenerationprompt } from "../prompts/CourseGeneration.prompt";
import { ChatVertexAI } from "@langchain/google-vertexai"
import { JsonOutputParser } from "@langchain/core/output_parsers";
import {outputUnits} from "@/types";


const chatVertexAI = new ChatVertexAI({
  model: "gemini-1.5-pro", 
  temperature: 0.7,
});

export async function generate_course(
  courseName: string, units: number
) {
  const courseCreationparser = new JsonOutputParser<outputUnits>();
        const chain = CourseGenerationprompt.pipe(chatVertexAI).pipe(courseCreationparser);

        const course = await chain.invoke({ topic: courseName, units: units });

        return course;
}
