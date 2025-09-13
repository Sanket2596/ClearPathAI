import { unstable_cache } from 'next/cache'

// Types
interface Package {
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

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Helper function for API calls
async function fetchFromBackend<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const baseUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'
    const response = await fetch(`${baseUrl}/api/v1${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
      ...options,
    })

    if (!response.ok) {
      console.error(`API call failed for ${endpoint}: ${response.status}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error)
    return null
  }
}

// Cached data fetching functions

export const getPackages = unstable_cache(
  async (params: {
    page?: number
    size?: number
    search?: string
    status?: string
    priority?: string
    origin?: string
    destination?: string
    sort_by?: string
    sort_order?: string
  } = {}): Promise<{ packages: Package[]; total: number; page: number; size: number } | null> => {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    const endpoint = `/packages${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    return await fetchFromBackend(endpoint)
  },
  ['packages'],
  { revalidate: 30 } // Cache for 30 seconds
)

export const getPackageById = unstable_cache(
  async (packageId: string): Promise<Package | null> => {
    return await fetchFromBackend(`/packages/${packageId}`)
  },
  ['package'],
  { revalidate: 60 }
)

export const getPackageStats = unstable_cache(
  async (): Promise<PackageStats | null> => {
    return await fetchFromBackend('/packages/stats')
  },
  ['package-stats'],
  { revalidate: 60 }
)

export const getRecentPackages = unstable_cache(
  async (limit: number = 10): Promise<Package[]> => {
    const response = await fetchFromBackend<{ packages: Package[] }>(
      `/packages?page=1&size=${limit}&sort_by=created_at&sort_order=desc`
    )
    return response?.packages || []
  },
  ['recent-packages'],
  { revalidate: 30 }
)

export const getPackagesByStatus = unstable_cache(
  async (status: string, limit: number = 20): Promise<Package[]> => {
    const response = await fetchFromBackend<{ packages: Package[] }>(
      `/packages?status=${status}&page=1&size=${limit}`
    )
    return response?.packages || []
  },
  ['packages-by-status'],
  { revalidate: 30 }
)

export const getPackagesByCarrier = unstable_cache(
  async (carrier: string, limit: number = 20): Promise<Package[]> => {
    const response = await fetchFromBackend<{ packages: Package[] }>(
      `/packages?carrier=${carrier}&page=1&size=${limit}`
    )
    return response?.packages || []
  },
  ['packages-by-carrier'],
  { revalidate: 30 }
)

export const getPackagesByPriority = unstable_cache(
  async (priority: string, limit: number = 20): Promise<Package[]> => {
    const response = await fetchFromBackend<{ packages: Package[] }>(
      `/packages?priority=${priority}&page=1&size=${limit}`
    )
    return response?.packages || []
  },
  ['packages-by-priority'],
  { revalidate: 30 }
)

export const searchPackages = unstable_cache(
  async (query: string, filters: {
    status?: string
    priority?: string
    origin?: string
    destination?: string
    carrier?: string
  } = {}): Promise<Package[]> => {
    const searchParams = new URLSearchParams({
      search: query,
      ...filters
    })

    const response = await fetchFromBackend<{ packages: Package[] }>(
      `/packages?${searchParams.toString()}`
    )
    return response?.packages || []
  },
  ['search-packages'],
  { revalidate: 15 } // Shorter cache for search results
)

export const getPackageTrackingEvents = unstable_cache(
  async (packageId: string): Promise<any[]> => {
    const response = await fetchFromBackend<{ tracking_events: any[] }>(
      `/packages/${packageId}/tracking-events`
    )
    return response?.tracking_events || []
  },
  ['package-tracking-events'],
  { revalidate: 60 }
)

// Analytics and reporting functions
export const getPackageAnalytics = unstable_cache(
  async (dateRange?: { start_date: string; end_date: string }): Promise<any> => {
    const params = dateRange ? 
      `?start_date=${dateRange.start_date}&end_date=${dateRange.end_date}` : 
      ''
    
    return await fetchFromBackend(`/packages/analytics${params}`)
  },
  ['package-analytics'],
  { revalidate: 300 } // Cache for 5 minutes
)

export const getDeliveryPerformance = unstable_cache(
  async (): Promise<any> => {
    return await fetchFromBackend('/packages/delivery-performance')
  },
  ['delivery-performance'],
  { revalidate: 300 }
)

export const getAnomalyReport = unstable_cache(
  async (): Promise<any> => {
    return await fetchFromBackend('/packages/anomalies')
  },
  ['anomaly-report'],
  { revalidate: 60 }
)

// Dashboard-specific data fetching
export const getDashboardData = unstable_cache(
  async (): Promise<{
    stats: PackageStats | null
    recentPackages: Package[]
    inTransitPackages: Package[]
    delayedPackages: Package[]
    analytics: any
  }> => {
    const [stats, recentPackages, inTransitPackages, delayedPackages, analytics] = await Promise.all([
      getPackageStats(),
      getRecentPackages(10),
      getPackagesByStatus('in_transit', 10),
      getPackagesByStatus('delayed', 10),
      getPackageAnalytics()
    ])

    return {
      stats,
      recentPackages,
      inTransitPackages,
      delayedPackages,
      analytics
    }
  },
  ['dashboard-data'],
  { revalidate: 30 }
)

// Export functions
export const exportPackages = async (
  format: 'csv' | 'json' = 'json',
  filters?: {
    status?: string
    priority?: string
    start_date?: string
    end_date?: string
  }
): Promise<Blob | null> => {
  try {
    const baseUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'
    const searchParams = new URLSearchParams({
      format,
      ...filters
    })

    const response = await fetch(`${baseUrl}/api/v1/packages/export?${searchParams.toString()}`, {
      cache: 'no-store', // Don't cache exports
    })

    if (!response.ok) {
      return null
    }

    return await response.blob()
  } catch (error) {
    console.error('Export failed:', error)
    return null
  }
}

// Utility functions for server components
export const formatPackageData = (package_: Package) => ({
  ...package_,
  status_display: package_.status.replace('_', ' ').toUpperCase(),
  created_at_formatted: new Date(package_.created_at).toLocaleDateString(),
  estimated_delivery_formatted: package_.estimated_delivery 
    ? new Date(package_.estimated_delivery).toLocaleDateString()
    : 'N/A'
})

export const getPackageStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in_transit': 'bg-blue-100 text-blue-800',
    'out_for_delivery': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'delayed': 'bg-red-100 text-red-800',
    'issue_reported': 'bg-orange-100 text-orange-800',
    'cancelled': 'bg-gray-100 text-gray-800'
  }
  
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

export const getPriorityColor = (priority: string): string => {
  const priorityColors: Record<string, string> = {
    'low': 'bg-green-100 text-green-800',
    'normal': 'bg-blue-100 text-blue-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800'
  }
  
  return priorityColors[priority] || 'bg-gray-100 text-gray-800'
}
