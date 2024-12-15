import { createVertex } from '@ai-sdk/google-vertex';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';



const vertexAI = createOpenAI({
    // custom settings, e.g.
    apiKey  : process.env.OPENAI_API_KEY,
    compatibility: 'strict', // strict mode, enable when using the OpenAI API
  });


//   const vertexAI = createVertex({
//     project : process.env.GOOGLE_PROJECT_ID,
//     location: process.env.GOOGLE_LOCATION, 
//   })


  const model = vertexAI("gpt-4o")



export async function createCourse(topic: string, units: number) {
    const result = await generateObject({
        model: model,
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





