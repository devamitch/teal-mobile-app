import axios from 'axios';

const baseURL = 'https://api.openai.com/v1/chat/completions';
const apiKey = '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';

const chatGPTClient = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
});

export default chatGPTClient;
