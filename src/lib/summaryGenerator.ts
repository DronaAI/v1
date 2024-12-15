import { createVertex } from '@ai-sdk/google-vertex';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';



const vertexAI = createVertex({
  project : process.env.GOOGLE_PROJECT_ID,
  location: process.env.GOOGLE_LOCATION, 
})


const model = vertexAI("gemini-1.5-pro",{
    structuredOutputs: false
})

const openAi = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    compatibility: 'strict',
  })
  
  
  const gemini = openAi("gpt-4o")

export async function generateSummary(transcript : string) {
    const result = await generateObject({
        model: gemini,
        schema : z.object({
            summary : z.string(),
        }),
    
        system: `You are an AI which can understand the concepts given in the transcript of a youtube video , take the keywords and summarize the transcript in 250 words or less.`,

        prompt: `Summarize the provided ${transcript} in 250 words or less.`
    })


    return result.object
}





