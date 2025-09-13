import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  MapPin,
  Clock,
  Users,
  Zap
} from 'lucide-react'
import { getDashboardData, formatPackageData, getPackageStatusColor } from '@/lib/server-data'
import { DashboardClientWrapper } from '@/components/dashboard/dashboard-client-wrapper'

// Loading components
function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function RecentPackagesSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Server component for dashboard stats
async function DashboardStats() {
  const { stats } = await getDashboardData()
  
  if (!stats) {
    return <DashboardStatsSkeleton />
  }

  const statItems = [
    {
      title: 'Total Packages',
      value: stats.total_packages.toLocaleString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'In Transit',
      value: stats.in_transit.toLocaleString(),
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Delivered',
      value: stats.delivered.toLocaleString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Delayed',
      value: stats.delayed.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '-5%',
      changeType: 'negative'
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
                <div className="flex items-center mt-1">
                  <Badge 
                    variant={item.changeType === 'positive' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {item.change}
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">vs last week</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Server component for recent packages
async function RecentPackages() {
  const { recentPackages } = await getDashboardData()
  
  if (!recentPackages || recentPackages.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No recent packages found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Recent Packages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPackages.slice(0, 5).map((package_) => {
            const formattedPackage = formatPackageData(package_)
            
            return (
              <div key={package_.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{package_.tracking_number}</h3>
                    <Badge className={getPackageStatusColor(package_.status)}>
                      {formattedPackage.status_display}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{package_.origin} → {package_.destination}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formattedPackage.estimated_delivery_formatted}</span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Server component for in-transit packages
async function InTransitPackages() {
  const { inTransitPackages } = await getDashboardData()
  
  if (!inTransitPackages || inTransitPackages.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No packages in transit</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          In Transit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {inTransitPackages.slice(0, 3).map((package_) => (
            <div key={package_.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{package_.tracking_number}</p>
                <p className="text-sm text-gray-600">
                  {package_.origin} → {package_.destination}
                </p>
              </div>
              <Badge className={getPackageStatusColor(package_.status)}>
                In Transit
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Server component for delayed packages
async function DelayedPackages() {
  const { delayedPackages } = await getDashboardData()
  
  if (!delayedPackages || delayedPackages.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <p className="text-green-600 font-medium">No delayed packages</p>
          <p className="text-sm text-gray-500">All packages are on schedule</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Delayed Packages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {delayedPackages.slice(0, 3).map((package_) => (
            <div key={package_.id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
              <div>
                <p className="font-medium">{package_.tracking_number}</p>
                <p className="text-sm text-red-600">
                  {package_.origin} → {package_.destination}
                </p>
              </div>
              <Badge variant="destructive">
                Delayed
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Main dashboard server component
export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time overview of your logistics operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Live</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Packages - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Suspense fallback={<RecentPackagesSkeleton />}>
            <RecentPackages />
          </Suspense>
        </div>

        {/* Sidebar with In Transit and Delayed */}
        <div className="space-y-6">
          <Suspense fallback={<RecentPackagesSkeleton />}>
            <InTransitPackages />
          </Suspense>
          
          <Suspense fallback={<RecentPackagesSkeleton />}>
            <DelayedPackages />
          </Suspense>
        </div>
      </div>

      {/* Client-side interactive components */}
      <DashboardClientWrapper />
    </div>
  )
}
