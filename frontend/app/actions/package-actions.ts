'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

// Types
interface PackageUpdateData {
  status?: string
  current_location?: string
  estimated_delivery?: string
  notes?: string
}

interface PackageCreateData {
  tracking_number: string
  sender_name: string
  sender_company?: string
  sender_address: any
  sender_phone?: string
  sender_email?: string
  receiver_name: string
  receiver_company?: string
  receiver_address: any
  receiver_phone?: string
  receiver_email?: string
  origin: string
  destination: string
  weight: number
  dimensions?: any
  value?: number
  priority: string
  carrier: string
  service_type?: string
  estimated_delivery?: string
  special_instructions?: string
}

interface ApiResponse {
  success: boolean
  data?: any
  error?: string
}

// Helper function to make API calls to backend
async function apiCall(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
  try {
    const baseUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'
    const response = await fetch(`${baseUrl}/api/v1${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

// Server Actions for Package Operations

export async function createPackage(formData: PackageCreateData): Promise<ApiResponse> {
  try {
    const result = await apiCall('/packages', {
      method: 'POST',
      body: JSON.stringify(formData),
    })

    if (result.success) {
      // Revalidate relevant pages
      revalidatePath('/packages')
      revalidatePath('/dashboard')
      revalidateTag('package-stats')
      
      // Redirect to packages page
      redirect('/packages')
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create package'
    }
  }
}

export async function updatePackage(
  packageId: string, 
  updateData: PackageUpdateData
): Promise<ApiResponse> {
  try {
    const result = await apiCall(`/packages/${packageId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    })

    if (result.success) {
      // Revalidate relevant pages
      revalidatePath('/packages')
      revalidatePath(`/packages/${packageId}`)
      revalidatePath('/dashboard')
      revalidateTag('package-stats')
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update package'
    }
  }
}

export async function deletePackage(packageId: string): Promise<ApiResponse> {
  try {
    const result = await apiCall(`/packages/${packageId}`, {
      method: 'DELETE',
    })

    if (result.success) {
      // Revalidate relevant pages
      revalidatePath('/packages')
      revalidatePath('/dashboard')
      revalidateTag('package-stats')
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete package'
    }
  }
}

export async function bulkUpdatePackages(
  packageIds: string[], 
  updateData: PackageUpdateData
): Promise<ApiResponse> {
  try {
    const result = await apiCall('/packages/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({
        package_ids: packageIds,
        update_data: updateData
      }),
    })

    if (result.success) {
      // Revalidate relevant pages
      revalidatePath('/packages')
      revalidatePath('/dashboard')
      revalidateTag('package-stats')
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to bulk update packages'
    }
  }
}

export async function refreshPackages(): Promise<ApiResponse> {
  try {
    const result = await apiCall('/packages/refresh', {
      method: 'POST',
    })

    if (result.success) {
      // Revalidate all package-related data
      revalidatePath('/packages')
      revalidatePath('/dashboard')
      revalidateTag('packages')
      revalidateTag('package-stats')
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to refresh packages'
    }
  }
}

// Server Actions for Package Status Updates
export async function updatePackageStatus(
  packageId: string, 
  status: string,
  location?: string
): Promise<ApiResponse> {
  const updateData: PackageUpdateData = {
    status,
    ...(location && { current_location: location })
  }

  return updatePackage(packageId, updateData)
}

export async function markPackageDelivered(
  packageId: string, 
  deliveryTime?: string
): Promise<ApiResponse> {
  const updateData: PackageUpdateData = {
    status: 'delivered',
    ...(deliveryTime && { estimated_delivery: deliveryTime })
  }

  return updatePackage(packageId, updateData)
}

export async function reportPackageIssue(
  packageId: string, 
  issue: string,
  notes?: string
): Promise<ApiResponse> {
  const updateData: PackageUpdateData = {
    status: 'issue_reported',
    notes: notes || issue
  }

  return updatePackage(packageId, updateData)
}

// Server Actions for Analytics and Reporting
export async function generatePackageReport(
  startDate: string,
  endDate: string,
  format: 'csv' | 'json' = 'json'
): Promise<ApiResponse> {
  try {
    const result = await apiCall(`/packages/export?start_date=${startDate}&end_date=${endDate}&format=${format}`)

    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate report'
    }
  }
}

// Server Actions for Search and Filtering
export async function searchPackages(
  query: string,
  filters: {
    status?: string
    priority?: string
    origin?: string
    destination?: string
    carrier?: string
  } = {}
): Promise<ApiResponse> {
  try {
    const searchParams = new URLSearchParams({
      search: query,
      ...filters
    })

    const result = await apiCall(`/packages?${searchParams.toString()}`)
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search packages'
    }
  }
}

// Server Actions for Package Tracking
export async function addTrackingEvent(
  packageId: string,
  eventData: {
    event_type: string
    location: string
    timestamp: string
    description?: string
    scan_type?: string
  }
): Promise<ApiResponse> {
  try {
    const result = await apiCall(`/packages/${packageId}/tracking-events`, {
      method: 'POST',
      body: JSON.stringify(eventData),
    })

    if (result.success) {
      revalidatePath(`/packages/${packageId}`)
      revalidateTag(`package-${packageId}`)
    }

    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add tracking event'
    }
  }
}

// Utility Server Actions
export async function getPackageStats(): Promise<ApiResponse> {
  try {
    const result = await apiCall('/packages/stats')
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch package stats'
    }
  }
}

export async function getRecentPackages(limit: number = 10): Promise<ApiResponse> {
  try {
    const result = await apiCall(`/packages?page=1&size=${limit}&sort_by=created_at&sort_order=desc`)
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch recent packages'
    }
  }
}
