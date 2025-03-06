import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { mistralClient, getChatCompletion } from '@/lib/mistral';

export async function POST(req: Request) {
  const requestId = uuidv4();
  const userAgent = req.headers.get('user-agent') || 'Unknown';
  
  try {
    console.log(`[${requestId}] Starting Mistral argument analysis request`);
    console.log(`[${requestId}] User Agent: ${userAgent}`);
    
    const { argument } = await req.json();
    
    if (!argument || typeof argument !== 'string' || argument.trim() === '') {
      console.log(`[${requestId}] Error: Empty argument received`);
      return NextResponse.json(
        { error: 'Argument text is required' },
        { status: 400 }
      );
    }

    console.log(`[${requestId}] Argument length: ${argument.length} characters`);
    console.log(`[${requestId}] Sending request to Mistral API`);
    
    // Create system prompt for argument analysis
    const systemPrompt = `You are an expert in critical thinking and argument analysis. 
    Your task is to analyze arguments for logical fallacies, evaluate their strength, 
    and provide constructive feedback. Be thorough but concise in your analysis.`;
    
    // Create the messages array
    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt
      },
      {
        role: 'user' as const,
        content: `Please analyze the following argument and provide feedback on its logical structure, 
        identify any fallacies, evaluate its strength, and suggest improvements:
        
        ${argument}`
      }
    ];
    
    try {
      // Log Mistral configuration
      console.log(`[${requestId}] Mistral API Key present: ${process.env.MISTRAL_API_KEY ? 'Yes' : 'No'}`);
      console.log(`[${requestId}] Mistral API Key length: ${process.env.MISTRAL_API_KEY?.length || 0}`);
      
      // Get chat completion from Mistral
      const response = await getChatCompletion(messages, {
        temperature: 0.7,
        maxTokens: 2000
      });
      
      console.log(`[${requestId}] Successfully received Mistral response`);
      
      // Extract the assistant's response
      if (!response.choices || response.choices.length === 0) {
        console.log(`[${requestId}] Error: No response choices returned from Mistral API`);
        throw new Error('No response choices returned from Mistral API');
      }
      
      const assistantResponse = response.choices[0].message.content;
      console.log(`[${requestId}] Response length: ${assistantResponse.length} characters`);
      
      return NextResponse.json({ 
        response: assistantResponse,
        requestId
      });
    } catch (apiError: any) {
      console.error(`[${requestId}] Error during Mistral API call:`, apiError);
      console.error(`[${requestId}] Error details:`, JSON.stringify(apiError));
      return NextResponse.json({
        error: 'Error calling Mistral API',
        message: apiError.message || 'Unknown API error',
        status: apiError.status || 500
      }, {
        status: apiError.status || 500
      });
    }
    
  } catch (error: any) {
    console.error(`[${requestId}] Error in argument analysis:`, error);
    console.error(`[${requestId}] Error details:`, JSON.stringify(error));
    
    // Check for rate limit errors
    if (error.status === 429) {
      return NextResponse.json({
        error: 'API quota exceeded. Please try again later or contact support.',
        message: 'Our API usage limit has been reached. The team has been notified.'
      }, {
        status: 429
      });
    }
    
    // Handle authentication errors
    if (error.status === 401) {
      return NextResponse.json({
        error: 'Authentication error. Please check API configuration.',
        message: 'There was an issue with our API authentication. The team has been notified.'
      }, {
        status: 401
      });
    }
    
    // Generic error fallback
    return NextResponse.json({
      error: 'An error occurred during analysis',
      message: error.message || 'Something went wrong while analyzing your argument. Please try again later.'
    }, {
      status: 500
    });
  }
} 