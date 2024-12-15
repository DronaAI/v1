import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

import { createVertex } from '@ai-sdk/google-vertex';

const vertexAI = createVertex({
  project : process.env.GOOGLE_PROJECT_ID,
  location: process.env.GOOGLE_LOCATION, 
})


const model = vertexAI("gemini-1.5-flash-001")



export async function studentPerformanceAgent(unitResults: any, chapterResults: any) {
  const result = await generateObject({
    model: model,
    schema: z.object({
      analysis: z.object({
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        unitAnalysis: z.array(
          z.object({
            unitName: z.string(),
            score: z.number(),
            maxScore: z.number(),
            strengths: z.array(z.string()),
            weaknesses: z.array(z.string()),
          })
        ),
        courseRecommendation: z.object({
          required: z.boolean(),
          percentageThreshold: z.number(),
          explanation: z.string(),
        }),
      }),
    }),
    system: `You are an educational performance analyst with expertise in assessing student learning outcomes. Your role is to analyze student quiz results and provide detailed feedback, including strengths, weaknesses, and recommendations for course updates.`,
    prompt: `
### Task Description:
You are provided with the following:
1. **Unit Results**: Aggregated scores for each unit, including chapter-level performance.
2. **Chapter Results**: Detailed chapter-level results, including scores, maximum possible scores, and topics covered.

Analyze the student's performance to:
- Identify overall strengths and weaknesses.
- Provide unit-level analysis, highlighting areas of strong and weak performance.
- Recommend whether the student should update or revisit the course based on their overall performance percentage.

### Input Data:
1. **Unit Results**:
\`\`\`
${JSON.stringify(unitResults, null, 2)}
\`\`\`

2. **Chapter Results**:
\`\`\`
${JSON.stringify(chapterResults, null, 2)}
\`\`\`

### Output Requirements:
Generate a detailed analysis with the following structure:
1. **Strengths**: A list of units where the student performed well (≥ 75% score).
2. **Weaknesses**: A list of units where the student needs improvement (< 75% score).
3. **Unit Analysis**: A list of units with:
   - Unit name.
   - Total score and maximum score.
   - A breakdown of strengths and weaknesses at the chapter level.
4. **Course Recommendation**:
   - Whether the student should revisit or update the course.
   - A percentage threshold that determines the recommendation.
   - A clear and concise explanation of the recommendation.

Now, generate a comprehensive performance analysis.`,
  });

  return result.object.analysis;
}
