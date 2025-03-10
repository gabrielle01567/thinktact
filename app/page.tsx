"use client";

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Brain, Shield, Zap, CheckCircle, FileText, BookOpen, Expand, Search, CheckSquare, Lightbulb, Settings, Info, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WaitlistForm } from "@/components/waitlist-form"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Solid Background */}
      <section className="relative h-[95vh] overflow-hidden bg-port-900">
        {/* Tiger GIF Background with improved quality */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <div className="absolute inset-0">
            <Image
              src="/20250306_2050_Regal Tiger Witness_simple_compose_01jnq4r965f438565sm7jn2n4m.gif"
              alt="Tiger Background"
              fill
              priority
              unoptimized
              style={{
                objectFit: 'cover',
                opacity: 0.3,
                filter: 'contrast(1.05) brightness(0.95)'
              }}
            />
          </div>
        </div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 z-10">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat"></div>
        </div>
        
        {/* Content */}
        <div className="container relative z-30 flex flex-col items-center justify-center h-full text-center text-white">
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl mb-8 text-white">
            Master the Art of Logical Reasoning
          </h1>
          <p className="max-w-2xl mx-auto text-xl mb-8 text-white font-light">
            Elevate your argumentation skills with AI-powered analysis and training. Perfect for lawyers, students, and professionals who rely on clear logical thinking.
          </p>
          
          {/* New Argument Input Box */}
          <div className="w-full max-w-2xl mx-auto mb-10 bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 shadow-xl">
            <form 
              className="flex flex-col space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                const argument = formData.get('argument')?.toString() || '';
                window.location.href = `/analyze?argument=${encodeURIComponent(argument)}`;
              }}
            >
              <label htmlFor="argument" className="text-left text-white text-lg font-medium">
                Enter your argument:
              </label>
              <textarea
                id="argument"
                name="argument"
                rows={4}
                className="w-full p-3 rounded-md border border-white/30 bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-port-300 focus:border-transparent"
                placeholder="The government should not regulate artificial intelligence, because technological progress has always been driven by free-market competition, not government intervention."
                required
              ></textarea>
              <button
                type="submit"
                className="w-full py-3 px-6 bg-white text-port-900 font-medium rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Analyze Argument <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>
          
          <div className="mt-12 bg-gradient-to-r from-port-800/90 via-port-700/90 to-port-800/90 px-8 py-5 rounded-lg inline-block shadow-lg border border-port-600/30">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-port-300" />
                <span className="text-lg text-white font-medium">Patent Buddy launching May 10, 2025</span>
              </div>
              <div className="h-5 w-px bg-port-600/50 hidden sm:block"></div>
              <Link 
                href="/waitlist" 
                className="flex items-center text-port-200 hover:text-white transition-colors font-medium"
              >
                <span>Join the waitlist</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 md:py-32 bg-white dark:bg-gray-900">
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-port-900 to-transparent dark:from-gray-950 z-10" />
        <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-20">
          <div className="flex flex-col items-center justify-center space-y-12 text-center">
            <div className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl font-semibold tracking-wide sm:text-4xl md:text-5xl text-port-500 dark:text-port-300">
                How Our Analysis Works
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-850 md:text-xl dark:text-gray-300 font-light">
                Advanced AI-powered analysis to strengthen your logical reasoning and argumentation
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
              <div className="flex flex-col items-center space-y-5 p-8 border border-port-200 dark:border-port-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 rounded-full bg-port-100 dark:bg-port-900/30">
                  <Search className="h-7 w-7 text-port-500 dark:text-port-300" />
                </div>
                <h3 className="text-2xl font-medium text-gray-850 dark:text-white">Logical Analysis</h3>
                <p className="text-gray-750 dark:text-gray-300 text-center text-lg">
                  Deep examination of your argument's structure, identifying premises, conclusions, and logical connections.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-5 p-8 border border-port-200 dark:border-port-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 rounded-full bg-port-100 dark:bg-port-900/30">
                  <CheckSquare className="h-7 w-7 text-port-500 dark:text-port-300" />
                </div>
                <h3 className="text-2xl font-medium text-gray-850 dark:text-white">Fallacy Detection</h3>
                <p className="text-gray-750 dark:text-gray-300 text-center text-lg">
                  Identify potential logical fallacies and weaknesses in reasoning, with clear explanations and improvement suggestions.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-5 p-8 border border-port-200 dark:border-port-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 rounded-full bg-port-100 dark:bg-port-900/30">
                  <Lightbulb className="h-7 w-7 text-port-500 dark:text-port-300" />
                </div>
                <h3 className="text-2xl font-medium text-gray-850 dark:text-white">Argument Strengthening</h3>
                <p className="text-gray-750 dark:text-gray-300 text-center text-lg">
                  Receive targeted suggestions to reinforce your arguments and make them more logically sound and persuasive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 md:py-32 bg-port-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center space-y-12 text-center">
            <div className="space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-wide sm:text-4xl md:text-5xl text-port-500 dark:text-port-300">
                Key Features
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl dark:text-gray-300 font-light">
                Everything you need to build rock-solid arguments
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 w-full">
              <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-port-100 dark:border-port-800">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-port-500 dark:text-port-300 mr-2" />
                  <h3 className="text-xl font-medium">Argument Structure Analysis</h3>
                </div>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-port-500 mr-2" />
                    <span>Premise identification</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-port-500 mr-2" />
                    <span>Logical flow mapping</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-port-500 mr-2" />
                    <span>Conclusion validation</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-port-100 dark:border-port-800">
                <div className="flex items-center mb-4">
                  <Brain className="h-6 w-6 text-port-500 dark:text-port-300 mr-2" />
                  <h3 className="text-xl font-medium">Reasoning Enhancement</h3>
                </div>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-port-500 mr-2" />
                    <span>Fallacy detection and fixes</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-port-500 mr-2" />
                    <span>Evidence strengthening tips</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-port-500 mr-2" />
                    <span>Counterargument analysis</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-port-100 dark:border-port-800">
                <div className="flex items-center mb-4">
                  <Brain className="h-6 w-6 text-port-500 dark:text-port-300 mr-2" />
                  <h3 className="text-xl font-medium">Advanced Logic Tools</h3>
                </div>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-port-500 mr-2" />
                    <span>Syllogism validation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-port-500 mr-2" />
                    <span>Assumption identification</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-port-500 mr-2" />
                    <span>Logical consistency checks</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 bg-white dark:bg-gray-900">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-port-200 dark:via-port-800 to-transparent" />
        <div className="container px-4 md:px-6 mx-auto max-w-4xl">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-wide sm:text-4xl md:text-5xl text-port-500 dark:text-port-300">
                Ready to Strengthen Your Arguments?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl dark:text-gray-300 font-light">
                Try our AI-powered logical reasoning platform and take your arguments to the next level.
              </p>
              <div className="flex flex-col items-center mt-8 space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-port-500" />
                  <p className="text-lg">Advanced logical analysis</p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-port-500" />
                  <p className="text-lg">Fallacy detection and fixes</p>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-port-500" />
                  <p className="text-lg">Argument strengthening tools</p>
                </div>
              </div>
            </div>
            <div className="w-full max-w-md mt-12">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild size="lg" className="w-full font-semibold tracking-wide bg-port-500 hover:bg-port-600 text-white text-lg py-6">
                      <Link href="/analyze">
                        Try Argument Analysis <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="p-3 text-base">
                    <p>Test our AI-powered argument analyzer with your own text</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


