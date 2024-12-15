import { createVertex } from '@ai-sdk/google-vertex';
import { generateObject } from 'ai';
import { z } from 'zod';


const vertexAI = createVertex({
  project : process.env.GOOGLE_PROJECT_ID,
  location: process.env.GOOGLE_LOCATION, 
})


const model = vertexAI("gemini-1.5-flash-002",{
  structuredOutputs: false
})

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





