# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based AI Sales Solutions product page with multi-currency support, built with Vite and styled with TailwindCSS. The application features sophisticated animations (Framer Motion), currency-specific routing, and multiple email integration methods.

## Development Commands

```bash
npm run dev      # Start development server (default: http://localhost:5173)
npm run build    # Build for production (outputs to ./dist)
npm run preview  # Preview production build locally
```

## Key Architecture Decisions

### Routing Structure
The app uses React Router with currency-specific routes:
- Main routes: `/UK`, `/US`, `/EU` (defaults to `/UK`)
- Pricing: `/UK/pricing`, `/US/pricing`, `/EU/pricing`
- Solutions: `/UK/solutions/:challengeId`

Currency conversion is handled through hardcoded values in `pricingData` object within `ModernShowcase.jsx`, not dynamic exchange rates.

### Main Component Structure
- **App.jsx**: Handles all routing logic and currency detection
- **ModernShowcase.jsx**: Core component containing all business logic, pricing data, and UI
  - Contains `pricingData` object with all pricing for GBP/USD/EUR
  - Implements automatic British/American spelling conversion
  - Manages multi-step workflow: challenges → solutions → pricing

### Email Integration
The contact form has multiple fallback methods (see EMAIL_SETUP.md):
1. EmailJS (client-side)
2. Serverless function at `/api/send-email` (SendGrid/SMTP)
3. FormSubmit.co (hidden form fallback)
4. Slack webhook notifications

### State Management
- No external state management library
- Component state managed with React hooks
- Currency selection persists through URL routing

## Important Files to Know

- **src/components/ModernShowcase.jsx**: Contains ALL pricing data, plans, features, and main business logic
- **api/send-email.js**: Serverless function for email handling with multiple provider support
- **index.html**: Contains hidden Netlify form for fallback email handling

## Deployment Configuration

Configured for both Netlify and Vercel with SPA redirect rules:
- **netlify.toml**: Build settings and redirect rules
- **vercel.json**: Rewrite rules for SPA
- **public/_redirects**: Netlify-specific redirects

## Testing Commands

Currently, no test framework is configured. When implementing tests, update this section.

## Environment Variables

For email functionality, the following environment variables may be needed:
- `SENDGRID_API_KEY`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `SLACK_WEBHOOK_URL`

See EMAIL_SETUP.md for detailed configuration.