'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface RecoverySuccessChartProps {
  data: Array<{
    method: string
    success: number
    total: number
  }>
}

// Mock data for demonstration
const mockData = [
  { method: 'AI Automated', success: 85, total: 100 },
  { method: 'Manual', success: 72, total: 100 },
  { method: 'Hybrid', success: 91, total: 100 },
]

const colors = ['#10b981', '#f59e0b', '#3b82f6']

export function RecoverySuccessChart({ data = mockData }: RecoverySuccessChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="text-sm font-medium text-foreground mb-2">{`Method: ${label}`}</p>
          <p className="text-sm text-green-600">
            {`Success Rate: ${data.success}%`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`Total Cases: ${data.total}`}
          </p>
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
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Success Rate</span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Last 30 days
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="method" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="success" 
              radius={[4, 4, 0, 0]}
              name="Success Rate"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        {data.map((item, index) => (
          <div key={item.method} className="p-3 rounded-lg bg-muted/50">
            <div 
              className="text-2xl font-bold mb-1"
              style={{ color: colors[index % colors.length] }}
            >
              {item.success}%
            </div>
            <div className="text-xs text-muted-foreground">
              {item.method}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
