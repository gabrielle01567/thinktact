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
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat"></div>
        </div>
        
        {/* Pulsating Brain GIF */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="relative w-[80vw] h-[80vh] max-w-[800px] max-h-[800px]">
            <Image 
              src="/20250306_2041_Pulsating Brain Art_simple_compose_01jnq46pcrf3tsa6ext8aaepz7.gif"
              alt="Pulsating Brain"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="container relative z-20 flex flex-col items-center justify-center h-full text-center text-white">
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl mb-8 text-white">
            Master the Art of Logical Reasoning
          </h1>
          <p className="max-w-2xl mx-auto text-xl mb-12 text-white font-light">
            Elevate your argumentation skills with AI-powered analysis and training. Perfect for lawyers, students, and professionals who rely on clear logical thinking.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              href="/waitlist"
              className="px-8 py-4 text-lg font-medium text-port-900 bg-white border-2 border-white rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Join the Waitlist
            </Link>
            <Link
              href="/features"
              className="px-8 py-4 text-lg font-medium text-white bg-transparent border-2 border-white rounded-lg hover:bg-white/10 transition-colors shadow-lg"
            >
              Explore Features
            </Link>
          </div>
          <div className="mt-12 bg-port-800/80 px-8 py-4 rounded-lg inline-block">
            <p className="text-lg text-white flex items-center font-medium">
              <Calendar className="h-5 w-5 mr-3 text-white" />
              Launching March 2025 — <Link href="/waitlist" className="underline ml-2 text-white hover:text-port-200 font-medium">Get early access</Link>
            </p>
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


