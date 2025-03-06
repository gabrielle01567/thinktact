'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ApiTestPage() {
  const [isMistralLoading, setIsMistralLoading] = useState(false);
  const [mistralResult, setMistralResult] = useState<any>(null);
  const [mistralError, setMistralError] = useState<string | null>(null);

  const testMistral = async () => {
    setIsMistralLoading(true);
    setMistralError(null);
    setMistralResult(null);

    try {
      const response = await fetch('/api/mistral-test');
      const data = await response.json();
      
      setMistralResult(data);
      
      if (!response.ok) {
        setMistralError(`Error: ${data.message || response.statusText}`);
      }
    } catch (err) {
      setMistralError(`Failed to test Mistral API: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsMistralLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">API Test</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Test your Mistral API connection to ensure it's working correctly.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mistral API Test</CardTitle>
            <CardDescription>
              Test your Mistral API connection and chat completion functionality.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testMistral} 
              disabled={isMistralLoading}
              className="w-full"
            >
              {isMistralLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Mistral API...
                </>
              ) : (
                'Test Mistral API'
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            {mistralError && (
              <Alert variant="destructive" className="w-full mb-4">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{mistralError}</AlertDescription>
              </Alert>
            )}
            
            {mistralResult && (
              <div className="w-full space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="font-semibold">Mistral API:</div>
                  {mistralResult.success ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Connected
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      Failed
                    </div>
                  )}
                </div>
                
                {mistralResult.success && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Available Models:</h3>
                      <div className="text-sm">
                        <ul className="list-disc ml-5">
                          {mistralResult.models?.map((model: any, index: number) => (
                            <li key={index}>{model.name || model.id}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Test Response:</h3>
                      <div className="text-sm p-3 bg-gray-100 dark:bg-gray-700 rounded">
                        {mistralResult.testResponse}
                      </div>
                    </div>
                    
                    {mistralResult.apiDetails && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">API Details:</h3>
                        <div className="text-sm">
                          <div><span className="font-medium">Model Used:</span> {mistralResult.apiDetails.modelUsed}</div>
                          <div><span className="font-medium">Prompt Tokens:</span> {mistralResult.apiDetails.promptTokens}</div>
                          <div><span className="font-medium">Completion Tokens:</span> {mistralResult.apiDetails.completionTokens}</div>
                          <div><span className="font-medium">Total Tokens:</span> {mistralResult.apiDetails.totalTokens}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  {mistralResult.message}
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 