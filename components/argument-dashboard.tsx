import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, TrendingUp, Award, Brain, Target, Shield, Edit } from 'lucide-react';
import dynamic from 'next/dynamic';

// Import the FallacyChart component with dynamic import to ensure it only loads on the client
const FallacyChart = dynamic(() => import('./fallacy-chart'), { ssr: false });

// Define types for our data
interface ArgumentStats {
    argumentsConstructed: number;
    fallaciesDetected: number;
    persuasionRating: number;
    strengthScore: number;
    clarityScore: number;
    consistencyScore: number;
    credibilityRating: string;
    credibilityScore: number;
    fallacyBreakdown: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    recentArguments: Array<{
        id: number;
        title: string;
        date: string;
        strength: number;
        fallacies: number;
        credibility: string;
    }>;
}

export const ArgumentDashboard = () => {
    // Mock data - in a real app, this would come from a database or API
    const stats: ArgumentStats = {
        argumentsConstructed: 12,
        fallaciesDetected: 27,
        persuasionRating: 78, // out of 100
        strengthScore: 82,
        clarityScore: 74,
        consistencyScore: 80,
        credibilityRating: "Mostly Solid",
        credibilityScore: 72,
        fallacyBreakdown: [
            { name: 'Ad Hominem', value: 5, color: '#FF8042' },
            { name: 'Straw Man', value: 7, color: '#0088FE' },
            { name: 'False Dichotomy', value: 4, color: '#00C49F' },
            { name: 'Appeal to Authority', value: 3, color: '#FFBB28' },
            { name: 'Slippery Slope', value: 8, color: '#FF5733' }
        ],
        recentArguments: [
            { id: 1, title: "Climate Policy Reform", date: "2 days ago", strength: 85, fallacies: 2, credibility: "Rock Solid" },
            { id: 2, title: "Economic Growth Strategies", date: "5 days ago", strength: 72, fallacies: 4, credibility: "Somewhat Solid" },
            { id: 3, title: "Education System Analysis", date: "1 week ago", strength: 79, fallacies: 1, credibility: "Mostly Solid" }
        ]
    };

    const getRatingColor = (score: number): string => {
        if (score >= 80) return "text-green-600 dark:text-port-400";
        if (score >= 60) return "text-yellow-600 dark:text-port-400";
        return "text-red-600 dark:text-port-400";
    };

    const getProgressColor = (score: number): string => {
        if (score >= 80) return "bg-green-600 dark:bg-port-400";
        if (score >= 60) return "bg-yellow-600 dark:bg-port-400";
        return "bg-red-600 dark:bg-port-400";
    };

    const getCredibilityColor = (rating: string): string => {
        switch (rating) {
            case "Rock Solid": return "text-green-600 dark:text-port-400";
            case "Mostly Solid": return "text-emerald-600 dark:text-port-400";
            case "Somewhat Solid": return "text-yellow-600 dark:text-port-400";
            case "Shaky": return "text-orange-600 dark:text-port-400";
            case "Flimsy": return "text-red-600 dark:text-port-400";
            default: return "text-gray-600 dark:text-port-400";
        }
    };

    const getCredibilityIcon = (rating: string) => {
        switch (rating) {
            case "Rock Solid": return <Shield className="h-5 w-5 text-green-600 dark:text-port-400" />;
            case "Mostly Solid": return <Shield className="h-5 w-5 text-emerald-600 dark:text-port-400" />;
            case "Somewhat Solid": return <Shield className="h-5 w-5 text-yellow-600 dark:text-port-400" />;
            case "Shaky": return <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-port-400" />;
            case "Flimsy": return <AlertTriangle className="h-5 w-5 text-red-600 dark:text-port-400" />;
            default: return <Shield className="h-5 w-5 text-gray-600 dark:text-port-400" />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Argument Analytics</h2>
            
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                        <Brain className="h-5 w-5 mr-2 text-blue-600 dark:text-port-400" />
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Arguments Constructed</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-port-400">{stats.argumentsConstructed}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total arguments analyzed</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                        <AlertTriangle className="h-5 w-5 mr-2 text-amber-600 dark:text-port-400" />
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Fallacies Detected</h3>
                    </div>
                    <p className="text-3xl font-bold text-amber-600 dark:text-port-400">{stats.fallaciesDetected}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Logical issues identified</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                        <Award className="h-5 w-5 mr-2 text-purple-600 dark:text-port-400" />
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Persuasion Rating</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-600 dark:text-port-400">{stats.persuasionRating}/100</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overall effectiveness score</p>
                </div>
            </div>
            
            {/* Credibility Meter */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-8">
                <div className="flex items-center mb-4">
                    {getCredibilityIcon(stats.credibilityRating)}
                    <h3 className="text-lg font-semibold ml-2 text-gray-800 dark:text-white">Argument Credibility: <span className={getCredibilityColor(stats.credibilityRating)}>{stats.credibilityRating}</span></h3>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                    <div 
                        className="h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 dark:from-red-600 dark:via-yellow-600 dark:to-port-400"
                        style={{ width: `${stats.credibilityScore}%` }}
                    >
                    </div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Flimsy</span>
                    <span>Shaky</span>
                    <span>Somewhat Solid</span>
                    <span>Mostly Solid</span>
                    <span>Rock Solid</span>
                </div>
                
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    <p>Your arguments are generally well-structured but could benefit from stronger evidence and clearer logical connections.</p>
                    <button className="mt-2 flex items-center text-blue-600 hover:text-blue-800 dark:text-port-400 dark:hover:text-port-300">
                        <Edit className="h-4 w-4 mr-1" />
                        Get AI coaching to improve
                    </button>
                </div>
            </div>
            
            {/* Fallacy Breakdown Chart */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Fallacy Breakdown</h3>
                
                <FallacyChart data={stats.fallacyBreakdown} />
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                    The most common fallacy in your arguments is the <span className="font-semibold">Slippery Slope</span> fallacy. 
                    AI coaching can help you identify and avoid these logical errors.
                </p>
            </div>
            
            {/* Detailed Metrics */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Argument Quality Metrics</h3>
                
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Logical Strength</span>
                            <span className={`text-sm font-medium ${getRatingColor(stats.strengthScore)}`}>{stats.strengthScore}%</span>
                        </div>
                        <Progress value={stats.strengthScore} className="h-2 bg-gray-200 dark:bg-gray-700">
                            <div className={`h-full ${getProgressColor(stats.strengthScore)}`} style={{ width: `${stats.strengthScore}%` }}></div>
                        </Progress>
                    </div>
                    
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Clarity & Structure</span>
                            <span className={`text-sm font-medium ${getRatingColor(stats.clarityScore)}`}>{stats.clarityScore}%</span>
                        </div>
                        <Progress value={stats.clarityScore} className="h-2 bg-gray-200 dark:bg-gray-700">
                            <div className={`h-full ${getProgressColor(stats.clarityScore)}`} style={{ width: `${stats.clarityScore}%` }}></div>
                        </Progress>
                    </div>
                    
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Logical Consistency</span>
                            <span className={`text-sm font-medium ${getRatingColor(stats.consistencyScore)}`}>{stats.consistencyScore}%</span>
                        </div>
                        <Progress value={stats.consistencyScore} className="h-2 bg-gray-200 dark:bg-gray-700">
                            <div className={`h-full ${getProgressColor(stats.consistencyScore)}`} style={{ width: `${stats.consistencyScore}%` }}></div>
                        </Progress>
                    </div>
                </div>
            </div>
            
            {/* Recent Activity */}
            <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Recent Arguments</h3>
                
                {stats.recentArguments.length > 0 ? (
                    <div className="space-y-3">
                        {stats.recentArguments.map(arg => (
                            <div key={arg.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium text-gray-800 dark:text-white">{arg.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{arg.date}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <Target className="h-4 w-4 mr-1 text-blue-600 dark:text-port-400" />
                                        <span className={getRatingColor(arg.strength)}>{arg.strength}%</span>
                                    </div>
                                    <div className="flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-1 text-amber-600 dark:text-port-400" />
                                        <span className="text-amber-600 dark:text-port-400">{arg.fallacies}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Shield className="h-4 w-4 mr-1" />
                                        <span className={getCredibilityColor(arg.credibility)}>{arg.credibility}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-center">
                        <p className="text-gray-600 dark:text-gray-300">No recent activity to display.</p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Start analyzing arguments to see your progress here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArgumentDashboard; 