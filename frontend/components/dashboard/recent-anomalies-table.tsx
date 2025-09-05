'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MagneticButton } from '@/components/ui/motion-components'
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  MoreHorizontal 
} from 'lucide-react'
import { cn, getStatusColor, formatConfidence } from '@/lib/utils'

interface Anomaly {
  packageId: string
  lastScan: string
  anomalyType: string
  confidence: number
  suggestedAction: string
  status: string
}

interface RecentAnomaliesTableProps {
  anomalies: Anomaly[]
  showFilters?: boolean
  pageSize?: number
}

const mockAnomalies: Anomaly[] = [
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
  {
    packageId: 'PKG567890',
    lastScan: 'Hub D (16:45)',
    anomalyType: 'Wrong destination',
    confidence: 0.94,
    suggestedAction: 'Redirect package',
    status: 'resolved',
  },
]

export function RecentAnomaliesTable({ 
  anomalies = mockAnomalies, 
  showFilters = false,
  pageSize = 10 
}: RecentAnomaliesTableProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('confidence')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'investigating':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'action_taken':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Package className="w-4 h-4 text-orange-500" />
      default:
        return <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 font-semibold'
    if (confidence >= 0.6) return 'text-yellow-600 font-medium'
    return 'text-red-600 font-medium'
  }

  const filteredAnomalies = anomalies
    .filter(anomaly => selectedStatus === 'all' || anomaly.status === selectedStatus)
    .slice(0, pageSize)

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Filter by status:</span>
            {['all', 'investigating', 'pending', 'action_taken', 'resolved'].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className="capitalize"
              >
                {status.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Package ID</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Last Scan</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Anomaly Type</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Confidence</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnomalies.map((anomaly, index) => (
                <motion.tr
                  key={anomaly.packageId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-sm font-medium">
                        {anomaly.packageId}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {anomaly.lastScan}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="text-xs">
                      {anomaly.anomalyType}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className={cn('text-sm', getConfidenceColor(anomaly.confidence))}>
                      {formatConfidence(anomaly.confidence)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(anomaly.status)}
                      <Badge 
                        variant="outline" 
                        className={cn('text-xs capitalize', getStatusColor(anomaly.status))}
                      >
                        {anomaly.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <MagneticButton className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                        {anomaly.suggestedAction}
                      </MagneticButton>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {anomalies.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No anomalies detected</p>
          <p className="text-sm">All packages are tracking normally</p>
        </div>
      )}
    </div>
  )
}
