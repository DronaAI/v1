import { createVertex } from '@ai-sdk/google-vertex';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';


import { createGoogleGenerativeAI } from '@ai-sdk/google'

const google = createGoogleGenerativeAI({
  apiKey : process.env.GOOGLE_API_KEY,
})
const gemini= google('gemini-1.5-pro-latest' , {
  structuredOutputs: false
});


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





