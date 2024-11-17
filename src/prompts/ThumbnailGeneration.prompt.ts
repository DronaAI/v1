import { ChatPromptTemplate } from "@langchain/core/prompts";

const formatInstructions = `Respond only in valid JSON. The JSON object you return should match the following schema:
{{ 
    image_search_term: "string"
}}
Where image_search_term is a string that will be used to search for a relevant image on unsplash. 
`;

export const ThumbnailGenerationPrompt = await ChatPromptTemplate.fromMessages([
    [
        "system",
        `you are an AI capable of finding the most relevant thumbnail for a course.
        Please provide a good image search term for the title of a course. This search term will be fed into the unsplash API, so make sure it is a good search term that will return good results
        Answer the user query. Wrap the output in \`json\` tags
        {format_instructions}
        `,
    ],
    ["human", "Create a thumbnail for : {topic}"],
]).partial({
    format_instructions: formatInstructions,
});