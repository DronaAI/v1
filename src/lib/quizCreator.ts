import { createVertex } from '@ai-sdk/google-vertex';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';



const vertexAI = createVertex({
  project : process.env.GOOGLE_PROJECT_ID,
  location: process.env.GOOGLE_LOCATION, 
})


const model = vertexAI("gemini-1.5-flash-002",{
    structuredOutputs: false
})




export async function createQuiz(topic: string, transcript : string , number : number) {
    const result = await generateObject({
        model: model,
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





