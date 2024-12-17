import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createVertex } from '@ai-sdk/google-vertex';

import { createGoogleGenerativeAI } from '@ai-sdk/google'

const google = createGoogleGenerativeAI({
  apiKey : process.env.GOOGLE_API_KEY,
})
const gemini= google('gemini-1.5-pro-latest' , {
  structuredOutputs: false,
  useSearchGrounding: true
});
// Define the schema exactly as in the given example structure.
const schema = z.object({
  summary: z.array(
    z.object({
      title: z.string(),
      explanation: z.string(),
      flashcards: z.array(
        z.object({
          front: z.string(),
          back: z.string(),
        })
      ),
    })
  ),
  keyPoints: z.array(
    z.object({
      title: z.string(),
      explanation: z.string(),
      flashcards: z.array(
        z.object({
          front: z.string(),
          back: z.string(),
        })
      ),
    })
  )
});

/**
 * Generates structured educational content with both summary and key points 
 * sections based on the provided topic and transcript.
 * 
 * @param {string} topic - The educational topic.
 * @param {string} transcript - The transcript content related to the topic.
 * @returns {Promise<{ summary: Array<{title: string, explanation: string, flashcards: Array<{front: string, back: string}>}>, keyPoints: Array<{title: string, explanation: string, flashcards: Array<{front: string, back: string}>}> }>}
 */
export async function generateExplanations(topic:string , transcript:string) {
  const result = await generateObject({
    model: gemini,
    schema,
    system: `You are an educational content generator specialized in creating concise, engaging, and informative material for students. Your role is to create summaries, explanations, and flashcards for educational topics, tailored to different learning contexts (e.g., summaries, key points). Ensure your responses are aligned with the provided transcript, and differentiate content appropriately between summary and key points.`,
    prompt: `
### Task Description:
Generate educational content for a learning module on the given topic. The content should include two sections: "summary" and "keyPoints". Each section contains:
- A title summarizing the content for that section.
- An explanation: For "summary", a broad overview of the topic. For "keyPoints", highlight specific concepts, details, or applications.
- 2-5 flashcards per section with a question/concept on the front and a detailed answer on the back.

### Input Data:
- **Topic**: ${topic}
- **Transcript**: ${transcript}

### Output Requirements:
Return an object with two properties: "summary" and "keyPoints".
Each should be an array of objects, where each object includes:
- title (string)
- explanation (string)
- flashcards (array of objects with "front" and "back" strings)

Ensure:
- The "summary" section provides a broad overview.
- The "keyPoints" section highlights specific concepts.
- Content is aligned with the given transcript.

Now generate the educational content.
`,
  });

  return result.object;
}

// Example usage:
// (async () => {
//   const topic = "Introduction to Algebra";
//   const transcript = "Algebra involves using symbols and variables to represent and solve problems...";
//   const explanations = await generateExplanations(topic, transcript);
//   console.log(JSON.stringify(explanations, null, 2));
// })();
