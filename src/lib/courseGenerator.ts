import { createVertex } from '@ai-sdk/google-vertex';
import { generateObject } from 'ai';
import { z } from 'zod';




import { createGoogleGenerativeAI } from '@ai-sdk/google'

const google = createGoogleGenerativeAI({
  apiKey : process.env.GOOGLE_API_KEY,
})
const gemini= google('gemini-1.5-pro-latest' , {
  structuredOutputs: false
});


  


export async function createCourse(topic: string, units: number) {
    const result = await generateObject({
        model: gemini,
        schema: z.object({
            outputUnits  : (z.array(z.object({
                title: z.string(),
                chapters: z.array(z.object({
                    youtube_search_query: z.string(),
                    chapter_title: z.string()
                }))
            }))),
        }),
    
        system: `You are an expert course creator. Create a detailed course structure for the given topic.
        The course should be comprehensive and well-structured, with clear units  .
        Each unit should be divided into multiple chapter and each chapter should have an appropriate youtube search query such that the exact chapter can be found `,

        prompt: `Create a course structure for: ${topic} with ${units} units.`
    })


    return result.object
}





