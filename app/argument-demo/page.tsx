"use client"

import { ArgumentVisualization } from "@/components/argument-visualization"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

type Impact = "critical" | "important" | "minor"

interface ArgumentElement {
  text: string
  strength: number
  impact: Impact
}

interface ArgumentCase {
  premises: ArgumentElement[]
  conclusions: ArgumentElement[]
  supporting: ArgumentElement[]
  counters: ArgumentElement[]
  weaknesses: ArgumentElement[]
}

const exampleCases: Record<string, ArgumentCase> = {
  climateChange: {
    premises: [
      { text: "Scientific consensus is reliable", strength: 0.8, impact: "critical" },
      { text: "Current measurements are accurate", strength: 0.9, impact: "critical" },
      { text: "Past climate data is representative", strength: 0.7, impact: "important" }
    ],
    conclusions: [
      { text: "Greenhouse gases trap heat", strength: 0.95, impact: "critical" },
      { text: "Human activities produce emissions", strength: 0.9, impact: "critical" },
      { text: "Global temperature is rising", strength: 0.85, impact: "critical" }
    ],
    supporting: [
      { text: "Multiple independent data sources", strength: 0.85, impact: "important" },
      { text: "Observable environmental changes", strength: 0.8, impact: "important" },
      { text: "Predictive models accuracy", strength: 0.75, impact: "important" }
    ],
    counters: [
      { text: "Natural climate cycles", strength: 0.6, impact: "important" },
      { text: "Data measurement issues", strength: 0.5, impact: "minor" },
      { text: "Economic impact concerns", strength: 0.4, impact: "minor" }
    ],
    weaknesses: [
      { text: "Uncertainty in future projections", strength: 0.3, impact: "important" },
      { text: "Regional variation complexity", strength: 0.4, impact: "minor" },
      { text: "Policy effectiveness questions", strength: 0.5, impact: "important" }
    ]
  },
  ethicalAI: {
    premises: [
      { text: "AI systems can be controlled", strength: 0.7, impact: "critical" },
      { text: "Human values can be encoded", strength: 0.6, impact: "critical" },
      { text: "Benefits outweigh risks", strength: 0.65, impact: "important" }
    ],
    conclusions: [
      { text: "AI behavior is predictable", strength: 0.75, impact: "critical" },
      { text: "Safety measures are possible", strength: 0.8, impact: "critical" },
      { text: "Ethical guidelines exist", strength: 0.7, impact: "important" }
    ],
    supporting: [
      { text: "Testing methodology", strength: 0.8, impact: "important" },
      { text: "Oversight mechanisms", strength: 0.75, impact: "important" },
      { text: "Transparency measures", strength: 0.7, impact: "important" }
    ],
    counters: [
      { text: "Unintended consequences", strength: 0.8, impact: "critical" },
      { text: "Value alignment complexity", strength: 0.7, impact: "important" },
      { text: "Control problem", strength: 0.75, impact: "critical" }
    ],
    weaknesses: [
      { text: "Long-term implications", strength: 0.6, impact: "important" },
      { text: "Edge case handling", strength: 0.5, impact: "minor" },
      { text: "Cultural bias concerns", strength: 0.55, impact: "important" }
    ]
  }
}

export default function ArgumentDemoPage() {
  const [selectedCase, setSelectedCase] = useState<keyof typeof exampleCases>("climateChange")

  return (
    <div className="container py-8">
      <div className="mb-8 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          <div className="flex-1">
            <h3 className="font-semibold">🚧 Live Analysis Coming Soon</h3>
            <p className="text-sm mt-1">
              We're currently working on integrating our AI-powered argument analysis engine. For now, explore our interactive demo showcasing how the analysis will work!
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Argument Analysis Visualization</CardTitle>
          <CardDescription>
            Explore the logical structure of complex arguments, including core assumptions, counter-arguments, and potential weaknesses. This tool helps you understand and evaluate the strength of different positions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-8">
            <Button
              variant={selectedCase === "climateChange" ? "default" : "outline"}
              onClick={() => setSelectedCase("climateChange")}
            >
              Climate Change Debate
            </Button>
            <Button
              variant={selectedCase === "ethicalAI" ? "default" : "outline"}
              onClick={() => setSelectedCase("ethicalAI")}
            >
              AI Ethics Discussion
            </Button>
          </div>

          <ArgumentVisualization data={exampleCases[selectedCase]} />
          
          <div className="mt-8 prose dark:prose-invert">
            <h3>Understanding the Visualization</h3>
            <ul>
              <li><strong>Premises (Red):</strong> Core assumptions and starting points of the argument</li>
              <li><strong>Conclusions (Green):</strong> Main points the argument aims to establish</li>
              <li><strong>Supporting Evidence (Blue):</strong> Additional facts and evidence that strengthen the argument</li>
              <li><strong>Counter Arguments (Orange):</strong> Key objections and alternative viewpoints</li>
              <li><strong>Weaknesses (Purple):</strong> Areas where the argument might need additional support</li>
            </ul>
            <p>
              The size of each element represents its relative importance or impact on the overall argument.
              The color intensity indicates the strength of each point.
              Hover over any element to see detailed information and analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 