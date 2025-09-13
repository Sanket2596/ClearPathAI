import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Search, Filter, MapPin, Clock, Truck, AlertTriangle, CheckCircle, Eye } from 'lucide-react'
import { getPackages, getPackageStats, formatPackageData, getPackageStatusColor, getPriorityColor } from '@/lib/server-data'
import { PackagesClientWrapper } from '@/components/packages/packages-client-wrapper'

// Loading components
function PackagesSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Server component for package stats
async function PackageStats() {
  const stats = await getPackageStats()
  
  if (!stats) {
    return <StatsSkeleton />
  }

  const statItems = [
    {
      title: 'Total Packages',
      value: stats.total_packages.toLocaleString(),
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'In Transit',
      value: stats.in_transit.toLocaleString(),
      icon: Truck,
      color: 'text-purple-600'
    },
    {
      title: 'Delivered',
      value: stats.delivered.toLocaleString(),
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Delayed',
      value: stats.delayed.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
              <item.icon className={`h-8 w-8 ${item.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Server component for packages list
async function PackagesList() {
  const packagesData = await getPackages({
    page: 1,
    size: 20,
    sort_by: 'created_at',
    sort_order: 'desc'
  })

  if (!packagesData) {
    return <PackagesSkeleton />
  }

  const { packages } = packagesData

  return (
    <div className="space-y-4">
      {packages.map((package_) => {
        const formattedPackage = formatPackageData(package_)
        
        return (
          <Card key={package_.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{package_.tracking_number}</h3>
                    <Badge className={getPackageStatusColor(package_.status)}>
                      {formattedPackage.status_display}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{package_.origin} → {package_.destination}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Est. Delivery: {formattedPackage.estimated_delivery_formatted}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <span className="font-medium">{package_.sender_name}</span>
                    <span className="text-gray-500"> → </span>
                    <span className="font-medium">{package_.receiver_name}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Main server component
export default async function PackagesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Package Management</h1>
          <p className="text-gray-600 mt-1">
            Track and manage all your packages in real-time
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <Suspense fallback={<StatsSkeleton />}>
        <PackageStats />
      </Suspense>

      {/* Packages List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Packages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<PackagesSkeleton />}>
            <PackagesList />
          </Suspense>
        </CardContent>
      </Card>

      {/* Client-side interactive components */}
      <PackagesClientWrapper />
    </div>
  )
}
