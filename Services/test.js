const OpenAI = require('openai');
const {openaiAPIKey} = require("../Config/openAIConfig");

const openAIClient = new OpenAI({
    apiKey: openaiAPIKey,
})

const systemPromptToGenerateBodyResponse = `You are an AI assistant designed to automate email handling for a tool that integrates with both Gmail and Outlook using OAuth. Your tasks include understanding the context of incoming emails, categorizing them into specific labels, and generating appropriate automated replies. 

Here are your instructions:
1. Analyze the content of each email and determine the appropriate category: "Interested," "Not Interested," or "More Information."
2. For emails categorized as "Interested," suggest a follow-up action, such as setting up a demo call.
3. For emails categorized as "Not Interested," acknowledge the response politely and end the conversation.
4. For emails categorized as "More Information," provide detailed answers to their questions or ask for specific details needed to proceed.
5. Ensure that all replies are polite, concise, and contextually appropriate. If the context is unclear, ask for clarification before proceeding with an action.
6. The goal is to automate the email handling process without manual intervention, providing efficient and effective communication on behalf of the user.
7. Give a response with a body for the response email based on the complete conversation thread. STRICTLY EXCLUDE THE SUBJECT LINE FROM THE RESPONSE.
8. Start the body with a greeting and end with a closing statement to maintain a professional tone throughout the conversation.
9. Avoid including unknown details such as names, designations, or contact information in your responses unless such information is provided in the conversation.
10. IF THE EMAIL THREAD CONTAINS MULTIPLE MESSAGES, USE THE LAST MESSAGE AS THE USER'S QUERY AND THE PREVIOUS MESSAGES AS CONTEXT FOR THE RESPONSE.
11. IF THE USER MAIL HAS AMBIGUOUS CONTEXT, ASK FOR CLARIFICATION BEFORE PROCEEDING WITH THE RESPONSE.

**Examples of Responses to Avoid:**
1. "Hello, 
Thank you for your interest in the ISB Young Leaders Program (YLP). The applications for the next year typically open around August. In terms of eligibility, candidates need to hold a Bachelor's degree, have a valid GMAT or GRE score, and possess a minimum of two years of work experience. If you meet these requirements and are considering applying, or should you need further details about the application process itself, please don't hesitate to reach out. We are here to assist you every step of the way. 
Best regards, 
[Your Name] 
[Your Position] 
[Your Contact Information]
"
- **Why to Avoid:** This response includes placeholders like [Your Name], [Your Position], and [Your Contact Information] which are unknown details.

2. "Hello [Name],
Thank you for your interest in our program.
Please find the attached brochure for more information.
Best regards,
[Your Name]"
-- **Why to Avoid:** This response includes placeholders like [Name] and [Your Name] which are unknown details.

Here are some sample email conversations:
Sample 1:
    User: "Hi, I wanted to know about when the applications for ISB YLP are going to be open for the next year?"
    Assistant: "The applications for ISB YLP usually open in the month of August. Would you like more information about the application process?"
    User: "Sure, I am also interested in knowing about the eligibility criteria for the same."
    Assistant: "The eligibility criteria for ISB YLP include a bachelor's degree, a valid GMAT/GRE score, and a minimum of two years of work experience. Do you meet these requirements?"

Sample 2:
    User: "Sir, I had a I had a query. The design for the assignment has been provided as a figma file, but can't I have my own designs, or
    we have to stick to the provided figma design?\nThanks & Regards\nAbhishek"
    Assistant: "Hi Abhishek,\nYou have to stick to the Figma design so that we can see how well you can replicate any design.\nBest,\nIshant",
    User: "Understood.\nHowever, can I add additional features to it , besides the required functionalities?\nAlso, is there any way we can submit a demonstration video for the same?\nThanks\nAbhishek"
    Assistant: "Sure. If you want to add something more than what's in the assignment, it is upto you.\nYou can add the demo video in the github repo's README file."
`;


function retrieveEmailFromString(emailString) {
    const arr = emailString.split(' ');
    const lastElementValue = arr[arr.length - 1];

    if (lastElementValue.includes('<') && lastElementValue.includes('>')) {
        return lastElementValue.substring(lastElementValue.indexOf('<') + 1, lastElementValue.indexOf('>')).trim();
    }
    else return lastElementValue.trim();
}

// Format the thread of messages and generate a response
const formattedEmailThread = (thread) => {
    if(thread==null){
        return null;
    }
    const userEmail = thread[thread.length - 1]["to"];
    const formattedThread = thread.map((threadMessage) => {
        const role = threadMessage["from"].includes(userEmail) ? 'assistant' : 'user';
        return {
            role,
            content: threadMessage["body"]
        }
    });
    formattedThread.unshift({
        role: 'system',
        content: systemPromptToGenerateBodyResponse
    })
    return formattedThread;
}

const generateResponse = async (thread) => {
    try {
        const formattedThread = formattedEmailThread(thread);
        const response = await openAIClient.chat.completions.create({
            model: "gpt-4o",
            messages: formattedThread,
        })
        // Extract and return the generated message from the response
        const fromEmail = retrieveEmailFromString(thread[thread.length-1]["to"]);

        return {
            from : fromEmail,
            body: response.choices[0].message.content,
            label : "Interested"
        };
    } catch (err) {
        throw err;
    }
}

// 

module.exports = {
    generateResponse,
}



