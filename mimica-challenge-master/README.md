# Mimica Analytics Platform

An interactive analytics dashboard for visualizing and standardizing invoice approval processes across multiple regions.

## Overview

This dashboard helps Fortune-500 organizations identify process variations and bottlenecks in their invoice approval workflows across different geographic regions. It leverages task-mining data to provide objective insights for process standardization.

## Features

- **Cross-Region Comparison**: Visualize average transaction duration and volume by region
- **Variant Analysis**: Understand the distribution of process variants (A-E) across regions
- **Bottleneck Detection**: Identify steps with highest impact on process performance
- **Interactive Filtering**: Click on regions to filter all visualizations dynamically
- **Summary Statistics**: Key metrics displayed in easy-to-scan cards

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Navigate to the dashboard at [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page and layout
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── cards/            # Summary card components
│   ├── charts/           # Chart visualizations
│   └── tables/           # Data tables
├── contexts/             # React Context providers
├── lib/                  # Utilities and data functions
├── public/data/          # Processed JSON data files
└── working_files/        # Development documentation
```

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Context API

## Data Structure

The dashboard uses pre-processed synthetic data representing:
- 500 invoice approval transactions
- 5 geographic regions (Americas, EMEA, APAC, LATAM, North America)
- 5 process variants (A: Standard, B: Extra Approval, C: Local Logging, D: Early Termination, E: Summary Report)
- ~4,153 individual process steps

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

## Performance Targets

- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3s
- Interactive filtering response < 200ms# mimica-challenge
