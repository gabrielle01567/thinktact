'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface FallacyChartProps {
    data: Array<{
        name: string;
        value: number;
        color: string;
    }>;
}

const FallacyChart: React.FC<FallacyChartProps> = ({ data }) => {
    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} occurrences`, 'Frequency']} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FallacyChart; 