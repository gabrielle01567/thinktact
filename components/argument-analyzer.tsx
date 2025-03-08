'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, AlertCircle, Send, CheckCircle, XCircle, Info, 
  HelpCircle, Download, Share2, Lightbulb, MessageSquare, 
  ArrowRight, RefreshCw, Maximize2, Minimize2, Brain, Trophy, Star, Award, TrendingUp, Zap, Target, Lock, AlertTriangle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';

// Session storage keys
const MESSAGES_KEY = 'conversation_messages';
const FIRST_TIME_USER_KEY = 'first_time_user';

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

type ArgumentRating = 'Beginner' | 'Developing' | 'Skilled' | 'Advanced' | 'Master Debater';

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
};

// Function to format Markdown text to HTML
const formatMarkdownText = (text: string): string => {
  if (!text) return '';
  
  // Remove markdown headers (# Header, ## Header, ### Header, etc.)
  let formattedText = text.replace(/^#{1,6}\s+(.*)$/gm, '$1');
  
  // Convert bold markdown (**text**) to <strong> tags
  formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic markdown (*text*) to <em> tags
  formattedText = formattedText.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Format bullet points with proper indentation and spacing
  formattedText = formattedText.replace(/^(\s*)-\s+(.+)$/gm, '<div class="ml-4 mb-2 flex"><span class="mr-2 text-port-500">•</span><span>$2</span></div>');
  
  // Format numbered lists with proper indentation and spacing
  formattedText = formattedText.replace(/^(\s*)(\d+)\.\s+(.+)$/gm, '<div class="ml-4 mb-2 flex"><span class="mr-2 font-medium text-port-500">$2.</span><span>$3</span></div>');
  
  // Add paragraph spacing
  formattedText = formattedText.replace(/\n\n/g, '</p><p class="mb-3">');
  
  // Wrap in paragraph tags if not already
  if (!formattedText.startsWith('<p') && !formattedText.startsWith('<div')) {
    formattedText = `<p class="mb-3">${formattedText}</p>`;
  }
  
  return formattedText;
};

// Function to format the AI response into sections
const formatResponse = (content: string): { [key: string]: string } => {
  // Default sections if we can't parse the content
  const defaultSections = {
    'Analysis': formatMarkdownText(content)
  };
  
  try {
    // Look for section headers like "Logical Structure:", "Fallacies:", etc.
    const sections: { [key: string]: string } = {};
    
    // Common section headers in the response
    const sectionPatterns = [
      { name: 'Argument Analysis', pattern: /\*\*Argument Analysis:\*\*/ },
      { name: 'Logical Structure', pattern: /\*\*Logical Structure:\*\*|\d+\.\s+\*\*Logical Structure:\*\*/ },
      { name: 'Fallacies', pattern: /\*\*Fallacies:\*\*|\d+\.\s+\*\*Fallacies:\*\*/ },
      { name: 'Strength', pattern: /\*\*Strength:\*\*|\d+\.\s+\*\*Strength:\*\*/ },
      { name: 'Improvements', pattern: /\*\*Improvements:\*\*|\d+\.\s+\*\*Improvements:\*\*/ },
      { name: 'Revised Argument', pattern: /\*\*Revised Argument:\*\*/ }
    ];
    
    // If the content doesn't have any of our expected patterns, return it as is
    if (!sectionPatterns.some(section => section.pattern.test(content))) {
      return defaultSections;
    }
    
    // Extract sections
    let lastSectionName = '';
    let lastSectionContent = '';
    
    // Split content by lines to process
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this line starts a new section
      const matchedSection = sectionPatterns.find(section => 
        section.pattern.test(line)
      );
      
      if (matchedSection) {
        // Save the previous section if it exists
        if (lastSectionName) {
          sections[lastSectionName] = formatMarkdownText(lastSectionContent.trim());
        }
        
        // Start a new section
        lastSectionName = matchedSection.name;
        lastSectionContent = line.replace(matchedSection.pattern, '').trim() + '\n';
      } else if (lastSectionName) {
        // Continue adding to the current section
        lastSectionContent += line + '\n';
      } else {
        // Content before any section is found - rename from "Introduction" to "Argument"
        if (!sections['Argument']) {
          sections['Argument'] = '';
        }
        sections['Argument'] += line + '\n';
      }
    }
    
    // Add the last section
    if (lastSectionName) {
      sections[lastSectionName] = formatMarkdownText(lastSectionContent.trim());
    }
    
    // Format the Argument section if it exists
    if (sections['Argument']) {
      // Prepend "Argument:" to make it clear what this section contains
      sections['Argument'] = formatMarkdownText("**Argument:** " + sections['Argument'].trim());
    }
    
    // If we couldn't parse any sections, return the default
    return Object.keys(sections).length > 0 ? sections : defaultSections;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return defaultSections;
  }
};

