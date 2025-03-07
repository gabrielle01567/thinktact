import { Metadata } from "next";
import { ArgumentAnalyzer } from '@/components/argument-analyzer';
import { ArgumentDashboard } from '@/components/argument-dashboard';
import { ArgumentCoach } from '@/components/argument-coach';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
  title: 'Argument Analysis',
  description: "Analyze your arguments for logical fallacies and track your reasoning progress.",
};

export default function AnalyzePage() {
  return (
    <div className="container py-4 md:py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">Argument Analysis</h1>
      
      <div className="grid grid-cols-1 gap-8 max-w-[1600px] mx-auto">
        {/* Argument Dashboard */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Your Dashboard</h2>
          <ArgumentDashboard />
        </section>
        
        {/* Argument Analysis and Coaching */}
        <section className="mt-8">
          <Tabs defaultValue="analyzer" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="analyzer">Analyze Argument</TabsTrigger>
              <TabsTrigger value="coach">AI Coaching</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analyzer">
              <ArgumentAnalyzer />
            </TabsContent>
            
            <TabsContent value="coach">
              <ArgumentCoach />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  )
} 