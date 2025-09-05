'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface WebSocketMessage {
  type: string
  data: {
    packageId: string
    status: string
    timestamp: string
  }
}

interface WebSocketContextType {
  isConnected: boolean
  lastMessage: WebSocketMessage | null
  sendMessage: (message: any) => void
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  lastMessage: null,
  sendMessage: () => {},
})

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(true) // Mock as connected for demo
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)

  // Mock WebSocket connection for demo
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving real-time updates
      const mockMessage = {
        type: 'package_update',
        data: {
          packageId: `PKG${Math.random().toString(36).substring(2, 11)}`,
          status: Math.random() > 0.7 ? 'anomaly_detected' : 'in_transit',
          timestamp: new Date().toISOString(),
        },
      }
      setLastMessage(mockMessage)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const sendMessage = (message: any) => {
    console.log('Sending message:', message)
    // In a real implementation, this would send via WebSocket
  }

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider')
  }
  return context
}
