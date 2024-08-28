const OpenAI = require('openai');
const {openaiAPIKey} = require("../Config/openAIConfig");

const openAIClient = new OpenAI({
    apiKey: openaiAPIKey,
})

const generateResponse = async (thread) => {
    try {
        const response = await openAIClient.chat.completions.create({
            model: "gpt-4-turbo",
            messages: thread,
        })
        // Extract and return the generated message from the response
        return response.choices[0].message.content;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    generateResponse,
};