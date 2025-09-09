// API service for ClearPath AI Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Package {
  id: string;
  tracking_number: string;
  sender_name: string;
  sender_company?: string;
  sender_address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  sender_phone?: string;
  sender_email?: string;
  receiver_name: string;
  receiver_company?: string;
  receiver_address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  receiver_phone?: string;
  receiver_email?: string;
  origin: string;
  destination: string;
  status: 'in_transit' | 'delivered' | 'delayed' | 'lost' | 'investigating';
  priority: 'low' | 'medium' | 'high' | 'critical';
  weight: number;
  weight_unit: string;
  value: number;
  value_currency: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  last_scan_location?: string;
  last_scan_time?: string;
  expected_delivery?: string;
  actual_delivery?: string;
  ai_confidence?: number;
  anomaly_type?: string;
  investigation_status?: string;
  ai_analysis?: any;
  created_at: string;
  updated_at?: string;
  special_instructions?: string;
  insurance_required: boolean;
  signature_required: boolean;
  fragile: boolean;
  hazardous: boolean;
  // Computed fields for frontend compatibility
  lastScan: string;
  weight_display: string;
  value_display: string;
  createdAt: string;
}

export interface PackageStats {
  total_packages: number;
  in_transit: number;
  delivered: number;
  delayed: number;
  lost: number;
  investigating: number;
  by_priority: Record<string, number>;
  by_status: Record<string, number>;
}

export interface PackageListResponse {
  packages: Package[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface TrackingEvent {
  id: string;
  package_id: string;
  event_type: string;
  scan_type: 'departure' | 'arrival' | 'in_transit' | 'delivery' | 'exception' | 'pickup' | 'customs';
  timestamp: string;
  location: string;
  location_coordinates?: { lat: number; lng: number };
  facility_name?: string;
  facility_type?: string;
  description: string;
  status: string;
  ai_analysis?: string;
  ai_confidence?: number;
  anomaly_detected: boolean;
  anomaly_type?: string;
  scan_data?: any;
  operator_id?: string;
  device_id?: string;
  weather_conditions?: any;
  traffic_conditions?: any;
  created_at: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(response.status, errorData.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

export const packageAPI = {
  // Get packages with filtering and pagination
  async getPackages(params: {
    search?: string;
    status?: string;
    priority?: string;
    origin?: string;
    destination?: string;
    page?: number;
    size?: number;
    sort_by?: string;
    sort_order?: string;
  } = {}): Promise<PackageListResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/packages?${queryString}` : '/packages';
    
    return fetchApi<PackageListResponse>(endpoint);
  },

  // Get package by ID
  async getPackage(id: string): Promise<Package> {
    return fetchApi<Package>(`/packages/${id}`);
  },

  // Get package by tracking number
  async getPackageByTracking(trackingNumber: string): Promise<Package> {
    return fetchApi<Package>(`/packages/tracking/${trackingNumber}`);
  },

  // Create new package
  async createPackage(packageData: Partial<Package>): Promise<Package> {
    return fetchApi<Package>('/packages', {
      method: 'POST',
      body: JSON.stringify(packageData),
    });
  },

  // Update package
  async updatePackage(id: string, updateData: Partial<Package>): Promise<Package> {
    return fetchApi<Package>(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete package
  async deletePackage(id: string): Promise<void> {
    return fetchApi<void>(`/packages/${id}`, {
      method: 'DELETE',
    });
  },

  // Get package statistics
  async getPackageStats(): Promise<PackageStats> {
    return fetchApi<PackageStats>('/packages/stats');
  },

  // Get tracking events for a package
  async getPackageTrackingEvents(packageId: string): Promise<TrackingEvent[]> {
    return fetchApi<TrackingEvent[]>(`/packages/${packageId}/tracking`);
  },

  // Add tracking event to package
  async addTrackingEvent(packageId: string, eventData: Partial<TrackingEvent>): Promise<TrackingEvent> {
    return fetchApi<TrackingEvent>(`/packages/${packageId}/tracking`, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  // Export packages to CSV
  async exportPackagesCSV(params: {
    search?: string;
    status?: string;
    priority?: string;
    origin?: string;
    destination?: string;
  } = {}): Promise<Blob> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/packages/export/csv?${queryString}` : '/packages/export/csv';
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to export packages');
    }
    
    return response.blob();
  },

  // Export packages to JSON
  async exportPackagesJSON(params: {
    search?: string;
    status?: string;
    priority?: string;
    origin?: string;
    destination?: string;
  } = {}): Promise<{ packages: Package[]; exported_at: string; total: number }> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/packages/export/json?${queryString}` : '/packages/export/json';
    
    return fetchApi<{ packages: Package[]; exported_at: string; total: number }>(endpoint);
  },

  // Refresh packages (trigger real-time update)
  async refreshPackages(): Promise<{ message: string; stats: PackageStats; refreshed_at: string }> {
    return fetchApi<{ message: string; stats: PackageStats; refreshed_at: string }>('/packages/refresh', {
      method: 'POST',
    });
  },
};

// Health check
export const healthAPI = {
  async checkHealth(): Promise<{ status: string; database: string; timestamp: string }> {
    return fetchApi<{ status: string; database: string; timestamp: string }>('/health');
  },
};

export { ApiError };
