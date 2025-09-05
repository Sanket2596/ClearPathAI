'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface AnomalyTrendsChartProps {
  data: Array<{
    time: string
    anomalies: number
    resolved: number
  }>
}

// Mock data for demonstration
const mockData = [
  { time: '00:00', anomalies: 12, resolved: 8 },
  { time: '04:00', anomalies: 8, resolved: 6 },
  { time: '08:00', anomalies: 25, resolved: 18 },
  { time: '12:00', anomalies: 32, resolved: 28 },
  { time: '16:00', anomalies: 18, resolved: 15 },
  { time: '20:00', anomalies: 14, resolved: 12 },
  { time: '24:00', anomalies: 9, resolved: 7 },
]

export function AnomalyTrendsChart({ data = mockData }: AnomalyTrendsChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area'>('area')

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="text-sm font-medium text-foreground mb-2">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey === 'anomalies' ? 'Detected' : 'Resolved'}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Anomalies Detected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Resolved</span>
          </div>
        </div>
        
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 text-xs transition-colors ${
              chartType === 'area' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-background hover:bg-accent'
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-xs transition-colors ${
              chartType === 'line' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-background hover:bg-accent'
            }`}
          >
            Line
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="anomaliesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="anomalies"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#anomaliesGradient)"
                name="Anomalies"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#resolvedGradient)"
                name="Resolved"
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="anomalies"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                name="Anomalies"
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                name="Resolved"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
