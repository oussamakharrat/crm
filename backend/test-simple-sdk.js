import Together from "together-ai";
import dotenv from 'dotenv';

dotenv.config();

const TOGETHER_API_KEY = process.env.META_API_KEY;

async function testSDK() {
  try {
    console.log('Testing Together AI SDK...');
    console.log('API Key:', TOGETHER_API_KEY ? 'Present' : 'Missing');
    
    const together = new Together({ apiKey: TOGETHER_API_KEY });
    
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Generate 1 business lead in JSON format: [{\"name\": \"John Doe\", \"email\": \"john@company.com\", \"phone\": \"555-1234\", \"company\": \"Tech Corp\", \"source\": \"Website\", \"notes\": \"Interested in CRM\"}]"
        }
      ],
      model: "Qwen/Qwen3-235B-A22B-Thinking-2507",
      max_tokens: 500,
      temperature: 0.7
    });

    console.log('✅ SDK Response:', response.choices[0].message.content);
    return true;
  } catch (error) {
    console.error('❌ SDK Error:', error.message);
    return false;
  }
}

testSDK(); 