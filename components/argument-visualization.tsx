"use client"

import {
  ResponsiveContainer,
  Treemap,
  Tooltip,
} from "recharts"
import { ReactElement, useState } from "react"
import { AlertCircle, ChevronRight, Lock } from "lucide-react"

interface ArgumentNode {
  name: string
  size: number
  strength: number // 0-100 score for argument strength
  type: 'premise' | 'conclusion' | 'support' | 'counter' | 'weakness'
  impact: 'critical' | 'important' | 'minor'
  children?: ArgumentNode[]
}

interface ArgumentVisualizationProps {
  data: {
    premises: Array<{
      text: string
      strength: number
      impact: 'critical' | 'important' | 'minor'
    }>
    conclusions: Array<{
      text: string
      strength: number
      impact: 'critical' | 'important' | 'minor'
    }>
    supporting: Array<{
      text: string
      strength: number
      impact: 'critical' | 'important' | 'minor'
    }>
    counters: Array<{
      text: string
      strength: number
      impact: 'critical' | 'important' | 'minor'
    }>
    weaknesses: Array<{
      text: string
      strength: number
      impact: 'critical' | 'important' | 'minor'
    }>
  }
}

// Enhanced color scale with better accessibility and softer colors
const getStrengthColor = (strength: number) => {
  // Soft coral for weak arguments (0-30) - Less harsh than pure red
  if (strength <= 30) {
    return `rgb(255, 127, 123)`
  }
  // Warm amber for okay arguments (31-70) - More pleasant than pure yellow
  if (strength <= 70) {
    return `rgb(250, 176, 5)`
  }
  // Sage green for strong arguments (71-100) - More sophisticated than bright green
  return `rgb(104, 159, 56)`
}

const getImpactSize = (impact: 'critical' | 'important' | 'minor') => {
  switch (impact) {
    case 'critical': return 200 // Made larger for better visibility
    case 'important': return 150
    case 'minor': return 100
    default: return 150
  }
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const strengthText = data.strength <= 30 ? "Needs Work" : 
                        data.strength <= 70 ? "Pretty Good" : "Very Strong"
    const impactText = data.impact === 'critical' ? "Super Important" :
                      data.impact === 'important' ? "Important" : "Helpful"
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-base mb-2">{data.name}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStrengthColor(data.strength) }} />
            <p className="text-sm">Strength: {strengthText}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <p className="text-sm">How Important: {impactText}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <p className="text-sm">Type: {data.type.charAt(0).toUpperCase() + data.type.slice(1)}</p>
          </div>
        </div>
      </div>
    )
  }
  return null
}

type TreemapContentProps = {
  root: { children: ArgumentNode[] }
  depth: number
  x: number
  y: number
  width: number
  height: number
  index: number
}

const TreemapContent = ({ root, depth, x, y, width, height, index }: TreemapContentProps): ReactElement => {
  // Add null checks and default values
  if (!root || !root.children || !root.children[index]) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: '#f3f4f6',
            stroke: '#e5e7eb',
            strokeWidth: 1
          }}
        />
      </g>
    )
  }

  const data = root.children[index]
  
  // Dynamic font size based on box dimensions
  const fontSize = Math.min(width, height) * 0.15
  const adjustedFontSize = Math.min(Math.max(fontSize, 10), 16)
  
  return (
    <g className="argument-box">
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        className="argument-rect"
        style={{
          fill: getStrengthColor(data.strength),
          stroke: '#fff',
          strokeWidth: 2,
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
      />
      {width > 50 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="argument-text"
          style={{
            fill: data.strength > 50 ? '#1a1a1a' : '#fff',
            fontSize: adjustedFontSize,
            fontWeight: data.impact === 'critical' ? 'bold' : 'normal',
            transition: 'all 0.2s ease',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            cursor: 'pointer',
          }}
        >
          {data.name}
        </text>
      )}
      <style jsx>{`
        .argument-box:hover .argument-rect {
          filter: brightness(1.1);
          strokeWidth: 3;
        }
        .argument-box:hover .argument-text {
          transform: scale(1.05);
        }
      `}</style>
    </g>
  )
}

