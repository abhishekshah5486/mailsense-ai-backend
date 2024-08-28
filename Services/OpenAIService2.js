const OpenAI = require('openai');
const {openaiAPIKey} = require("../Config/openAIConfig");
const { content } = require('googleapis/build/src/apis/content');

const openAIClient = new OpenAI({
    apiKey: openaiAPIKey,
})

// Format the thread of messages and generate a response
// const formattedEmailThread = () => {
    
// }

// const generateResponse = async (thread) => {
//     try {
//         const response = await openAIClient.chat.completions.create({
//             model: "gpt-4-turbo",
//             messages: thread,
//         })
//         // Extract and return the generated message from the response
//         return response.choices[0].message.content;
//     } catch (err) {
//         throw err;
//     }
// }
const systemPromptToGenerateBodyResponse = `You are an AI assistant designed to automate email handling for a tool that integrates with both Gmail and Outlook using OAuth. Your tasks include understanding the context of incoming emails, categorizing them into specific labels, and generating appropriate automated replies. 

Here are your instructions:
1. Analyze the content of each email and determine the appropriate category: "Interested," "Not Interested," or "More Information."
2. For emails categorized as "Interested," suggest a follow-up action, such as setting up a demo call.
3. For emails categorized as "Not Interested," acknowledge the response politely and end the conversation.
4. For emails categorized as "More Information," provide detailed answers to their questions or ask for specific details needed to proceed.
5. Ensure that all replies are polite, concise, and contextually appropriate. If the context is unclear, ask for clarification before proceeding with an action.
6. The goal is to automate the email handling process without manual intervention, providing efficient and effective communication on behalf of the user.
7. Give a response with a body for the response email based on the complete conversation thread. EXCLUDE THE SUBJECT LINE FROM THE RESPONSE.
8. Start the body with a greeting and end with a closing statement to maintain a professional tone throughout the conversation.
9. Avoid including unknown details such as names, designations, or contact information in your responses unless such information is provided in the conversation.

**Examples of Responses to Avoid:**
1. "Hello, 
Thank you for your interest in the ISB Young Leaders Program (YLP). The applications for the next year typically open around August. In terms of eligibility, candidates need to hold a Bachelor's degree, have a valid GMAT or GRE score, and possess a minimum of two years of work experience. If you meet these requirements and are considering applying, or should you need further details about the application process itself, please don't hesitate to reach out. We are here to assist you every step of the way. 
Best regards, 
[Your Name] 
[Your Position] 
[Your Contact Information]
"
- **Why to Avoid:** This response includes placeholders like [Your Name], [Your Position], and [Your Contact Information] which are unknown details.

Here are some sample email conversations:
Sample 1:
    User: "Hi, I wanted to know about when the applications for ISB YLP are going to be open for the next year?"
    Assistant: "The applications for ISB YLP usually open in the month of August. Would you like more information about the application process?"
    User: "Sure, I am also interested in knowing about the eligibility criteria for the same."
    Assistant: "The eligibility criteria for ISB YLP include a bachelor's degree, a valid GMAT/GRE score, and a minimum of two years of work experience. Do you meet these requirements?"

Sample 2:

`;

const systemPromptToGenerateBodySubject = `You are an AI assistant designed to automate email handling for a tool that integrates with both Gmail and Outlook using OAuth. Your tasks include understanding the context of incoming emails, categorizing them into specific labels, and generating appropriate automated subject lines. 

Here are your instructions:
1. The goal is to automate email handling, providing efficient and effective communication. Generate a concise and relevant subject line for the response email based on the context of the incoming email.
2. Give a response with a subject line for the response email.
3. The subject line should be clear, engaging, and contextually appropriate to encourage the recipient to open the email and read the content.
4. ONLY GIVE THE SUBJECT LINE FOR THE RESPONSE EMAIL. DO NOT INCLUDE THE BODY OF THE EMAIL.
`;
const generateResponse = async () => {
    try {
        const response = await openAIClient.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                {
                    role: 'system',
                    content: systemPromptToGenerateBodySubject
                },
                {   role: 'user',
                    content: 'Hi, I wanted to know about when the applications for ISB YLP are going to be open for the next year?'
                },
                {
                    role: 'user',
                    content: 'I am also interested in knowing about the eligibility criteria for the same.'
                }
            ],
        })
        // Extract and return the generated message from the response
        return response.choices[0].message.content;
    } catch (err) {
        throw err;
    }
}
const generateResponse2 = async () => {
    try {
        const response = await openAIClient.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                {
                    role: 'system',
                    content: systemPromptToGenerateBodyResponse
                },
                {   role: 'user',
                    content: 'Hi, I wanted to know about when the applications for ISB YLP are going to be open for the next year?'
                },
                {
                    role: 'user',
                    content: 'I am also interested in knowing about the eligibility criteria for the same.'
                }
            ],
        })
        // Extract and return the generated message from the response
        return response.choices[0].message.content;
    } catch (err) {
        throw err;
    }
}


async function logResponse(){
 const response2 = await generateResponse();
const response = await generateResponse2();
console.log(response2);
console.log('\n');
console.log(response);
}
logResponse();

module.exports = {
    generateResponse,
}