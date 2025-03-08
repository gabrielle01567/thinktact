import MistralClient from '@mistralai/mistralai';

// Check for required environment variables
const apiKey = process.env.MISTRAL_API_KEY;
const useMockResponses = !apiKey;

if (useMockResponses) {
  console.warn('MISTRAL_API_KEY not found. Using mock responses instead.');
} else {
  console.log('Mistral Configuration:');
  console.log(`- API Key present: ${apiKey ? 'Yes' : 'No'}`);
  console.log(`- API Key length: ${apiKey?.length || 0}`);
}

// Create a Mistral client with the proper configuration if API key is available
export const mistralClient = apiKey ? new MistralClient(apiKey as string) : null;

// Default model to use
export const DEFAULT_MODEL = 'mistral-large-latest';

// Mock response for when API key is missing
const MOCK_RESPONSE = {
  id: 'mock-response-id',
  object: 'chat.completion',
  created: Date.now(),
  model: 'mock-model',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: `This is a mock response because the MISTRAL_API_KEY is not configured.

Analysis of your argument:

Your argument appears to be well-structured but could benefit from additional supporting evidence. There are a few potential logical fallacies:

1. Appeal to authority - You're relying heavily on expert opinions without explaining their reasoning
2. False dichotomy - You present only two possible outcomes when more might exist
3. Hasty generalization - Drawing broad conclusions from limited examples

Suggestions for improvement:
- Add specific data points to support your claims
- Consider counterarguments and address them
- Clarify your reasoning process more explicitly
- Avoid absolute statements unless they can be definitively proven

Overall, your argument has potential but needs refinement to be more persuasive and logically sound.`
      },
      finish_reason: 'stop'
    }
  ],
  usage: {
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0
  }
};

// Mock streaming response chunks
const MOCK_STREAM_CHUNKS = [
  "This is a mock response because the MISTRAL_API_KEY is not configured.\n\n",
  "Analysis of your argument:\n\n",
  "Your argument appears to be well-structured but could benefit from additional supporting evidence. ",
  "There are a few potential logical fallacies:\n\n",
  "1. Appeal to authority - You're relying heavily on expert opinions without explaining their reasoning\n",
  "2. False dichotomy - You present only two possible outcomes when more might exist\n",
  "3. Hasty generalization - Drawing broad conclusions from limited examples\n\n",
  "Suggestions for improvement:\n",
  "- Add specific data points to support your claims\n",
  "- Consider counterarguments and address them\n",
  "- Clarify your reasoning process more explicitly\n",
  "- Avoid absolute statements unless they can be definitively proven\n\n",
  "Overall, your argument has potential but needs refinement to be more persuasive and logically sound."
];

// Helper function to get chat completion
export async function getChatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  // If we're using mock responses, return the mock
  if (useMockResponses) {
    console.log('Returning mock response (no API key available)');
    return MOCK_RESPONSE;
  }

  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 2000,
  } = options;

  try {
    // For version 0.1.3, the parameter is max_tokens (snake_case)
    if (!mistralClient) {
      throw new Error('Mistral client is not initialized');
    }
    
    const chatResponse = await mistralClient.chat({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    } as any); // Use type assertion to bypass TypeScript checking

    return chatResponse;
  } catch (error) {
    console.error('Error getting chat completion from Mistral:', error);
    throw error;
  }
}

// Helper function to get streaming chat completion
export async function getChatCompletionStream(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  // If we're using mock responses, return a mock stream
  if (useMockResponses) {
    console.log('Returning mock stream (no API key available)');
    
    // Create a TransformStream to simulate streaming
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    
    // Simulate streaming with delays
    (async () => {
      const encoder = new TextEncoder();
      for (const chunk of MOCK_STREAM_CHUNKS) {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        await writer.write(encoder.encode(chunk));
      }
      await writer.close();
    })();
    
    return stream.readable;
  }

  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 2000,
  } = options;

  try {
    if (!mistralClient) {
      throw new Error('Mistral client is not initialized');
    }
    
    // Use the streaming API
    const streamingResponse = await mistralClient.chatStream({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    } as any);
    
    // Create a TransformStream to convert the Mistral stream to a ReadableStream
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    
    // Process the streaming response
    (async () => {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of streamingResponse) {
          if (chunk.choices[0]?.delta?.content) {
            await writer.write(encoder.encode(chunk.choices[0].delta.content));
          }
        }
      } catch (error) {
        console.error('Error in streaming response:', error);
      } finally {
        await writer.close();
      }
    })();
    
    return stream.readable;
  } catch (error) {
    console.error('Error getting streaming chat completion from Mistral:', error);
    throw error;
  }
} 