export function ArgumentVisualization({ data }: ArgumentVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'core' | 'counter' | 'feedback'>('core')
  const [selectedArgument, setSelectedArgument] = useState<ArgumentNode | null>(null)
  
  // Add null check for data
  if (!data || !data.premises) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="mt-4 text-lg font-semibold">No Data Available</h3>
        <p className="mt-2 text-gray-600">Please provide valid argument data to visualize.</p>
      </div>
    )
  }

  // Ensure data exists and has all required properties with default empty arrays
  const safeData = {
    premises: data?.premises || [],
    conclusions: data?.conclusions || [],
    supporting: data?.supporting || [],
    counters: data?.counters || [],
    weaknesses: data?.weaknesses || [],
  }

  // Filter data based on active tab
  const getTabData = () => {
    switch (activeTab) {
      case 'core':
        return [
          {
            name: "Main Ideas",
            size: 0,
            strength: 0,
            type: "premise",
            impact: "critical",
            children: [
              ...safeData.premises.map(item => ({
                name: item.text,
                size: getImpactSize(item.impact),
                strength: item.strength,
                type: "premise" as const,
                impact: item.impact,
              })),
              ...safeData.conclusions.map(item => ({
                name: item.text,
                size: getImpactSize(item.impact),
                strength: item.strength,
                type: "conclusion" as const,
                impact: item.impact,
              })),
            ],
          },
          {
            name: "Supporting Ideas",
            size: 0,
            strength: 0,
            type: "support",
            impact: "important",
            children: safeData.supporting.map(item => ({
              name: item.text,
              size: getImpactSize(item.impact),
              strength: item.strength,
              type: "support" as const,
              impact: item.impact,
            })),
          },
        ]
      case 'counter':
        return [
          {
            name: "Opposing Ideas",
            size: 0,
            strength: 0,
            type: "counter",
            impact: "important",
            children: safeData.counters.map(item => ({
              name: item.text,
              size: getImpactSize(item.impact),
              strength: item.strength,
              type: "counter" as const,
              impact: item.impact,
            })),
          },
          {
            name: "Areas to Improve",
            size: 0,
            strength: 0,
            type: "weakness",
            impact: "important",
            children: safeData.weaknesses.map(item => ({
              name: item.text,
              size: getImpactSize(item.impact),
              strength: item.strength,
              type: "weakness" as const,
              impact: item.impact,
            })),
          },
        ]
      case 'feedback':
        return []
    }
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">No argument data to show yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">How Strong Is Your Argument?</h3>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <span>Join Beta</span>
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('core')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'core'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Core Arguments
        </button>
        <button
          onClick={() => setActiveTab('counter')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'counter'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Counterarguments
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'feedback'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          AI Feedback
          <Lock className="w-4 h-4 ml-2 text-gray-400" />
        </button>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6">
        <h4 className="font-medium mb-2">Quick Guide:</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStrengthColor(85) }} />
            <span>Green = Very Strong Point</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStrengthColor(50) }} />
            <span>Yellow = Pretty Good Point</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStrengthColor(20) }} />
            <span>Red = Needs More Support</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <div className="w-4 h-4 rounded-full bg-gray-400" />
            </div>
            <span>Bigger Box = More Important Point</span>
          </li>
        </ul>
      </div>

      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={getTabData()}
            dataKey="size"
            stroke="#fff"
            content={TreemapContent as any}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>

      {selectedArgument && (
        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-2">{selectedArgument.name}</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">AI Suggestion</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Try strengthening this point with evidence from academic sources or expert opinions.
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  👍 Helpful
                </button>
                <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  👎 Not Helpful
                </button>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Get Premium Analysis →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm mb-2">💡 Tips:</p>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
          <li>• Click on any box to see AI suggestions</li>
          <li>• Hover over arguments to see more details</li>
          <li>• Switch tabs to explore different aspects of your argument</li>
          <li>• Get premium analysis for in-depth improvement suggestions</li>
        </ul>
      </div>
    </div>
  )
} 