import { createVertex } from '@ai-sdk/google-vertex';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';

const vertexAI = createVertex({
  project : process.env.GOOGLE_PROJECT_ID,
  location: process.env.GOOGLE_LOCATION, 
})


const model = vertexAI("gemini-1.0-pro")



  export async function chapterImprovementAgent(quiz_results: any, chapters: any) {
    const result = await generateObject({
      model: model,
      schema: z.object({
        chapters: z.array(
          z.object({
            title: z.string(),
            youtube_search_query: z.string(),
          })
        ),
      }),
      system: `You are an expert in course design with extensive experience in creating educational content. Your goal is to improve the structure and content of a unit by analyzing quiz results and existing chapters. Use your expertise to identify gaps, address common misconceptions, and propose a better structure for the unit's chapters.`,
      prompt: `
  ### Task Description:
  You are provided with the following:
  1. **Quiz Results**: A list of chapter-level quiz results, including scores and wrong answers, aggregated at the unit level.
  2. **Existing Chapters**: A list of the unit's current chapters.
  
  Analyze the quiz results to:
  - Identify common misconceptions and knowledge gaps based on the wrong answers.
  - Prioritize topics that need more attention.
  - Suggest new or modified chapters to enhance the unit's educational value.
  
  ### Input Data:
  1. **Quiz Results**:
  \`\`\`
  ${JSON.stringify(quiz_results, null, 2)}
  \`\`\`
  
  2. **Existing Chapters**:
  \`\`\`
  ${JSON.stringify(chapters, null, 2)}
  \`\`\`
  
  ### Output Requirements:
  Generate an improved list of chapters with the following structure:
  - **Title**: A clear and concise chapter title.
  - **YouTube Search Query**: A focused search query to find relevant video content for the chapter.
  
  Ensure the chapters:
  - Address identified gaps in understanding.
  - Cover underrepresented topics.
  - Maintain logical order and flow for the unit's learning objectives.
  
  Now, create a revised set of chapters for this unit.`,
    });
  
    return result.object.chapters;
  }
  