// Function to export analysis as PDF
const exportAsPDF = (content: string, filename = 'argument-analysis.pdf') => {
  // In a real implementation, this would use a library like jsPDF
  // For now, we'll just create a text file for demonstration
  const element = document.createElement('a');
  const file = new Blob([content], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

// Function to share analysis
const shareAnalysis = (content: string) => {
  if (navigator.share) {
    navigator.share({
      title: 'Argument Analysis',
      text: content,
    }).catch(err => {
      console.error('Error sharing:', err);
    });
  } else {
    // Fallback for browsers that don't support the Web Share API
    navigator.clipboard.writeText(content).then(() => {
      alert('Analysis copied to clipboard!');
    }).catch(err => {
      console.error('Error copying to clipboard:', err);
    });
  }
};

const calculateArgumentScore = (content: string): number => {
  // This is a placeholder implementation
  // In a real app, you would analyze the AI response to determine a score
  // based on logical structure, lack of fallacies, etc.
  
  // For now, we'll generate a random score between 50 and 100
  return Math.floor(Math.random() * 51) + 50;
};

const getRatingFromScore = (score: number): ArgumentRating => {
  if (score < 60) return 'Beginner';
  if (score < 70) return 'Developing';
  if (score < 80) return 'Skilled';
  if (score < 90) return 'Advanced';
  return 'Master Debater';
};

const getColorForRating = (rating: ArgumentRating): string => {
  switch (rating) {
    case 'Beginner': return 'text-gray-500 dark:text-gray-400';
    case 'Developing': return 'text-blue-500 dark:text-port-400';
    case 'Skilled': return 'text-green-500 dark:text-port-400';
    case 'Advanced': return 'text-purple-500 dark:text-port-400';
    case 'Master Debater': return 'text-amber-500 dark:text-port-400';
    default: return 'text-gray-500 dark:text-gray-400';
  }
};

const getBgColorForRating = (rating: ArgumentRating): string => {
  switch (rating) {
    case 'Beginner': return 'bg-gray-100 dark:bg-gray-800';
    case 'Developing': return 'bg-blue-100 dark:bg-blue-900/30';
    case 'Skilled': return 'bg-green-100 dark:bg-green-900/30';
    case 'Advanced': return 'bg-purple-100 dark:bg-purple-900/30';
    case 'Master Debater': return 'bg-amber-100 dark:bg-amber-900/30';
  }
};

// Add a function to modify the fallacies section title
const modifyFallaciesSectionTitle = (sectionName: string): React.ReactNode => {
  if (sectionName !== 'Fallacies') {
    return (
      sectionName === 'Logical Structure' ? 
        <span className="font-semibold text-port-700 dark:text-port-300">{sectionName}</span> : 
        sectionName === 'Fallacies' ?
        <span className="font-semibold text-red-700 dark:text-red-300">{sectionName}</span> :
        sectionName === 'Strength' ?
        <span className="font-semibold text-blue-700 dark:text-port-300">{sectionName}</span> :
        sectionName === 'Improvements' ?
        <span className="font-semibold text-green-700 dark:text-green-300">{sectionName}</span> :
        sectionName
    );
  }
  
  // For Fallacies section, add premium indicator
  return (
    <div className="flex items-center">
      <span className="font-semibold text-red-700 dark:text-red-300">Fallacies Detected</span>
      <span className="ml-2 flex items-center text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
        <Lock className="h-3 w-3 mr-1" />
        <span>Premium</span>
      </span>
    </div>
  );
};

// Add a new function to modify the fallacies content for free users
const modifyFallaciesForFreeTier = (content: string): string => {
  // Check if this is a fallacies section
  if (!content.toLowerCase().includes('fallac')) {
    return content;
  }

  // First, blur out any numbers that indicate the count of fallacies
  let modifiedContent = content;
  
  // Blur out any numbers followed by "fallacy/fallacies"
  modifiedContent = modifiedContent.replace(
    /(\d+)(\s+)(fallac(y|ies))/gi, 
    '<span class="blur-sm select-none bg-gray-200 dark:bg-gray-700 px-1 rounded">$1</span>$2$3'
  );
  
  // Blur out any numbers at the beginning of sentences or list items
  modifiedContent = modifiedContent.replace(
    /(^|\. |<p>|<li>|<div>|I found |I identified |There are |There is )(\d+)(\s+)/g,
    '$1<span class="blur-sm select-none bg-gray-200 dark:bg-gray-700 px-1 rounded">$2</span>$3'
  );
  
  // Blur out any numbers that appear in the first paragraph
  const firstParagraphMatch = modifiedContent.match(/<p[^>]*>(.*?)<\/p>/);
  if (firstParagraphMatch && firstParagraphMatch[1]) {
    const firstParagraph = firstParagraphMatch[1];
    const blurredFirstParagraph = firstParagraph.replace(
      /(\d+)/g,
      '<span class="blur-sm select-none bg-gray-200 dark:bg-gray-700 px-1 rounded">$1</span>'
    );
    modifiedContent = modifiedContent.replace(firstParagraph, blurredFirstParagraph);
  }
  
  // Add a premium message at the top
  modifiedContent = `<div class="mb-4 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
    <div class="flex items-center">
      <svg class="h-4 w-4 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        <span class="font-medium">Premium Feature:</span> Upgrade to see the full fallacy breakdown and detailed explanations.
      </p>
    </div>
  </div>` + modifiedContent;

  // Parse the content to find fallacies
  const fallacyItems = modifiedContent.match(/<li>.*?<\/li>/g) || [];
  
  if (fallacyItems.length <= 1) {
    return modifiedContent; // If there's only one fallacy or none, return as is
  }
  
  // Extract the first fallacy and add a premium message
  const firstFallacy = fallacyItems[0] ? fallacyItems[0].replace(/<li>(.*?)<\/li>/, '<li>✅ $1 (FREE)</li>') : '';
  const hiddenCount = fallacyItems.length - 1;
  
  const premiumMessage = `
    <li class="opacity-60 cursor-not-allowed flex items-center">
      <span class="mr-2">🔒</span>
      <span>(${hiddenCount} other fallacies hidden – <a href="/pricing" class="text-port-500 hover:text-port-600 font-medium">Upgrade</a> to see full breakdown)</span>
    </li>
  `;
  
  // Replace the original list with our modified version
  // Find the first <ul> tag and its content
  const ulMatch = modifiedContent.match(/<ul>([\s\S]*?)<\/ul>/);
  
  if (ulMatch && ulMatch[0]) {
    modifiedContent = modifiedContent.replace(
      ulMatch[0],
      `<ul>${firstFallacy}${premiumMessage}</ul>`
    );
  }
  
  return modifiedContent;
};

export function ArgumentAnalyzer({ initialArgument = '' }: { initialArgument?: string }) {
  const [argument, setArgument] = useState(initialArgument);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [argumentScores, setArgumentScores] = useState<{[key: number]: number}>({});
  const [userLevel, setUserLevel] = useState<number>(1);
  const [userXp, setUserXp] = useState<number>(0);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_analysis',
      name: 'First Steps',
      description: 'Submit your first argument for analysis',
      icon: <Target className="h-5 w-5 text-blue-500" />,
      unlocked: false
    },
    {
      id: 'skilled_rating',
      name: 'Logical Thinker',
      description: 'Achieve a "Skilled" rating or higher',
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      unlocked: false
    },
    {
      id: 'master_rating',
      name: 'Master Debater',
      description: 'Achieve the highest "Master Debater" rating',
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
      unlocked: false
    },
    {
      id: 'three_analyses',
      name: 'Consistent Analyzer',
      description: 'Analyze three or more arguments',
      icon: <Zap className="h-5 w-5 text-purple-500" />,
      unlocked: false
    }
  ]);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Add a new state for streaming response
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  // Create a stable reference to the analyzeArgument function
  const analyzeArgumentRef = useRef<() => Promise<void>>();

  // Load existing messages from session storage
  useEffect(() => {
    const storedMessages = sessionStorage.getItem(MESSAGES_KEY);
    
    if (storedMessages) {
      // Check if the session has expired
      const lastMessage = JSON.parse(storedMessages)[0];
      const lastTimestamp = lastMessage?.timestamp || 0;
      const isExpired = Date.now() - lastTimestamp > SESSION_TIMEOUT;
      
      if (isExpired) {
        // Clear expired session
        sessionStorage.removeItem(MESSAGES_KEY);
        console.log('Session expired, starting new conversation');
      } else {
        setMessages(JSON.parse(storedMessages));
      }
    }

    // Check if it's the first time the user is visiting
    const isFirstTimeUser = sessionStorage.getItem(FIRST_TIME_USER_KEY) !== 'false';
    if (isFirstTimeUser) {
      setShowTutorial(true);
      sessionStorage.setItem(FIRST_TIME_USER_KEY, 'false');
    }
  }, []);

  // Save messages to session storage when they change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to results when new analysis is added
  useEffect(() => {
    if (messages.length > 0 && !isAnalyzing && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAnalyzing]);

  const triggerConfetti = useCallback(() => {
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, []);
  
  const updateAchievements = useCallback((score: number) => {
    const newAchievements = [...achievements];
    let achievementUnlocked = false;
    
    // First analysis achievement
    if (!newAchievements[0].unlocked) {
      newAchievements[0].unlocked = true;
      achievementUnlocked = true;
    }
    
    // Skilled rating achievement
    if (!newAchievements[1].unlocked && score >= 70) {
      newAchievements[1].unlocked = true;
      achievementUnlocked = true;
    }
    
    // Master rating achievement
    if (!newAchievements[2].unlocked && score >= 90) {
      newAchievements[2].unlocked = true;
      achievementUnlocked = true;
    }
    
    // Three analyses achievement
    if (!newAchievements[3].unlocked && messages.filter(m => m.role === 'assistant').length >= 2) {
      newAchievements[3].unlocked = true;
      achievementUnlocked = true;
    }
    
    if (achievementUnlocked) {
      triggerConfetti();
      setAchievements(newAchievements);
    }
    
    // Update XP and level
    const newXp = userXp + Math.floor(score / 2);
    setUserXp(newXp);
    
    // Level up if XP reaches threshold (100 XP per level)
    if (Math.floor(newXp / 100) > userLevel - 1) {
      setUserLevel(Math.floor(newXp / 100) + 1);
      triggerConfetti();
    }
  }, [achievements, messages, userXp, userLevel, triggerConfetti]);

  const analyzeArgument = async () => {
    if (!argument.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an argument to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setStreamingResponse(''); // Clear any previous streaming response
    setIsStreaming(true);

    // Add user message to the conversation
    const userMessage: Message = {
      role: 'user',
      content: argument,
      timestamp: Date.now()
    };
    
    setMessages(prev => [userMessage, ...prev]);
    
    try {
      console.log('Starting analysis request from client');
      console.log(`Argument length: ${argument.length} characters`);
      console.log(`User agent: ${navigator.userAgent}`);
      
      // Make the fetch request with streaming
      const response = await fetch('/api/mistral-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ argument }),
      });

      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        // Handle error responses
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText };
        }
        
        // Handle specific error cases
        if (response.status === 429) {
          setError('API usage limit reached. Please try again later.');
          toast({
            title: 'Service Temporarily Unavailable',
            description: errorData.message || 'API usage limit reached. Please try again later.',
            variant: 'destructive',
            duration: 5000,
          });
          setIsAnalyzing(false);
          setIsStreaming(false);
          return;
        }
        
        if (response.status === 401) {
          setError('Authentication error. Please check API configuration.');
          toast({
            title: 'Authentication Error',
            description: errorData.message || 'There was an issue with our API authentication.',
            variant: 'destructive',
          });
          setIsAnalyzing(false);
          setIsStreaming(false);
          return;
        }
        
        setError(errorData.error || errorData.message || 'Failed to analyze argument');
        throw new Error(errorData.error || errorData.message || 'Failed to analyze argument');
      }

      // Process the streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }
      
      const decoder = new TextDecoder();
      let accumulatedResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Decode the chunk and append to accumulated response
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;
        
        // Update the streaming response state
        setStreamingResponse(accumulatedResponse);
      }
      
      console.log('Successfully received complete analysis response');
      
      // Add assistant response to the conversation
      const assistantMessage: Message = {
        role: 'assistant',
        content: accumulatedResponse,
        timestamp: Date.now()
      };
      
      setMessages(prev => [assistantMessage, ...prev]);
      
      // Calculate score and update achievements
      const score = calculateArgumentScore(accumulatedResponse);
      setArgumentScores(prev => ({
        ...prev,
        [assistantMessage.timestamp]: score
      }));
      
      updateAchievements(score);
      
      // Clear the input if analysis was successful
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
      
    } catch (error: any) {
      console.error('Error analyzing argument:', error);
      setError(error.message || 'An error occurred while analyzing your argument');
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while analyzing your argument',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
      setIsStreaming(false);
    }
  };

  // Update the ref whenever analyzeArgument changes
  useEffect(() => {
    analyzeArgumentRef.current = analyzeArgument;
  }, [analyzeArgument]);

  // Set initial argument from prop if provided
  useEffect(() => {
    if (initialArgument && initialArgument.trim() !== '') {
      setArgument(initialArgument);
      // Automatically analyze the argument if it's provided via URL
      if (initialArgument.trim().length > 10) {
        // Use setTimeout to ensure the component is fully mounted
        setTimeout(() => {
          if (analyzeArgumentRef.current) {
            analyzeArgumentRef.current();
          }
        }, 100);
      }
    }
  }, [initialArgument]); // No need for eslint-disable-line since we're not using analyzeArgument directly

  const clearInput = () => {
    setArgument('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const nextTutorialStep = () => {
    if (tutorialStep < 3) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      setTutorialStep(0);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Render a message with sections
  const renderMessage = (message: Message, index: number) => {
    if (message.role === 'user') {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700 bg-port-50 dark:bg-port-900/20 px-6 py-3">
            <h3 className="text-base font-semibold text-port-700 dark:text-port-300">
              Submitted Argument
            </h3>
          </div>
          <div className="px-6 py-5">
            <div 
              className="prose dark:prose-invert max-w-none text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br/>') }}
            />
          </div>
        </motion.div>
      );
    } else {
      // Parse the assistant's response into sections
      const sections = formatResponse(message.content);
      const hasRevisedArgument = sections['Revised Argument'];
      const score = argumentScores[message.timestamp] || 0;
      const rating = getRatingFromScore(score);
      
      if (hasRevisedArgument) {
        // Two-column layout with revised argument on the right
      return (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm mt-6"
        >
            <div className="border-b border-gray-200 dark:border-gray-700 bg-port-50 dark:bg-port-900/30 px-4 py-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-port-700 dark:text-port-300 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Feedback
            </h3>
                
                {/* Argument Rating Badge */}
                <Badge className={`${getBgColorForRating(getRatingFromScore(argumentScores[message.timestamp] || 0))} ${getColorForRating(getRatingFromScore(argumentScores[message.timestamp] || 0))} px-3 py-1 text-sm font-medium flex items-center gap-1.5`}>
                  {getRatingFromScore(argumentScores[message.timestamp] || 0) === 'Master Debater' && <Trophy className="h-4 w-4" />}
                  {getRatingFromScore(argumentScores[message.timestamp] || 0) === 'Advanced' && <Star className="h-4 w-4" />}
                  {getRatingFromScore(argumentScores[message.timestamp] || 0) === 'Skilled' && <Award className="h-4 w-4" />}
                  {getRatingFromScore(argumentScores[message.timestamp] || 0)}
                </Badge>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between items-center text-sm mb-1.5">
                  <span className="text-gray-500 dark:text-gray-400">Argument Score</span>
                  <span className="font-medium">{argumentScores[message.timestamp] || 0}/100</span>
                </div>
                <Progress value={argumentScores[message.timestamp] || 0} className="h-2" />
              </div>
              
            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Structured analysis of your argument
              </p>
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => exportAsPDF(message.content)}
                        aria-label="Export as PDF"
                        className="border-port-200 hover:bg-port-50"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export as PDF</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => shareAnalysis(message.content)}
                        aria-label="Share analysis"
                        className="border-port-200 hover:bg-port-50"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share analysis</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Revised Argument First */}
                <div className="border rounded-md bg-green-50 dark:bg-green-900/10 overflow-hidden">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <h3 className="text-base font-semibold text-green-700 dark:text-green-300">Revised Argument</h3>
                  </div>
                  <div className="p-4">
                    <div 
                      className="prose dark:prose-invert max-w-none text-base leading-relaxed system-generated-content"
                      dangerouslySetInnerHTML={{ __html: sections['Revised Argument'] }}
                    />
                  </div>
                </div>
                
                {/* Analysis Sections */}
                <div className="space-y-4">
            <Tabs defaultValue="sections" className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                <TabsTrigger 
                  value="sections" 
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-port-700 dark:data-[state=active]:text-port-300 data-[state=active]:shadow-sm py-2 transition-all"
                >
                  Sectioned View
                </TabsTrigger>
                <TabsTrigger 
                  value="full"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-port-700 dark:data-[state=active]:text-port-300 data-[state=active]:shadow-sm py-2 transition-all"
                >
                  Full Analysis
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="sections" className="space-y-4 mt-2">
                      {Object.entries(sections)
                        .filter(([sectionName]) => sectionName !== 'Revised Argument')
                        .map(([sectionName, sectionContent], sectionIndex) => {
                  const sectionId = `${message.timestamp}-${sectionName}`;
                  const isExpanded = expandedSections[sectionId] !== false; // Default to expanded
                  
                  return (
                    <Collapsible 
                      key={sectionIndex} 
                      open={isExpanded}
                      onOpenChange={() => toggleSection(sectionId)}
                      className="border rounded-md overflow-hidden"
                    >
                      <CollapsibleTrigger asChild>
                                <div className={`p-3 flex justify-between items-center cursor-pointer transition-colors ${
                          sectionName === 'Logical Structure' ? 
                          'bg-port-100 dark:bg-port-900/30 hover:bg-port-200 dark:hover:bg-port-900/50' : 
                          sectionName === 'Fallacies' ?
                          'bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20' :
                          sectionName === 'Strength' ?
                          'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20' :
                                  sectionName === 'Improvements' ?
                          'bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20' :
                          'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}>
                          <CardTitle className="text-base font-medium flex items-center">
                            {sectionName === 'Fallacies' && <XCircle className="h-5 w-5 mr-2 text-red-500" />}
                            {sectionName === 'Strength' && <Info className="h-5 w-5 mr-2 text-blue-500" />}
                            {sectionName === 'Improvements' && <CheckCircle className="h-5 w-5 mr-2 text-green-500" />}
                            {sectionName === 'Logical Structure' && <Info className="h-5 w-5 mr-2 text-purple-500" />}
                            {modifyFallaciesSectionTitle(sectionName)}
                          </CardTitle>
                          {isExpanded ? 
                                    <div className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                              <Minimize2 className="h-5 w-5 text-port-500 dark:text-port-300" />
                            </div> 
                            : 
                                    <div className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                              <Maximize2 className="h-5 w-5 text-port-500 dark:text-port-300" />
                            </div>
                          }
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                                <CardContent className={`py-4 px-5 bg-white dark:bg-gray-900 ${
                          sectionName === 'Logical Structure' ? 
                          'bg-port-50/50 dark:bg-port-900/10 border-l-2 border-port-300 dark:border-port-700' : 
                          sectionName === 'Fallacies' ?
                          'bg-red-50/50 dark:bg-red-900/5 border-l-2 border-red-300 dark:border-red-700' :
                          sectionName === 'Strength' ?
                          'bg-blue-50/50 dark:bg-blue-900/5 border-l-2 border-blue-300 dark:border-blue-700' :
                                  sectionName === 'Improvements' ?
                          'bg-green-50/50 dark:bg-green-900/5 border-l-2 border-green-300 dark:border-green-700' :
                          ''
                        }`}>
                          <div 
                            className="prose dark:prose-invert max-w-none text-base leading-relaxed system-generated-content"
                            dangerouslySetInnerHTML={{ 
                              __html: sectionName === 'Fallacies' 
                                ? modifyFallaciesForFreeTier(sectionContent) 
                                : sectionContent 
                            }}
                          />
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </TabsContent>
              
              <TabsContent value="full" className="mt-4">
                <Card className="border border-gray-200 dark:border-gray-700">
                        <CardContent className="py-4 px-5">
                    <div 
                      className="prose dark:prose-invert max-w-none text-base leading-relaxed system-generated-content"
                      dangerouslySetInnerHTML={{ __html: formatMarkdownText(message.content) }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
                </div>
              </div>
            </div>
          </motion.div>
        );
      } else {
        // If there's no revised argument, use the original layout with added rating
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm mb-8"
          >
            <div className="border-b border-gray-200 dark:border-gray-700 bg-port-50 dark:bg-port-900/20 px-6 py-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-port-700 dark:text-port-300">
                  AI Analysis
                </h3>
                
                {/* Argument Rating Badge */}
                <Badge className={`${getBgColorForRating(getRatingFromScore(argumentScores[message.timestamp] || 0))} ${getColorForRating(getRatingFromScore(argumentScores[message.timestamp] || 0))} px-3 py-1 text-sm font-medium flex items-center gap-1.5`}>
                  {getRatingFromScore(argumentScores[message.timestamp] || 0) === 'Master Debater' && <Trophy className="h-4 w-4" />}
                  {getRatingFromScore(argumentScores[message.timestamp] || 0) === 'Advanced' && <Star className="h-4 w-4" />}
                  {getRatingFromScore(argumentScores[message.timestamp] || 0) === 'Skilled' && <Award className="h-4 w-4" />}
                  {getRatingFromScore(argumentScores[message.timestamp] || 0)}
                </Badge>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between items-center text-sm mb-1.5">
                  <span className="text-gray-500 dark:text-gray-400">Argument Score</span>
                  <span className="font-medium">{argumentScores[message.timestamp] || 0}/100</span>
                </div>
                <Progress value={argumentScores[message.timestamp] || 0} className="h-2" />
              </div>
            </div>
            <div className="px-6 py-5">
              <div 
                className="prose dark:prose-invert max-w-none text-base leading-relaxed system-generated-content"
                dangerouslySetInnerHTML={{ __html: formatMarkdownText(message.content) }}
              />
          </div>
        </motion.div>
      );
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Section - Moved to the top */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <Card className="border-2 border-port-200 dark:border-port-900 h-full flex flex-col">
            <CardHeader className="pb-2 bg-port-50 dark:bg-port-900/30">
              <CardTitle className="text-xl flex items-center text-port-700 dark:text-port-300">
                Enter Your Argument
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-5 w-5 ml-2 text-port-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Type your argument here. The AI will analyze its logical structure, identify fallacies, and suggest improvements.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enhance your reasoning with AI-powered analysis of logical structure, fallacies, and improvements.
              </p>
            </CardHeader>
            <CardContent className="flex-grow">
              <Textarea
                ref={textareaRef}
                placeholder="Enter your argument here... For example: 'The government should not regulate artificial intelligence, because technological progress has always been driven by free-market competition, not government intervention.'"
                value={argument}
                onChange={(e) => setArgument(e.target.value)}
                className="min-h-[200px] h-full text-base resize-y focus:border-port-500 focus:ring-port-500"
                disabled={isAnalyzing}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    analyzeArgument();
                  }
                }}
                aria-label="Argument input"
              />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-0">
              <Button
                onClick={analyzeArgument}
                disabled={isAnalyzing}
                className="w-full sm:w-auto text-base py-5 rounded-full bg-port-500 hover:bg-port-600 text-white"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-white" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    Analyze Argument
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <Button
                onClick={clearInput}
                disabled={isAnalyzing || !argument}
                variant="outline"
                className="w-full sm:w-auto text-base rounded-full border-port-500 text-port-500 hover:bg-port-50"
                size="lg"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear Input
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Results Section */}
      {messages.length > 0 && (
        <div ref={resultsRef} className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Analysis Results</h2>
          
          {/* Streaming response display */}
          {isStreaming && streamingResponse && (
            <div className="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
              <div className="flex items-center mb-4">
                <Loader2 className="h-5 w-5 mr-2 animate-spin text-port-500" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Live Analysis</h3>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                {formatMarkdownText(streamingResponse)}
              </div>
            </div>
          )}
          
          {/* Display the most recent analysis */}
          {!isStreaming && messages.length > 0 && messages[0].role === 'user' && messages.length > 1 && messages[1].role === 'assistant' && (
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-gray-800 dark:text-white">Argument Metrics</h3>
              
              {/* Dynamic Dashboard based on the latest analysis */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <Brain className="h-5 w-5 mr-2 text-blue-600 dark:text-port-400" />
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Argument Strength</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-port-400">
                      {argumentScores[messages[1].timestamp] || Math.floor(Math.random() * 31) + 60}/100
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-5 w-5 mr-2 text-amber-600 dark:text-port-400" />
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Rating</h3>
                    </div>
                    <p className="text-3xl font-bold text-amber-600 dark:text-port-400">
                      {getRatingFromScore(argumentScores[messages[1].timestamp] || 70)}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <Award className="h-5 w-5 mr-2 text-purple-600 dark:text-port-400" />
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Experience</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-600 dark:text-port-400">
                      Level {userLevel}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="h-2 rounded-full bg-purple-600 dark:bg-port-400"
                        style={{ width: `${(userXp % 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Conversation history */}
          <div className="space-y-6">
            {messages.slice().reverse().map((message, index) => {
              if (message.role === 'user') {
                return renderMessage(message, index);
              } else {
                // Parse the assistant's response into sections
                const sections = formatResponse(message.content);
                const hasRevisedArgument = sections['Revised Argument'];
                
                if (hasRevisedArgument) {
                  // Two-column layout with revised argument on the right
                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm mt-6"
                    >
                      <div className="border-b border-gray-200 dark:border-gray-700 bg-port-50 dark:bg-port-900/30 px-4 py-3">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-port-700 dark:text-port-300 flex items-center">
                            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                            Feedback
                          </h3>
                          
                          {/* Argument Rating Badge */}
                          <Badge className={`${getBgColorForRating(getRatingFromScore(argumentScores[message.timestamp] || 0))} ${getColorForRating(getRatingFromScore(argumentScores[message.timestamp] || 0))} px-3 py-1 text-sm font-medium flex items-center gap-1.5`}>
                            {getRatingFromScore(argumentScores[message.timestamp] || 0) === 'Master Debater' && <Trophy className="h-4 w-4" />}
                            {getRatingFromScore(argumentScores[message.timestamp] || 0) === 'Advanced' && <Star className="h-4 w-4" />}
                            {getRatingFromScore(argumentScores[message.timestamp] || 0) === 'Skilled' && <Award className="h-4 w-4" />}
                            {getRatingFromScore(argumentScores[message.timestamp] || 0)}
                          </Badge>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex justify-between items-center text-sm mb-1.5">
                            <span className="text-gray-500 dark:text-gray-400">Argument Score</span>
                            <span className="font-medium">{argumentScores[message.timestamp] || 0}/100</span>
                          </div>
                          <Progress value={argumentScores[message.timestamp] || 0} className="h-2" />
                        </div>
                        
                        <div className="flex justify-between items-center mt-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Structured analysis of your argument
                          </p>
                          <div className="flex space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => exportAsPDF(message.content)}
                                    aria-label="Export as PDF"
                                    className="border-port-200 hover:bg-port-50"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Export as PDF</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => shareAnalysis(message.content)}
                                    aria-label="Share analysis"
                                    className="border-port-200 hover:bg-port-50"
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Share analysis</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="grid grid-cols-1 gap-4">
                          {/* Revised Argument First */}
                          <div className="border rounded-md bg-green-50 dark:bg-green-900/10 overflow-hidden">
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 flex items-center">
                              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                              <h3 className="text-base font-semibold text-green-700 dark:text-green-300">Revised Argument</h3>
                            </div>
                            <div className="p-4">
                              <div 
                                className="prose dark:prose-invert max-w-none text-base leading-relaxed system-generated-content"
                                dangerouslySetInnerHTML={{ __html: sections['Revised Argument'] }}
                              />
                            </div>
                          </div>
                          
                          {/* Analysis Sections */}
                          <div className="space-y-4">
                            <Tabs defaultValue="sections" className="w-full">
                              <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                                <TabsTrigger 
                                  value="sections" 
                                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-port-700 dark:data-[state=active]:text-port-300 data-[state=active]:shadow-sm py-2 transition-all"
                                >
                                  Sectioned View
                                </TabsTrigger>
                                <TabsTrigger 
                                  value="full"
                                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-port-700 dark:data-[state=active]:text-port-300 data-[state=active]:shadow-sm py-2 transition-all"
                                >
                                  Full Analysis
                                </TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="sections" className="space-y-4 mt-2">
                                {Object.entries(sections)
                                  .filter(([sectionName]) => sectionName !== 'Revised Argument')
                                  .map(([sectionName, sectionContent], sectionIndex) => {
                                    const sectionId = `${message.timestamp}-${sectionName}`;
                                    const isExpanded = expandedSections[sectionId] !== false; // Default to expanded
                                    
                                    return (
                                      <Collapsible 
                                        key={sectionIndex} 
                                        open={isExpanded}
                                        onOpenChange={() => toggleSection(sectionId)}
                                        className="border rounded-md overflow-hidden"
                                      >
                                        <CollapsibleTrigger asChild>
                                          <div className={`p-3 flex justify-between items-center cursor-pointer transition-colors ${
                                            sectionName === 'Logical Structure' ? 
                                            'bg-port-100 dark:bg-port-900/30 hover:bg-port-200 dark:hover:bg-port-900/50' : 
                                            sectionName === 'Fallacies' ?
                                            'bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20' :
                                            sectionName === 'Strength' ?
                                            'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20' :
                                            sectionName === 'Improvements' ?
                                            'bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20' :
                                            'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                          }`}>
                                            <CardTitle className="text-base font-medium flex items-center">
                                              {sectionName === 'Fallacies' && <XCircle className="h-5 w-5 mr-2 text-red-500" />}
                                              {sectionName === 'Strength' && <Info className="h-5 w-5 mr-2 text-blue-500" />}
                                              {sectionName === 'Improvements' && <CheckCircle className="h-5 w-5 mr-2 text-green-500" />}
                                              {sectionName === 'Logical Structure' && <Info className="h-5 w-5 mr-2 text-purple-500" />}
                                              {modifyFallaciesSectionTitle(sectionName)}
                                            </CardTitle>
                                            {isExpanded ? 
                                              <div className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                <Minimize2 className="h-5 w-5 text-port-500 dark:text-port-300" />
                                              </div> 
                                              : 
                                              <div className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                <Maximize2 className="h-5 w-5 text-port-500 dark:text-port-300" />
                                              </div>
                                            }
                                          </div>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                          <CardContent className={`py-4 px-5 bg-white dark:bg-gray-900 ${
                                            sectionName === 'Logical Structure' ? 
                                            'bg-port-50/50 dark:bg-port-900/10 border-l-2 border-port-300 dark:border-port-700' : 
                                            sectionName === 'Fallacies' ?
                                            'bg-red-50/50 dark:bg-red-900/5 border-l-2 border-red-300 dark:border-red-700' :
                                            sectionName === 'Strength' ?
                                            'bg-blue-50/50 dark:bg-blue-900/5 border-l-2 border-blue-300 dark:border-blue-700' :
                                            sectionName === 'Improvements' ?
                                            'bg-green-50/50 dark:bg-green-900/5 border-l-2 border-green-300 dark:border-green-700' :
                                            ''
                                          }`}>
                                            <div 
                                              className="prose dark:prose-invert max-w-none text-base leading-relaxed system-generated-content"
                                              dangerouslySetInnerHTML={{ 
                                                __html: sectionName === 'Fallacies' 
                                                  ? modifyFallaciesForFreeTier(sectionContent) 
                                                  : sectionContent 
                                              }}
                                            />
                                          </CardContent>
                                        </CollapsibleContent>
                                      </Collapsible>
                                    );
                                  })}
                              </TabsContent>
                              
                              <TabsContent value="full" className="mt-4">
                                <Card className="border border-gray-200 dark:border-gray-700">
                                  <CardContent className="py-4 px-5">
                                    <div 
                                      className="prose dark:prose-invert max-w-none text-base leading-relaxed system-generated-content"
                                      dangerouslySetInnerHTML={{ __html: formatMarkdownText(message.content) }}
                                    />
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                } else {
                  // If there's no revised argument, use the original layout with added rating
                  return renderMessage(message, index);
                }
              }
            })}
          </div>
        </div>
      )}

      {/* Tutorial overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTutorial(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Welcome to Argument Analyzer!</h3>
              
              {tutorialStep === 0 && (
                <div className="space-y-4">
                  <p>This tool helps you analyze arguments for logical fallacies and improve your reasoning.</p>
                  <img 
                    src="/tutorial-1.png" 
                    alt="Tutorial illustration" 
                    className="rounded-md w-full h-auto object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {tutorialStep === 1 && (
                <div className="space-y-4">
                  <p>Enter your argument in the text box and click "Analyze Argument" to get started.</p>
                </div>
              )}
              
              {tutorialStep === 2 && (
                <div className="space-y-4">
                  <p>The AI will break down your argument into sections, identifying strengths, weaknesses, and suggestions for improvement.</p>
                </div>
              )}
              
              {tutorialStep === 3 && (
                <div className="space-y-4">
                  <p>You can export your analysis as a PDF or share it directly. Your conversations are only stored for this session.</p>
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setShowTutorial(false)}>
                  Skip Tutorial
                </Button>
                <Button onClick={nextTutorialStep}>
                  {tutorialStep < 3 ? 'Next' : 'Get Started'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 