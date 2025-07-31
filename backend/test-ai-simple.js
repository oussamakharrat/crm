import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TOGETHER_API_KEY = process.env.META_API_KEY;
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';

async function testSimpleAI() {
  try {
    console.log('Testing Together AI API with Qwen model...');
    console.log('API Key:', TOGETHER_API_KEY ? 'Present' : 'Missing');
    
    const response = await axios.post(TOGETHER_API_URL, {
      model: 'Qwen/Qwen3-235B-A22B-Thinking-2507',
      messages: [
        {
          role: 'user',
          content: 'Generate 2 business leads in JSON format: [{"name": "John Doe", "email": "john@company.com", "phone": "555-1234", "company": "Tech Corp", "source": "Website", "notes": "Interested in CRM"}]'
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ API Response:', response.data.choices[0].message.content);
    return true;
  } catch (error) {
    console.error('❌ API Error:', error.response?.data || error.message);
    return false;
  }
}

testSimpleAI(); 