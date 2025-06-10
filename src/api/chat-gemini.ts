import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, type Message } from 'ai';
import { z } from 'zod';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// Define the expected structure of the incoming request body
// Use the standard AI SDK Message type roles
const requestBodySchema = z.object({
  messages: z.array(z.object({
    id: z.string().optional(), // id is optional in the incoming message array
    role: z.enum(['user', 'assistant', 'system', 'function', 'tool']),
    content: z.string(),
    // Include potential experimental attachments if the frontend sends them
    experimental_attachments: z.array(z.object({
      url: z.string(),
      name: z.string().optional(),
      contentType: z.string().optional(),
    })).optional(),
  })),
});

export async function POST(req: Request) {
  try {
    // Validate the request body
    const body = await req.json();
    // Explicitly type the parsed messages to match the AI SDK's Message type structure
    const { messages } = requestBodySchema.parse(body) as { messages: Message[] };

    // Initialize the Google Generative AI provider
    // Ensure the environment variable name matches what's in your .env
    const google = createGoogleGenerativeAI({ apiKey: process.env.VITE_GEMINI_API_KEY || '' });

    // Use the streamText function to generate a response
    // The AI SDK handles mapping standard roles (user, assistant) to the provider's expected roles
    const result = await streamText({
      model: google('gemini-pro'), // Use the Google provider with the desired model
      messages,
      // The following parameters are optional
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Respond with the stream
    return result.toDataStreamResponse();

  } catch (error) {
    console.error('Error processing chat request:', error);

    // Handle validation errors or other issues
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: 'Invalid request body', details: error.errors }), { status: 400 });
    }

    return new Response(JSON.stringify({ error: 'Failed to generate response' }), { status: 500 });
  }
} 