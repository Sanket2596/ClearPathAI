'use client'

import { useQuery } from '@tanstack/react-query'

// Mock data for demonstration
const mockDashboardData = {
  kpis: {
    packagesInTransit: 12345,
    activeAnomalies: 23,
    recoveryActionsToday: 18,
    agentsActive: 4,
    averageRecoveryTime: 2.5,
    customerSatisfaction: 94,
  },
  anomalyTrends: [
    { time: '00:00', anomalies: 12, resolved: 8 },
    { time: '04:00', anomalies: 8, resolved: 6 },
    { time: '08:00', anomalies: 25, resolved: 18 },
    { time: '12:00', anomalies: 32, resolved: 28 },
    { time: '16:00', anomalies: 18, resolved: 15 },
    { time: '20:00', anomalies: 14, resolved: 12 },
    { time: '24:00', anomalies: 9, resolved: 7 },
  ],
  recoveryStats: [
    { method: 'AI Automated', success: 85, total: 100 },
    { method: 'Manual', success: 72, total: 100 },
    { method: 'Hybrid', success: 91, total: 100 },
  ],
  recentAnomalies: [
    {
      packageId: 'PKG123456',
      lastScan: 'Hub A (09:12)',
      anomalyType: 'Missed scan',
      confidence: 0.83,
      suggestedAction: 'Rescan Warehouse',
      status: 'investigating',
    },
    {
      packageId: 'PKG789012',
      lastScan: 'Hub B (11:30)',
      anomalyType: 'Misrouted',
      confidence: 0.91,
      suggestedAction: 'Reroute via Hub C',
      status: 'action_taken',
    },
    {
      packageId: 'PKG345678',
      lastScan: 'Hub C (14:15)',
      anomalyType: 'Delayed',
      confidence: 0.76,
      suggestedAction: 'Notify Customer',
      status: 'pending',
    },
  ],
  allAnomalies: [
    // Extended list for the anomalies tab
    {
      packageId: 'PKG123456',
      lastScan: 'Hub A (09:12)',
      anomalyType: 'Missed scan',
      confidence: 0.83,
      suggestedAction: 'Rescan Warehouse',
      status: 'investigating',
    },
    {
      packageId: 'PKG789012',
      lastScan: 'Hub B (11:30)',
      anomalyType: 'Misrouted',
      confidence: 0.91,
      suggestedAction: 'Reroute via Hub C',
      status: 'action_taken',
    },
    // Add more mock data...
  ],
  activeAgents: [
    {
      id: 'agent-1',
      name: 'Investigator Agent',
      status: 'active',
      currentTask: 'Analyzing PKG123456',
      performance: 94,
    },
    {
      id: 'agent-2',
      name: 'Recovery Agent',
      status: 'active',
      currentTask: 'Coordinating reroute',
      performance: 87,
    },
    {
      id: 'agent-3',
      name: 'Customer Agent',
      status: 'idle',
      currentTask: null,
      performance: 96,
    },
    {
      id: 'agent-4',
      name: 'Evidence Agent',
      status: 'active',
      currentTask: 'Processing CCTV footage',
      performance: 91,
    },
  ],
}

async function fetchDashboardData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, this would be an actual API call
  // const response = await fetch('/api/dashboard')
  // return response.json()
  
  return mockDashboardData
}

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: fetchDashboardData,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  })
}
