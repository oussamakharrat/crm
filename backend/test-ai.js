import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TOGETHER_API_KEY = process.env.META_API_KEY;
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';

async function testAI() {
  try {
    console.log('Testing Together AI API...');
    console.log('API Key:', TOGETHER_API_KEY ? 'Present' : 'Missing');
    
    const testPrompt = `Generate 3 realistic business leads based on this scenario:

A technology company is looking for potential clients in the healthcare industry. They provide software solutions for hospital management systems.

Please create leads with:
- Realistic names
- Business email addresses
- Phone numbers
- Company names in healthcare
- Source information
- Relevant notes

Return as JSON array:
[
  {
    "name": "John Smith",
    "email": "john.smith@healthcare.com",
    "phone": "+1-555-0123",
    "company": "City General Hospital",
    "source": "Industry Research",
    "notes": "Looking for hospital management software"
  }
]`;

    const response = await axios.post(TOGETHER_API_URL, {
      model: 'meta-llama/Llama-3.1-8B-Instruct:latest',
      messages: [
        {
          role: 'user',
          content: testPrompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ API Response:', response.data);
    
    if (response.data.choices && response.data.choices[0]) {
      const content = response.data.choices[0].message.content;
      console.log('✅ Generated Content:', content);
      
      // Try to parse JSON
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const leads = JSON.parse(jsonMatch[0]);
          console.log('✅ Parsed Leads:', JSON.stringify(leads, null, 2));
        }
      } catch (parseError) {
        console.log('❌ JSON Parse Error:', parseError.message);
      }
    }

  } catch (error) {
    console.error('❌ API Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }
}

testAI(); 