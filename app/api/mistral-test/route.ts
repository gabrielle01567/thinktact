import { NextResponse } from 'next/server';
import { mistralClient, getChatCompletion } from '@/lib/mistral';

export async function GET(req: Request) {
  try {
    console.log('Testing Mistral API...');
    
    // Test basic API connectivity
    const models = await mistralClient.models.list();
    
    // Test chat completion
    const messages = [
      {
        role: 'system' as const,
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user' as const,
        content: 'Hello, can you provide a brief response to test the API?'
      }
    ];
    
    const chatResponse = await getChatCompletion(messages, {
      temperature: 0.7,
      maxTokens: 100
    });
    
    // Extract the assistant's response
    if (!chatResponse.choices || chatResponse.choices.length === 0) {
      throw new Error('No response choices returned from Mistral API');
    }
    
    const assistantResponse = chatResponse.choices[0].message.content;
    
    return NextResponse.json({
      success: true,
      message: 'Mistral API test completed successfully',
      models: models.data ? models.data.map(model => ({
        id: model.id,
        name: model.name
      })) : [],
      testResponse: assistantResponse,
      apiDetails: {
        modelUsed: chatResponse.model,
        promptTokens: chatResponse.usage?.promptTokens,
        completionTokens: chatResponse.usage?.completionTokens,
        totalTokens: chatResponse.usage?.totalTokens
      }
    });
  } catch (error: any) {
    console.error('Error testing Mistral API:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error testing Mistral API',
      error: error.message,
      errorObject: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      status: error.status || 500
    }, { status: error.status || 500 });
  }
} 