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


export async  function createThumbnail(topic: string) {
  const result = await generateObject({
    model : model , 
    schema : z.object({
      image_search_term: z.string()
    }),
    system : "You are capable of generating the most relevant search keyword for a course thumbnail. Provide a search term that will be used to find a relevant image on unsplash.",
  
    prompt : `Create a thumbnail for : ${topic}`
  })


  return result.object
}





