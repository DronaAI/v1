import { ChatPromptTemplate } from "@langchain/core/prompts";

const formatInstructions = `Respond only in valid JSON. The JSON object you return should match the following schema:
{{ 
    title: "string",
    chapters: [
        {
            youtube_search_query: "string",
            chapter_title: "string"
        }
    ]
}}
Where chapter is an array of chapter objects, each containing a youtube search query and chapter_title. 
`;


export const CourseGenerationprompt = await ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are an expert course creator. Create a detailed course structure for the given topic.
        The course should be comprehensive and well-structured, with clear chapters .
        Each chapter should have an appropriate youtube search parameter such that the exact chapter can be found .
        
        Answer the user query. Wrap the output in \`json\` tags
        {format_instructions}`,
    ],
    ["human", "Create a course structure for: {topic} with {units} units."],
]).partial({
    format_instructions: formatInstructions,
});