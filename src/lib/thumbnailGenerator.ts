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

export async  function createThumbnail(topic: string) {
  const result = await generateObject({
    model : gemini, 
    schema : z.object({
      image_search_term: z.string()
    }),
    system : "You are capable of generating the most relevant search keyword for a course thumbnail. Provide a search term that will be used to find a relevant image on unsplash.",
  
    prompt : `Create a thumbnail for : ${topic}`
  })


  return result.object
}





