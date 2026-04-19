# Cat Health Tracker

A comprehensive health tracking application for cats, built with Next.js. Monitor your feline friend's vital statistics, medical records, nutrition, and incidents all in one place.

## Features

- **Cat Management**: Add and manage multiple cats with photos and profiles
- **Health Monitoring**:
  - Weight tracking with visual charts
  - Breathing rate monitoring with historical data
  - Medical records and incident logging
  - Medication tracking
  - Nutrition logging
- **User Authentication**: Secure login and registration with Supabase
- **Responsive Design**: Mobile-first PWA app that works offline
- **Real-time Sync**: Cloud synchronization with Supabase

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Package Manager**: pnpm
- **PWA**: next-pwa for offline functionality
- **Charts**: Recharts for data visualization
- **File Upload**: Cloudinary integration

## Getting Started

### Prerequisites

- Node.js 18+ with pnpm 10+
- Supabase account
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Project Structure

- `src/app/` - Next.js app routes and pages
- `src/components/` - Reusable React components
- `src/lib/` - Utilities, actions, and API helpers
- `src/types/` - TypeScript type definitions
- `supabase/` - Database schema and migrations

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
