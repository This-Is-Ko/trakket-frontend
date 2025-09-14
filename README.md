# Trakket Frontend

A sports viewing tracker built with Nuxt 3, Vue 3, and TypeScript. Track your watched matches across different sports and leagues, analyze your viewing habits, and get insights into your sports consumption patterns.

## Features

- Multi-Sport Support: Track football and motorsport events
- Match Logging: Record matches you've watched
- Statistics Dashboard: Analyze your viewing patterns and habits
- Team & Competition Filtering: Browse events by specific teams or competitions
- User Authentication: Login and registration system

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trakket-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file
NUXT_PUBLIC_API_BASE_URL=http://localhost:8080
NUXT_UMAMI_ID=1234
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
app/
├── components/        # Reusable Vue components
│   ├── football/      # Football-specific components
│   ├── motorsport/    # Motorsport-specific components
│   ├── Navbar.vue     # Navigation component
│   └── Footer.vue     # Footer component
├── composables/       # Vue composables
├── constants/         # Application constants
├── layouts/           # Layout components
├── middleware/        # Route middleware
├── pages/             # Application pages
│   ├── football/      # Football pages
│   ├── motorsport/    # Motorsport pages
│   └── statistics/    # Statistics pages
├── plugins/           # Nuxt plugins
├── services/          # API services
├── stores/            # Pinia stores
├── types/             # TypeScript type definitions
└── assets/            # Static assets
```

## Key Features

### Sports Tracking
- Football: Track matches from major leagues (Premier League, La Liga, Serie A, etc.)
- Motorsport: Follow Formula 1 and other racing events
- Team Filtering: Browse events by specific teams with gender indicators (M/F)
- Competition Filtering: Filter by specific leagues or competitions

### Statistics & Analytics
- View statistics about your sports viewing
- Track viewing patterns over time
- Analyze favorite teams and competitions

### User Experience
- Responsive Design: Works seamlessly on all devices
- Dark Mode: Toggle between light and dark themes
- Real-time Updates: Live status updates for events
- Intuitive Navigation: Easy-to-use interface with clear navigation

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NUXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:8080` |

### Nuxt Configuration

The application uses Nuxt 3 with the following key configurations:
- SSR: Server-side rendering enabled for public pages
- SPA: Client-side rendering for authenticated pages
- SEO: Built-in SEO optimization with meta tags

## Styling

The application uses:
- Tailwind CSS: Utility-first CSS framework
- PrimeVue: Component library with Aura theme
- Custom CSS: Additional styling in `assets/main.css`

## Authentication

- JWT-based authentication
- Automatic token refresh
- Session expiration handling
- Protected routes with middleware
