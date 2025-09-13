'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useWebSocket } from '@/hooks/use-websocket'
import { Package, Search, Filter, RefreshCw, Download, Plus, Map } from 'lucide-react'
import { PackageDetailModal } from '@/components/packages/package-detail-modal'
import { PackagesMapView } from '@/components/packages/packages-map-view'
import { 
  createPackage, 
  updatePackage, 
  deletePackage, 
  refreshPackages,
  updatePackageStatus,
  markPackageDelivered,
  reportPackageIssue,
  searchPackages as searchPackagesAction
} from '@/app/actions/package-actions'

interface PackageData {
  id: string
  tracking_number: string
  status: string
  sender_name: string
  receiver_name: string
  origin: string
  destination: string
  estimated_delivery: string
  created_at: string
  updated_at: string
}

interface PackageStats {
  total_packages: number
  in_transit: number
  delivered: number
  delayed: number
  anomalies: number
  recovery_rate: number
}

export function PackagesClientWrapper() {
  const { isConnected, lastMessage, subscribe, unsubscribe } = useWebSocket()
  const [packages, setPackages] = useState<PackageData[]>([])
  const [stats, setStats] = useState<PackageStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMapView, setIsMapView] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    carrier: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  // Subscribe to real-time updates
  useEffect(() => {
    if (isConnected) {
      subscribe('package_updates')
      subscribe('dashboard_metrics')
    }

    return () => {
      if (isConnected) {
        unsubscribe('package_updates')
        unsubscribe('dashboard_metrics')
      }
    }
  }, [isConnected, subscribe, unsubscribe])

  // Handle real-time WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'package_update':
          handlePackageUpdate(lastMessage.data)
          break
        case 'dashboard_metrics':
          handleDashboardUpdate(lastMessage.data)
          break
        case 'anomaly_detected':
          handleAnomalyAlert(lastMessage.data)
          break
      }
    }
  }, [lastMessage])

  const handlePackageUpdate = (data: any) => {
    setPackages(prev => 
      prev.map(pkg => 
        pkg.id === data.package_id 
          ? { ...pkg, ...data, updated_at: new Date().toISOString() }
          : pkg
      )
    )
  }

  const handleDashboardUpdate = (data: any) => {
    setStats(prev => prev ? { ...prev, ...data } : null)
  }

  const handleAnomalyAlert = (data: any) => {
    // Show notification or update UI for anomaly
    console.log('Anomaly detected:', data)
  }

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const result = await searchPackagesAction(searchQuery, filters)
      if (result.success && result.data) {
        setPackages(result.data.packages || [])
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Package actions
  const handleUpdateStatus = async (packageId: string, status: string) => {
    try {
      const result = await updatePackageStatus(packageId, status)
      if (result.success) {
        // Update local state
        setPackages(prev => 
          prev.map(pkg => 
            pkg.id === packageId 
              ? { ...pkg, status, updated_at: new Date().toISOString() }
              : pkg
          )
        )
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleMarkDelivered = async (packageId: string) => {
    try {
      const result = await markPackageDelivered(packageId)
      if (result.success) {
        setPackages(prev => 
          prev.map(pkg => 
            pkg.id === packageId 
              ? { ...pkg, status: 'delivered', updated_at: new Date().toISOString() }
              : pkg
          )
        )
      }
    } catch (error) {
      console.error('Failed to mark as delivered:', error)
    }
  }

  const handleReportIssue = async (packageId: string, issue: string) => {
    try {
      const result = await reportPackageIssue(packageId, issue)
      if (result.success) {
        setPackages(prev => 
          prev.map(pkg => 
            pkg.id === packageId 
              ? { ...pkg, status: 'issue_reported', updated_at: new Date().toISOString() }
              : pkg
          )
        )
      }
    } catch (error) {
      console.error('Failed to report issue:', error)
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const result = await refreshPackages()
      if (result.success) {
        // The page will revalidate automatically due to server actions
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to refresh:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Packages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by tracking number, sender, or receiver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.carrier} onValueChange={(value) => setFilters(prev => ({ ...prev, carrier: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Carriers</SelectItem>
                <SelectItem value="FedEx">FedEx</SelectItem>
                <SelectItem value="UPS">UPS</SelectItem>
                <SelectItem value="USPS">USPS</SelectItem>
                <SelectItem value="DHL">DHL</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <Button variant="outline" onClick={() => setIsMapView(!isMapView)}>
          <Map className="h-4 w-4 mr-2" />
          {isMapView ? 'List View' : 'Map View'}
        </Button>
        
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

      {/* WebSocket Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-sm text-gray-600">
          {isConnected ? 'Connected to real-time updates' : 'Disconnected from real-time updates'}
        </span>
      </div>

      {/* Map View */}
      {isMapView && (
        <Card>
          <CardHeader>
            <CardTitle>Package Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <PackagesMapView packages={packages} />
          </CardContent>
        </Card>
      )}

      {/* Package Detail Modal */}
      {selectedPackage && (
        <PackageDetailModal
          package={selectedPackage}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedPackage(null)
          }}
          onUpdateStatus={handleUpdateStatus}
          onMarkDelivered={handleMarkDelivered}
          onReportIssue={handleReportIssue}
        />
      )}
    </div>
  )
}
