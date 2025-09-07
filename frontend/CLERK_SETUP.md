# Clerk Authentication Setup

## Overview
This application now uses Clerk for authentication, which implements OAuth 2.0 flows with support for multiple providers (Google, GitHub, Discord, etc.).

## Setup Instructions

### 1. Create a Clerk Account
1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Choose your preferred authentication methods (Email, Google, GitHub, etc.)

### 2. Get Your API Keys
From your Clerk dashboard:
- Copy your **Publishable Key** (starts with `pk_`)
- Copy your **Secret Key** (starts with `sk_`)

### 3. Environment Variables
Create a `.env.local` file in the frontend directory:

```bash
# Copy from env.local.example and fill in your keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Optional: Customize URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 4. Install Dependencies
Run the following command in the frontend directory:

```bash
npm install
```

### 5. Configure OAuth Providers (Optional)
In your Clerk dashboard:
1. Go to "User & Authentication" → "Social Connections"
2. Enable desired providers (Google, GitHub, Discord, etc.)
3. Add your OAuth app credentials for each provider

### 6. Customize Appearance (Optional)
The ClerkProvider is already configured with custom styling that matches your app's theme. You can modify the appearance in `app/providers.tsx`.

## Features Implemented

### ✅ Authentication Flow
- **Sign In/Sign Up Pages**: Custom styled pages at `/sign-in` and `/sign-up`
- **Protected Routes**: Middleware automatically protects routes that require authentication
- **Public Routes**: Dashboard and other routes are accessible without authentication

### ✅ User Interface
- **Sidebar Integration**: Shows user info when signed in, sign-in button when not
- **User Profile**: Displays user name, email, and avatar
- **Sign Out**: One-click sign out functionality
- **Responsive Design**: Works on mobile and desktop

### ✅ Security
- **Route Protection**: Middleware handles authentication automatically
- **OAuth 2.0**: Industry-standard authentication protocol
- **JWT Tokens**: Secure token-based authentication
- **HTTPS Only**: Production environment requires HTTPS

## OAuth 2.0 Providers Supported

Clerk supports all major OAuth 2.0 providers:
- **Google** - Most popular choice
- **GitHub** - Great for developer tools
- **Microsoft** - Enterprise integration
- **Discord** - Gaming/community apps
- **Apple** - iOS/macOS integration
- **Facebook** - Social applications
- **Twitter/X** - Social media integration
- **LinkedIn** - Professional networks
- **And many more...**

## Development vs Production

### Development
- Use test keys (pk_test_... and sk_test_...)
- Works on localhost
- No HTTPS required

### Production
- Use live keys (pk_live_... and sk_live_...)
- Requires HTTPS
- Configure allowed domains in Clerk dashboard

## Troubleshooting

### Common Issues
1. **"Invalid publishable key"** - Check your environment variables
2. **"Redirect URL mismatch"** - Add your domain to allowed origins in Clerk
3. **"Sign in not working"** - Ensure middleware.ts is configured correctly

### Support
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Discord Community](https://discord.gg/clerk)
- [GitHub Issues](https://github.com/clerkinc/javascript)

## Next Steps

1. **Install dependencies**: `npm install`
2. **Set up environment variables**: Copy `env.local.example` to `.env.local`
3. **Get Clerk keys**: Create account and application at clerk.com
4. **Test authentication**: Start the dev server and try signing in
5. **Configure OAuth providers**: Add Google, GitHub, etc. in Clerk dashboard
