import { NextResponse } from "next/server"
import { mistralClient, getChatCompletion } from '@/lib/mistral';
import { mockAnalysisResponse } from "./mock-response"

const USE_MOCK_RESPONSE = false

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { text } = body

    // Validate input
    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json({ error: "Text to analyze is required" }, { status: 400 })
    }

    // Log the request (for debugging)
    console.log("Analyze request:", { textLength: text.length })

    // Create the prompt for Mistral
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
        content: `Please analyze the following text and provide feedback on its logical structure, 
        identify any fallacies, evaluate its strength, and suggest improvements:
        
        ${text}`
      }
    ];

    try {
      // Get chat completion from Mistral
      const response = await getChatCompletion(messages, {
        temperature: 0.7,
        maxTokens: 2000
      });
      
      // Extract the assistant's response
      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response choices returned from Mistral API');
      }
      
      const assistantResponse = response.choices[0].message.content;

      // Return the analysis
      return NextResponse.json({
        analysis: assistantResponse,
      })
    } catch (apiError: any) {
      console.error(`Error during Mistral API call:`, apiError);
      return NextResponse.json({
        error: 'Error calling Mistral API',
        message: apiError.message || 'Unknown API error',
        status: apiError.status || 500
      }, {
        status: apiError.status || 500
      });
    }
  } catch (error) {
    console.error("Error in analyze endpoint:", error)
    return NextResponse.json(
      {
        error: "An error occurred during analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

