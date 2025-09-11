'use client'

import { useWebSocket } from '@/hooks/use-websocket'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface WebSocketDemoProps {
  className?: string
}

export function WebSocketDemo({ className }: WebSocketDemoProps) {
  const { 
    isConnected, 
    lastMessage, 
    sendMessage, 
    subscribe, 
    unsubscribe, 
    connectionId, 
    error 
  } = useWebSocket()
  
  const [messages, setMessages] = useState<any[]>([])
  const [subscriptions, setSubscriptions] = useState<string[]>([])

  // Add new messages to the list
  useEffect(() => {
    if (lastMessage) {
      setMessages(prev => [lastMessage, ...prev.slice(0, 9)]) // Keep last 10 messages
    }
  }, [lastMessage])

  const handleSubscribe = (subscriptionType: string) => {
    subscribe(subscriptionType)
    setSubscriptions(prev => [...prev, subscriptionType])
  }

  const handleUnsubscribe = (subscriptionType: string) => {
    unsubscribe(subscriptionType)
    setSubscriptions(prev => prev.filter(sub => sub !== subscriptionType))
  }

  const sendTestMessage = () => {
    sendMessage({
      type: 'test_message',
      data: {
        message: 'Hello from frontend!',
        timestamp: new Date().toISOString()
      }
    })
  }

  const getStatusColor = () => {
    if (error) return 'destructive'
    if (isConnected) return 'default'
    return 'secondary'
  }

  const getStatusText = () => {
    if (error) return 'Error'
    if (isConnected) return 'Connected'
    return 'Disconnected'
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            WebSocket Status
            <Badge variant={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Connection ID:</strong> {connectionId || 'N/A'}</p>
            {error && (
              <p className="text-red-500"><strong>Error:</strong> {error}</p>
            )}
            <div className="flex gap-2">
              <Button onClick={sendTestMessage} disabled={!isConnected}>
                Send Test Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {['package_updates', 'dashboard_metrics', 'notifications', 'anomalies', 'map_updates'].map(sub => (
                <div key={sub} className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={subscriptions.includes(sub) ? "default" : "outline"}
                    onClick={() => 
                      subscriptions.includes(sub) 
                        ? handleUnsubscribe(sub) 
                        : handleSubscribe(sub)
                    }
                    disabled={!isConnected}
                  >
                    {subscriptions.includes(sub) ? 'Unsubscribe' : 'Subscribe'} {sub}
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Active subscriptions: {subscriptions.length}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages received yet</p>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{message.type}</Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(message.data, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
