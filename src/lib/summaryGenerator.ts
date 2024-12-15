import { createVertex } from '@ai-sdk/google-vertex';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';



const vertexAi = createOpenAI({
    // custom settings, e.g.
    apiKey  : process.env.OPENAI_API_KEY,
    compatibility: 'strict', // strict mode, enable when using the OpenAI API
  });
  
  const model = vertexAi("gpt-4o-mini")



export async function generateSummary(transcript : string) {
    const result = await generateObject({
        model: model,
        schema : z.object({
            summary : z.string(),
        }),
    
        system: `You are an AI which can understand the concepts given in the transcript of a youtube video , take the keywords and summarize the transcript in 250 words or less.`,

        prompt: `Summarize the provided ${transcript} in 250 words or less.`
    })


    return result.object
}





