const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});

const openaiAPIKey = String(process.env.OPENAI_API_KEY);
if (!openaiAPIKey) {
  throw new Error('OPENAI_API_KEY is not defined');
}

module.exports = {
    openaiAPIKey,
};