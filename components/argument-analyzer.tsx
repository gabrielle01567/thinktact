'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, AlertCircle, Send, CheckCircle, XCircle, Info, 
  HelpCircle, Download, Share2, Lightbulb, MessageSquare, 
  ArrowRight, RefreshCw, Maximize2, Minimize2, Brain, Trophy, Star, Award, TrendingUp, Zap, Target
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

export function ArgumentAnalyzer() {
  const [argument, setArgument] = useState('');
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
      
      const response = await fetch('/api/mistral-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ argument }),
      });

      console.log(`Response status: ${response.status}`);
      
      // Try to get the response text first for debugging
      const responseText = await response.text();
      console.log(`Raw response: ${responseText}`);
      
      // Parse the JSON response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error(`Failed to parse response: ${responseText}`);
      }

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 429) {
          setError('API usage limit reached. Please try again later.');
          toast({
            title: 'Service Temporarily Unavailable',
            description: data.message || 'API usage limit reached. Please try again later.',
            variant: 'destructive',
            duration: 5000,
          });
          return;
        }
        
        if (response.status === 401) {
          setError('Authentication error. Please check API configuration.');
          toast({
            title: 'Authentication Error',
            description: data.message || 'There was an issue with our API authentication.',
            variant: 'destructive',
          });
          return;
        }
        
        setError(data.error || data.message || 'Failed to analyze argument');
        throw new Error(data.error || data.message || 'Failed to analyze argument');
      }

      console.log('Successfully received analysis response');
      
      // Add assistant response to the conversation
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: Date.now()
      };
      
      // Calculate score and update achievements
      const score = calculateArgumentScore(data.response);
      setArgumentScores(prev => ({...prev, [assistantMessage.timestamp]: score}));
      updateAchievements(score);
      
      setMessages(prev => [assistantMessage, ...prev]);
      
      // Clear the input field after successful submission
      setArgument('');
      
      toast({
        title: 'Analysis Complete',
        description: 'Your argument has been analyzed by our AI assistant.',
      });

      // Initialize all sections as expanded for the new message
      const sections = formatResponse(data.response);
      const newExpandedSections: {[key: string]: boolean} = {};
      Object.keys(sections).forEach(section => {
        newExpandedSections[`${assistantMessage.timestamp}-${section}`] = true;
      });
      setExpandedSections(prev => ({...prev, ...newExpandedSections}));
    } catch (error) {
      console.error('Error in analyzeArgument:', error);
      
      // Display a more detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze argument';
      setError(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
        duration: 10000, // Show for longer to ensure it's seen
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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
                            {sectionName === 'Logical Structure' ? 
                              <span className="font-semibold text-port-700 dark:text-port-300">{sectionName}</span> : 
                              sectionName === 'Fallacies' ?
                              <span className="font-semibold text-red-700 dark:text-red-300">{sectionName}</span> :
                              sectionName === 'Strength' ?
                              <span className="font-semibold text-blue-700 dark:text-port-300">{sectionName}</span> :
                                      sectionName === 'Improvements' ?
                              <span className="font-semibold text-green-700 dark:text-green-300">{sectionName}</span> :
                              sectionName
                            }
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
                            dangerouslySetInnerHTML={{ __html: sectionContent }}
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
    <div className="space-y-6 max-w-full mx-auto px-2 sm:px-4">
      {/* User Profile & Progress Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-port-100 dark:bg-port-900 flex items-center justify-center text-port-500 dark:text-port-300 text-lg font-bold">
              {userLevel}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-port-500 text-white text-xs flex items-center justify-center font-medium">
              {userLevel}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Argument Level {userLevel}</h3>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-port-500 rounded-full" 
                  style={{ width: `${(userXp % 100)}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{userXp % 100}/100 XP</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          {achievements.map((achievement) => (
            <TooltipProvider key={achievement.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-port-100 dark:bg-port-900/50' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <div className={achievement.unlocked ? '' : 'opacity-30'}>
                      {achievement.icon}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-medium">{achievement.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                    <p className="text-xs font-medium">{achievement.unlocked ? 'Unlocked!' : 'Locked'}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main layout - horizontal on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
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
              placeholder="Enter your argument here... For example: 'All humans are mortal. Socrates is human. Therefore, Socrates is mortal.'"
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
        
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Press Ctrl+Enter to analyze. Your conversation will be maintained for this session only and is not permanently stored.
        </p>
      </motion.div>

        {/* Results Section */}
        <div className="lg:h-[calc(100vh-200px)] overflow-y-auto">
      {/* Conversation History with inline loader */}
      {(messages.length > 0 || isAnalyzing) && (
            <div ref={resultsRef} className="space-y-6 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-sm h-full">
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-port-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
                <h2 className="text-xl font-bold text-port-700 dark:text-port-300">Analysis Document</h2>
          </div>
          
          {/* Inline loader */}
          {isAnalyzing && (
            <div className="flex flex-col items-center py-8 px-4 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/30 mb-6">
              <div className="flex items-center mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-port-500 mr-3" />
                <p className="text-lg font-medium text-port-700 dark:text-port-300">Analyzing your argument...</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">This may take a few seconds</p>
            </div>
          )}
          
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
                                                {sectionName === 'Logical Structure' ? 
                                                  <span className="font-semibold text-port-700 dark:text-port-300">{sectionName}</span> : 
                                                  sectionName === 'Fallacies' ?
                                                  <span className="font-semibold text-red-700 dark:text-red-300">{sectionName}</span> :
                                                  sectionName === 'Strength' ?
                                                  <span className="font-semibold text-blue-700 dark:text-port-300">{sectionName}</span> :
                                                  sectionName === 'Improvements' ?
                                                  <span className="font-semibold text-green-700 dark:text-green-300">{sectionName}</span> :
                                                  sectionName
                                                }
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
                                                dangerouslySetInnerHTML={{ __html: sectionContent }}
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
      )}
          
          {/* Empty state when no results */}
          {!messages.length && !isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-900/30">
              <Brain className="h-16 w-16 text-port-300 dark:text-port-700 mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Analysis Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Enter your argument in the input field and click "Analyze Argument" to see the results here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tutorial Modal */}
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