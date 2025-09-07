'use client'

import { UserButton as ClerkUserButton } from '@clerk/nextjs'

interface UserButtonProps {
  afterSignOutUrl?: string
  appearance?: {
    elements?: {
      avatarBox?: string
      userButtonPopoverCard?: string
      userButtonPopoverActionButton?: string
    }
  }
}

export function UserButton({ 
  afterSignOutUrl = '/', 
  appearance 
}: UserButtonProps) {
  return (
    <ClerkUserButton
      afterSignOutUrl={afterSignOutUrl}
      appearance={{
        elements: {
          avatarBox: 'w-8 h-8 rounded-full',
          userButtonPopoverCard: 'shadow-xl border border-border/50 bg-background/95 backdrop-blur-xl',
          userButtonPopoverActionButton: 'hover:bg-muted/50',
          ...appearance?.elements,
        },
      }}
    />
  )
}
