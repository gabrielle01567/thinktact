'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Edit, CheckCircle, AlertTriangle, MessageSquare, Lightbulb, ArrowRight } from 'lucide-react';

interface ArgumentCoachProps {
    initialArgument?: string;
}

export const ArgumentCoach: React.FC<ArgumentCoachProps> = ({ initialArgument = '' }) => {
    const [argument, setArgument] = useState(initialArgument);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [feedback, setFeedback] = useState<null | {
        strengths: string[];
        weaknesses: string[];
        fallacies: Array<{ type: string; explanation: string }>;
        improvements: string[];
        revisedArgument: string;
    }>(null);
    const [activeTab, setActiveTab] = useState('original');

    const analyzeArgument = async () => {
        if (!argument.trim()) return;
        
        setIsAnalyzing(true);
        
        // In a real application, this would be an API call to your backend
        // For demo purposes, we'll simulate a response after a delay
        setTimeout(() => {
            // Mock feedback data
            setFeedback({
                strengths: [
                    "Clear thesis statement at the beginning",
                    "Good use of statistical evidence in paragraph 2",
                    "Logical flow between main points"
                ],
                weaknesses: [
                    "Conclusion doesn't fully address counterarguments",
                    "Some claims lack sufficient supporting evidence",
                    "Overreliance on emotional appeals in paragraph 3"
                ],
                fallacies: [
                    { 
                        type: "Slippery Slope", 
                        explanation: "Your argument that 'if we implement policy X, it will inevitably lead to outcome Y' doesn't establish the necessary causal chain." 
                    },
                    { 
                        type: "Appeal to Authority", 
                        explanation: "Citing Dr. Smith's opinion without explaining the reasoning behind it relies too heavily on authority rather than evidence." 
                    }
                ],
                improvements: [
                    "Add more empirical evidence to support your claims in paragraph 3",
                    "Address the strongest counterargument more directly",
                    "Strengthen your conclusion by summarizing your key points more effectively",
                    "Replace emotional appeals with logical reasoning where appropriate"
                ],
                revisedArgument: argument + "\n\n[This is where an AI-improved version of the argument would appear, addressing the weaknesses and fallacies identified above while maintaining the strengths.]"
            });
            
            setIsAnalyzing(false);
        }, 2000);
    };

    const adoptRevision = () => {
        if (feedback) {
            setArgument(feedback.revisedArgument);
            setActiveTab('original');
            // In a real app, you might want to save this to the user's history
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                    <Edit className="h-5 w-5 mr-2 text-port-500 dark:text-port-400" />
                    AI Argument Coach
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Improve your arguments with AI-powered feedback and suggestions
                </p>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <label htmlFor="argument" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Argument
                    </label>
                    <Textarea
                        id="argument"
                        value={argument}
                        onChange={(e) => setArgument(e.target.value)}
                        placeholder="Enter your argument here for AI analysis and coaching..."
                        className="min-h-[200px] text-base"
                    />
                    <div className="mt-2 flex justify-end">
                        <Button 
                            onClick={analyzeArgument} 
                            disabled={isAnalyzing || !argument.trim()}
                            className="bg-port-500 hover:bg-port-600 text-white"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    Analyze Argument
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {feedback && (
                    <div className="mt-8">
                        <Tabs defaultValue="feedback" className="w-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                                <TabsTrigger value="revised">Revised Version</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="feedback">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg flex items-center text-green-600 dark:text-port-400">
                                                <CheckCircle className="h-5 w-5 mr-2" />
                                                Strengths
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {feedback.strengths.map((strength, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <CheckCircle className="h-4 w-4 mr-2 mt-1 text-green-500 dark:text-port-400" />
                                                        <span>{strength}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg flex items-center text-red-600 dark:text-port-400">
                                                <AlertTriangle className="h-5 w-5 mr-2" />
                                                Weaknesses
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {feedback.weaknesses.map((weakness, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <AlertTriangle className="h-4 w-4 mr-2 mt-1 text-red-500 dark:text-port-400" />
                                                        <span>{weakness}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                                
                                <Card className="mb-6">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center text-amber-600 dark:text-port-400">
                                            <AlertTriangle className="h-5 w-5 mr-2" />
                                            Logical Fallacies Detected
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {feedback.fallacies.map((fallacy, index) => (
                                                <div key={index} className="border-l-4 border-amber-500 dark:border-port-400 pl-4 py-2">
                                                    <h4 className="font-medium text-amber-700 dark:text-port-300">{fallacy.type}</h4>
                                                    <p className="text-gray-600 dark:text-gray-300 mt-1">{fallacy.explanation}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center text-blue-600 dark:text-port-400">
                                            <Lightbulb className="h-5 w-5 mr-2" />
                                            Suggested Improvements
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {feedback.improvements.map((improvement, index) => (
                                                <li key={index} className="flex items-start">
                                                    <ArrowRight className="h-4 w-4 mr-2 mt-1 text-blue-500 dark:text-port-400" />
                                                    <span>{improvement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            <TabsContent value="revised">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <Edit className="h-5 w-5 mr-2 text-port-500 dark:text-port-400" />
                                            AI-Revised Argument
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md whitespace-pre-wrap">
                                            {feedback.revisedArgument}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button 
                                            onClick={adoptRevision}
                                            className="bg-port-500 hover:bg-port-600 text-white"
                                        >
                                            Use This Version
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArgumentCoach; 