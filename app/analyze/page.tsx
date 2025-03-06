import { Metadata } from "next";
import { ArgumentAnalyzer } from '@/components/argument-analyzer';

export const metadata = {
  title: 'Argument Analyzer',
  description: "Strengthen your arguments with structured analysis of logical patterns and reasoning.",
};

export default function AnalyzePage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-850 dark:text-white">Strengthen your arguments with structured analysis</h1>
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-300">
            Use our AI assistant to identify logical patterns, address fallacies, and enhance your reasoning.
          </p>
        </div>

        <ArgumentAnalyzer />
      </div>
    </div>
  )
} 