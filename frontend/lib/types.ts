// Shared types for the ClearPath AI frontend

export interface PackageData {
  id: string
  trackingNumber: string
  sender: string
  receiver: string
  origin: string
  destination: string
  status: 'in_transit' | 'delivered' | 'delayed' | 'lost' | 'investigating'
  priority: 'low' | 'medium' | 'high' | 'critical'
  lastScan: string
  expectedDelivery: string
  aiConfidence?: number
  anomalyType?: string
  investigationStatus?: string
  weight: string
  value: string
  createdAt: string
  // Additional fields for modal compatibility
  sender_address?: any
  receiver_address?: any
  sender_phone?: string
  sender_email?: string
  receiver_phone?: string
  receiver_email?: string
  fragile?: boolean
  hazardous?: boolean
  insurance_required?: boolean
  signature_required?: boolean
}
