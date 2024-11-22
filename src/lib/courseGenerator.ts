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



export async function createCourse(topic: string) {
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
    
        system: `You are an expert course creator. Create a detailed course structure for the given topic , Each unit should be divided into multiple chapters 
        and each chapter should have a youtube search query such that for the chapter most relevant content can be found on youtube ensure the quality of content 
        to be high such that user can learn most about the topic you can adjust the number of units in a course as per the requirement just try to keep them under 7 
        units`,

        prompt: `Create a course structure for: ${topic}.`
    })


    

    result.object.outputUnits.map( (unit ) => { 
        console.log(unit.title)
        unit.chapters.map( (chapter) => { 
            console.log(chapter.youtube_search_query)
        } )
    }
     )

    return result.object
}





