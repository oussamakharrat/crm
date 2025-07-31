import AIService from './services/aiService.js';

async function testTextLeads() {
  try {
    console.log('Testing Text Lead Generation...');
    
    const aiService = new AIService();
    
    const testText = "Hi, I'm interested in your CRM solution for our healthcare practice. We have 15 doctors and need to manage patient records, appointments, and billing. Can you send me more information about pricing and features? Best regards, Dr. Sarah Johnson from Riverside Medical Center.";
    
    console.log('Generating leads from text...');
    const leads = await aiService.generateLeadsFromText(testText, 2);
    
    console.log('✅ Generated leads:', JSON.stringify(leads, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Text Lead Generation Error:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

testTextLeads(); 