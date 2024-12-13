import { createVertex } from '@ai-sdk/google-vertex';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';



const openai = createOpenAI({
    // custom settings, e.g.
    apiKey  : process.env.OPENAI_API_KEY,
    compatibility: 'strict', // strict mode, enable when using the OpenAI API
  });


  const model = openai('gpt-4o');



export async function chapterImprovementAgent(quiz_results: any , chapters:any) {
    const result = await generateObject({
        model: model,
        schema: z.object({
            chapters : (z.array(z.object({
                title: z.string(),
                youtube_search_query: z.string()
            })))
        }),
    
        system: `You are an expert course manager and creator , you have an experience of over 25 years in the field of course management and 
        crafting better curricullum for learners , you task is to take the quiz results as an input and on the basis of the wrong answers and the overall unit of a course and the existing chapters , create better chapters for the course
        To enhance the learning experience of the students and to make the course more comprehensive and well-structured.`,

        prompt: `Provided are the quiz results ${JSON.stringify(quiz_results)} and the existing ${JSON.stringify(chapters)} , create better chapters for the course.`
    })


    return result.object.chapters
}





