import { createVertex } from '@ai-sdk/google-vertex';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createGoogleGenerativeAI } from '@ai-sdk/google'

const google = createGoogleGenerativeAI({
  apiKey : process.env.GOOGLE_API_KEY,
})
const gemini= google('gemini-1.5-pro-latest' , {
  structuredOutputs: false,
  useSearchGrounding: true
});




export async function createQuiz(topic: string, transcript : string , number : number) {
    const result = await generateObject({
        model: gemini,
        schema: z.object({
           questions : z.array(z.object({
                question: z.string(),
                answer: z.string(),
                option1: z.string(),
                option2: z.string(),
                option3: z.string()
           }))
        }),
    
        system: `You are an expert quiz creator , your task is curate multiple choice questions for the given topic with the context of the provided transcript , 
        The questions should be challenging and should test the understanding of the topic`,

        prompt: `Create a quiz of ${number} questions for the topic: ${topic} with context of the following transcript: ${transcript}`
    })


    return result.object
}





