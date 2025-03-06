import MistralClient from '@mistralai/mistralai';

// Check for required environment variables
if (!process.env.MISTRAL_API_KEY) {
  throw new Error('Missing MISTRAL_API_KEY environment variable');
}

// Log API key details for debugging (without revealing the actual key)
const apiKey = process.env.MISTRAL_API_KEY;

console.log('Mistral Configuration:');
console.log(`- API Key present: ${apiKey ? 'Yes' : 'No'}`);
console.log(`- API Key length: ${apiKey?.length || 0}`);

// Create a Mistral client with the proper configuration
export const mistralClient = new MistralClient(process.env.MISTRAL_API_KEY as string);

// Default model to use
export const DEFAULT_MODEL = 'mistral-large-latest';

// Helper function to get chat completion
export async function getChatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 2000,
  } = options;

  try {
    // For version 0.1.3, the parameter is max_tokens (snake_case)
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