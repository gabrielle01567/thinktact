"use client";

import { ArgumentAnalyzer } from '@/components/argument-analyzer';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const [initialArgument, setInitialArgument] = useState('');
  
  useEffect(() => {
    // Get the argument from URL parameters if available
    const argumentParam = searchParams?.get('argument');
    if (argumentParam) {
      setInitialArgument(decodeURIComponent(argumentParam));
    }
  }, [searchParams]);
  
  return (
    <div className="container py-4 md:py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">Argument Analysis</h1>
      
      <div className="grid grid-cols-1 gap-8 max-w-[1600px] mx-auto">
        {/* Argument Analysis - Moved to the top */}
        <section>
          <ArgumentAnalyzer initialArgument={initialArgument} />
        </section>
      </div>
    </div>
  )
} 