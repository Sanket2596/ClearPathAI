'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from 'react'

interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
  message_id?: string
}

interface WebSocketContextType {
  isConnected: boolean
  lastMessage: WebSocketMessage | null
  sendMessage: (message: any) => void
  subscribe: (subscriptionType: string) => void
  unsubscribe: (subscriptionType: string) => void
  connectionId: string | null
  error: string | null
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  lastMessage: null,
  sendMessage: () => {},
  subscribe: () => {},
  unsubscribe: () => {},
  connectionId: null,
  error: null,
})

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [connectionId, setConnectionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    try {
      // Determine WebSocket URL based on environment
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'wss://your-domain.com/ws/connect'
        : 'ws://localhost:8000/ws/connect'
      
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setError(null)
        reconnectAttempts.current = 0
        
        // Request connection info
        sendMessage({
          type: 'get_connection_info',
          data: {}
        })
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setLastMessage(message)
          
          // Handle connection info response
          if (message.type === 'success' && message.data.connection_id) {
            setConnectionId(message.data.connection_id)
          }
          
          console.log('WebSocket message received:', message)
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
        }
      }

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
        setConnectionId(null)
        
        // Attempt to reconnect if not a clean close
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000 // Exponential backoff
          console.log(`Attempting to reconnect in ${delay}ms...`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++
            connect()
          }, delay)
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setError('Failed to reconnect after multiple attempts')
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setError('WebSocket connection error')
      }

    } catch (err) {
      console.error('Error creating WebSocket connection:', err)
      setError('Failed to create WebSocket connection')
    }
  }, [])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected')
      wsRef.current = null
    }
    
    setIsConnected(false)
    setConnectionId(null)
  }, [])

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message))
        console.log('WebSocket message sent:', message)
      } catch (err) {
        console.error('Error sending WebSocket message:', err)
        setError('Failed to send message')
      }
    } else {
      console.warn('WebSocket not connected, cannot send message')
      setError('WebSocket not connected')
    }
  }, [])

  const subscribe = useCallback((subscriptionType: string) => {
    sendMessage({
      type: 'subscribe',
      data: { subscription_type: subscriptionType }
    })
  }, [sendMessage])

  const unsubscribe = useCallback((subscriptionType: string) => {
    sendMessage({
      type: 'unsubscribe',
      data: { subscription_type: subscriptionType }
    })
  }, [sendMessage])

  // Connect on mount
  useEffect(() => {
    connect()
    
    // Cleanup on unmount
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  // Auto-subscribe to common updates
  useEffect(() => {
    if (isConnected) {
      subscribe('package_updates')
      subscribe('dashboard_metrics')
      subscribe('notifications')
    }
  }, [isConnected, subscribe])

  // Ping server every 30 seconds to keep connection alive
  useEffect(() => {
    if (!isConnected) return

    const pingInterval = setInterval(() => {
      sendMessage({
        type: 'ping',
        data: { timestamp: new Date().toISOString() }
      })
    }, 30000)

    return () => clearInterval(pingInterval)
  }, [isConnected, sendMessage])

  return (
    <WebSocketContext.Provider value={{ 
      isConnected, 
      lastMessage, 
      sendMessage, 
      subscribe, 
      unsubscribe, 
      connectionId, 
      error 
    }}>
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
