# go2rtc UI Modernization Plan

## Current State Analysis

### Existing UI Architecture
The current go2rtc UI (`/www`) is a minimalist, vanilla JavaScript web interface consisting of:

- **Technology Stack**: Pure HTML/CSS/JavaScript (ES8)
- **Main Pages**:
  - `index.html` - Dashboard with real-time stream status
  - `stream.html` - Multi-protocol video player
  - `add.html` - Stream addition interface
  - `editor.html` - Configuration editor
  - `log.html` - Log viewer

### Key Pain Points
1. **Dated Visual Design** - Basic gray/beige color scheme with old-style gradients
2. **Non-Responsive Layout** - Table-based layout that doesn't adapt to mobile
3. **Limited Visual Feedback** - No loading states, basic buttons
4. **Inline Styles** - Most CSS embedded directly in HTML
5. **No Modern UI Patterns** - Missing modern design system consistency

### Core Functionality Analysis
- **Real-time Updates**: Auto-refreshes stream list every second via `/api/streams`
- **Multi-Protocol Video**: WebRTC, MSE, HLS, MJPEG support
- **Dark Mode**: System-aware with manual toggle
- **Configuration**: YAML editor with syntax highlighting
- **Logging**: Real-time log streaming via `/api/log`

## Modernization Strategy

### New Architecture: SvelteKit + shadcn-svelte

#### Technology Stack
- **Framework**: SvelteKit 2.16.0 with Svelte 5
- **UI Components**: shadcn-svelte
- **Data Fetching**: TanStack Query Svelte
- **Styling**: Tailwind CSS 4.0
- **Build Tool**: Vite 6.2.6
- **Type Safety**: TypeScript 5.0
- **Adapter**: Static adapter for production builds
- **Testing**: Vitest + Playwright
- **Linting**: ESLint + Prettier
- **Internationalization**: Paraglide (already included)

#### Project Structure (Actual Scaffold)
```
/app/
├── src/
│   ├── lib/
│   │   └── index.ts          # Library exports
│   ├── routes/
│   │   ├── +layout.svelte    # Root layout (Svelte 5 syntax)
│   │   ├── +page.svelte      # Dashboard (index)
│   │   └── demo/             # Demo pages (to be replaced)
│   ├── app.css               # Global styles
│   ├── app.d.ts              # TypeScript definitions
│   ├── app.html              # HTML template
│   └── hooks.ts/.server.ts   # SvelteKit hooks
├── static/
│   └── favicon.svg
├── e2e/                      # Playwright E2E tests
├── messages/                 # i18n messages (en/ru)
├── project.inlang/           # Paraglide i18n config
├── svelte.config.js          # SvelteKit config with static adapter
├── vite.config.ts            # Vite configuration
├── tailwind.config.*         # Tailwind CSS 4.0 config
└── package.json
```

#### Additional Structure Needed
```
/app/src/lib/
├── components/
│   ├── ui/                   # shadcn-svelte components
│   ├── blocks/               # shadcn-svelte blocks
│   ├── video/                # Video player components
│   └── dashboard/            # Dashboard-specific components
├── stores/                   # Svelte stores for state management
├── services/                 # API interaction services
├── queries/                  # TanStack Query definitions
└── utils/                    # Utility functions
```

## Layout & Component Strategy

### shadcn-svelte Blocks for Base Layout

#### Main Layout (Root Layout)
- **Sidebar Component**: Use `Sidebar.Provider` with collapsible navigation
- **Dashboard Block**: Adapt the official dashboard example for stream monitoring
- **Theme Provider**: Built-in light/dark mode with system preference detection

#### Recommended Blocks to Adapt

**Dashboard Block** (`shadcn-svelte.com/examples/dashboard`)
- Clean metrics display perfect for stream statistics
- Responsive cards layout for stream status
- Built-in theme switching
- Adaptable for real-time data display

**Sidebar Navigation**
- Collapsible sidebar with icon-only mode
- Keyboard shortcuts (cmd+b/ctrl+b)
- Responsive design
- Perfect for: Streams, Add Stream, Config, Logs navigation

### shadcn-svelte Components for Features

#### Dashboard (`/`)
- **Table** → `<Table>` with sortable columns
- **Button** → `<Button>` with proper variants
- **Badge** → `<Badge>` for stream status indicators
- **Card** → `<Card>` for stream information panels
- **Switch** → `<Switch>` for dark mode toggle
- **Separator** → `<Separator>` for visual grouping

#### Stream Player (`/stream/[id]`)
- **Card** → `<Card>` for video container
- **Tabs** → `<Tabs>` for multiple stream switching
- **Button** → `<Button>` for player controls
- **Select** → `<Select>` for quality/format selection
- **Progress** → `<Progress>` for loading states
- **Alert** → `<Alert>` for connection errors

#### Add Stream (`/add`)
- **Card** → `<Card>` for form container
- **Input** → `<Input>` for stream URL
- **Label** → `<Label>` for form fields
- **Button** → `<Button>` for submission
- **Textarea** → `<Textarea>` for descriptions
- **Select** → `<Select>` for stream types

#### Configuration Editor (`/editor`)
- **Card** → `<Card>` for editor container
- **Button** → `<Button>` for save/reset actions
- **Alert** → `<Alert>` for validation messages
- **Badge** → `<Badge>` for syntax highlighting
- **Separator** → `<Separator>` for sections

#### Log Viewer (`/logs`)
- **Card** → `<Card>` for log container
- **ScrollArea** → `<ScrollArea>` for log content
- **Button** → `<Button>` for clear/download
- **Badge** → `<Badge>` for log levels
- **Switch** → `<Switch>` for auto-scroll toggle

## Implementation Plan

### Phase 1: Project Setup
1. **Initialize SvelteKit**: `npm create svelte@latest app`
2. **Install Dependencies**:
   ```bash
   # Core dependencies
   npm install lucide-svelte @tanstack/svelte-query mode-watcher
   
   # Initialize shadcn-svelte
   npx shadcn-svelte@latest init
   ```
3. **Add Essential Components**:
   ```bash
   npx shadcn-svelte@latest add sidebar
   npx shadcn-svelte@latest add table
   npx shadcn-svelte@latest add card
   npx shadcn-svelte@latest add button
   npx shadcn-svelte@latest add badge
   npx shadcn-svelte@latest add alert
   npx shadcn-svelte@latest add input
   npx shadcn-svelte@latest add label
   npx shadcn-svelte@latest add textarea
   npx shadcn-svelte@latest add select
   npx shadcn-svelte@latest add switch
   npx shadcn-svelte@latest add progress
   npx shadcn-svelte@latest add tabs
   npx shadcn-svelte@latest add scroll-area
   npx shadcn-svelte@latest add separator
   ```
4. **Copy Dashboard Block**: Adapt the official dashboard example as base layout
5. **Configure Tailwind**: Already configured with Tailwind CSS 4.0
6. **Setup TypeScript**: Already configured with strict mode
7. **Configure Static Adapter**: Already configured for production builds

### Phase 2: Core Infrastructure
1. **Query Client Setup**: Configure TanStack Query for polling and caching
2. **API Service Layer**: Create typed API clients for all endpoints
3. **State Management**: Implement Svelte stores for:
   - UI state (dark mode, loading states)
   - Local component state
4. **Routing**: Create SvelteKit routes to match existing pages:
   - `/` → Dashboard (replace demo pages)
   - `/stream/[id]` → Stream viewer
   - `/add` → Add stream
   - `/editor` → Config editor
   - `/logs` → Log viewer
   - `/network` → Network visualization
   - Plus legacy routes for compatibility

### Phase 3: Component Development
1. **Adapt Dashboard Block**: Copy and customize the official dashboard example
2. **Implement Sidebar Navigation**: Use collapsible sidebar for main navigation
3. **Create Stream Components**: Build on Card and Table components
4. **Video Player**: Modern video component with controls
5. **Forms**: Add stream and configuration forms using shadcn-svelte form components

### Phase 4: Advanced Features
1. **Real-time Updates**: Optimized polling with TanStack Query
2. **Responsive Design**: Mobile-first approach
3. **Accessibility**: ARIA labels, keyboard navigation
4. **Performance**: Virtual scrolling for large lists

## Video Player Integration

### Current Implementation Analysis
The existing video player supports:
- **WebRTC**: Via `video-rtc.js`
- **MSE**: Via `video-stream.js`
- **HLS**: Native browser support
- **MJPEG**: Image streaming

### Modern Video Component Design
```svelte
<VideoPlayer
  src={streamUrl}
  protocols={['webrtc', 'mse', 'hls', 'mjpeg']}
  autoPlay={true}
  controls={true}
  muted={false}
  class="w-full h-full"
/>
```

### Key Improvements
1. **Protocol Selection**: Automatic fallback with manual override
2. **Adaptive Quality**: Dynamic resolution adjustment
3. **Error Handling**: Graceful degradation and retry logic
4. **Performance**: Lazy loading and memory management

## API Integration Strategy

### Existing Endpoints
- `GET /api/streams` - Stream list and status
- `POST /api/streams` - Add new stream
- `GET /api/config` - Configuration retrieval
- `POST /api/config` - Configuration update
- `GET /api/log` - Log streaming

### TanStack Query Integration

#### Query Client Setup
```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/svelte-query'
import { browser } from '$app/environment'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: browser, // Disable on server for SSR
      staleTime: 5000, // Consider data stale after 5 seconds
      refetchOnWindowFocus: true,
      retry: 3,
    },
  },
})
```

#### Polling Queries
```typescript
// lib/queries/streams.ts
import { createQuery } from '@tanstack/svelte-query'

// Real-time stream status polling
export const useStreamsQuery = (pollInterval = 3000) => {
  return createQuery({
    queryKey: ['streams'],
    queryFn: async () => {
      const response = await fetch('/api/streams')
      return response.json()
    },
    refetchInterval: pollInterval,
    refetchOnWindowFocus: true,
  })
}

// Conditional polling based on user activity
export const useStreamStatusQuery = (streamId: string, enabled = true) => {
  return createQuery({
    queryKey: ['stream', streamId, 'status'],
    queryFn: async () => {
      const response = await fetch(`/api/streams/${streamId}/status`)
      return response.json()
    },
    refetchInterval: enabled ? 2000 : false,
    enabled,
  })
}
```

#### Mutations for Updates
```typescript
// lib/mutations/streams.ts
import { createMutation, useQueryClient } from '@tanstack/svelte-query'

export const useAddStreamMutation = () => {
  const queryClient = useQueryClient()
  
  return createMutation({
    mutationFn: async (stream: NewStream) => {
      const response = await fetch('/api/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stream),
      })
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch streams list
      queryClient.invalidateQueries({ queryKey: ['streams'] })
    },
  })
}
```

### Service Layer Architecture
```typescript
// lib/services/api.ts
export class StreamService {
  async getStreams(): Promise<Stream[]>
  async addStream(stream: NewStream): Promise<void>
  async deleteStream(id: string): Promise<void>
}

export class ConfigService {
  async getConfig(): Promise<Config>
  async updateConfig(config: Config): Promise<void>
}
```

## Migration Strategy

### Development Approach
1. **Parallel Development**: Build new UI in `/app` alongside existing `/www`
2. **Progressive Enhancement**: Start with basic functionality, add features incrementally
3. **A/B Testing**: Use feature flags to test new components
4. **Gradual Rollout**: Replace pages one by one

### Deployment Strategy
1. **Development**: Serve from `/app` during development
2. **Production**: Build static files to replace `/www`
3. **Fallback**: Keep original `/www` as backup during transition

## Design System

### Color Palette
Using shadcn-svelte's default theme with customizations:
- **Primary**: Modern blue (#0F172A)
- **Secondary**: Subtle gray (#64748B)
- **Success**: Green for online streams
- **Warning**: Orange for degraded streams
- **Error**: Red for failed streams

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Mono**: For configuration and logs

### Spacing
- **Grid**: 8px base unit
- **Containers**: Max width with responsive padding
- **Components**: Consistent spacing using Tailwind classes

## Performance Considerations

### Bundle Size
- **Tree Shaking**: Remove unused shadcn-svelte components
- **Code Splitting**: Lazy load video player and editor
- **Asset Optimization**: Compress images and icons

### Runtime Performance
- **Virtual Lists**: For large stream lists
- **Smart Polling**: TanStack Query's intelligent caching and deduplication
- **Background Updates**: Automatic refetching with stale-while-revalidate
- **Query Invalidation**: Targeted cache updates instead of full refreshes

## Accessibility

### WCAG Compliance
- **Keyboard Navigation**: All interactive elements
- **Screen Reader Support**: Proper ARIA labels
- **Color Contrast**: Meet AA standards
- **Focus Management**: Logical tab order

### Responsive Design
- **Mobile First**: Touch-friendly controls
- **Breakpoints**: Tailwind's responsive system
- **Flexible Layouts**: CSS Grid and Flexbox

## Testing Strategy

### Unit Tests
- **Component Testing**: Svelte Testing Library
- **Service Testing**: Mock API responses
- **Utility Testing**: Pure function validation

### Integration Tests
- **E2E Testing**: Playwright for user flows
- **API Testing**: Test against real backend
- **Performance Testing**: Lighthouse CI

## TanStack Query Benefits

### Real-time Data Management
- **Intelligent Polling**: Automatic background refetching with configurable intervals
- **Cache Management**: Efficient data caching with automatic invalidation
- **Stale-While-Revalidate**: Show cached data while fetching fresh data
- **Query Deduplication**: Prevent duplicate API calls for the same data

### User Experience Improvements
- **Loading States**: Built-in loading, error, and success states
- **Optimistic Updates**: Immediate UI updates with rollback on failure
- **Background Synchronization**: Keep data fresh without user interaction
- **Offline Support**: Cache data for offline viewing

### Performance Optimizations
- **Request Cancellation**: Automatic cleanup of abandoned requests
- **Parallel Queries**: Efficient handling of multiple concurrent requests
- **Selective Refetching**: Only update specific queries when needed
- **Memory Management**: Automatic cleanup of unused query cache

### Developer Experience
- **TypeScript Support**: Full type safety for queries and mutations
- **DevTools**: Comprehensive debugging and monitoring tools
- **Error Handling**: Centralized error management with retry logic
- **Testing**: Built-in testing utilities for query mocking

## Real-time Polling Strategy

### Stream Status Polling
```svelte
<!-- Dashboard.svelte -->
<script>
  import { useStreamsQuery } from '$lib/queries/streams'
  
  // Poll every 3 seconds, pause when window is not focused
  const streamsQuery = useStreamsQuery(3000)
  
  $: streams = $streamsQuery.data ?? []
  $: isLoading = $streamsQuery.isLoading
  $: error = $streamsQuery.error
</script>

{#if isLoading}
  <div>Loading streams...</div>
{:else if error}
  <div>Error: {error.message}</div>
{:else}
  {#each streams as stream}
    <StreamCard {stream} />
  {/each}
{/if}
```

### Adaptive Polling
```typescript
// Adjust polling frequency based on stream activity
export const useAdaptiveStreamQuery = (streamId: string) => {
  let pollInterval = $state(5000) // Start with 5 second intervals
  
  return createQuery(() => ({
    queryKey: ['stream', streamId],
    queryFn: fetchStreamData,
    refetchInterval: pollInterval,
    onSuccess: (data) => {
      // Reduce polling if stream is stable
      if (data.status === 'stable') {
        pollInterval = 10000
      } else {
        pollInterval = 2000 // Increase for unstable streams
      }
    },
  }))
}
```

## shadcn-svelte Blocks Implementation

### Base Layout Structure
```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { Sidebar } from '$lib/components/ui/sidebar'
  import { QueryClientProvider } from '@tanstack/svelte-query'
  import { queryClient } from '$lib/queryClient'
  import { ModeWatcher } from 'mode-watcher'
</script>

<QueryClientProvider client={queryClient}>
  <ModeWatcher />
  <Sidebar.Provider>
    <div class="flex h-screen bg-background">
      <!-- Sidebar Navigation -->
      <Sidebar.Root class="border-r">
        <Sidebar.Content>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton href="/">
                Dashboard
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton href="/add">
                Add Stream
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton href="/editor">
                Configuration
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton href="/logs">
                Logs
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Content>
      </Sidebar.Root>
      
      <!-- Main Content -->
      <div class="flex-1 overflow-auto">
        <main class="container mx-auto p-6">
          <slot />
        </main>
      </div>
    </div>
  </Sidebar.Provider>
</QueryClientProvider>
```

### Dashboard Page Structure
```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { Card } from '$lib/components/ui/card'
  import { Badge } from '$lib/components/ui/badge'
  import { Button } from '$lib/components/ui/button'
  import { useStreamsQuery } from '$lib/queries/streams'
  
  const streamsQuery = useStreamsQuery(3000)
  $: streams = $streamsQuery.data ?? []
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold">Stream Dashboard</h1>
    <Button href="/add">Add Stream</Button>
  </div>
  
  <!-- Metrics Cards -->
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card.Root>
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">Total Streams</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold">{streams.length}</div>
      </Card.Content>
    </Card.Root>
    
    <Card.Root>
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">Active Streams</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="text-2xl font-bold text-green-600">
          {streams.filter(s => s.status === 'online').length}
        </div>
      </Card.Content>
    </Card.Root>
  </div>
  
  <!-- Streams Table -->
  <Card.Root>
    <Card.Header>
      <Card.Title>Stream Status</Card.Title>
    </Card.Header>
    <Card.Content>
      <!-- Stream table content -->
    </Card.Content>
  </Card.Root>
</div>
```

### Benefits of Using shadcn-svelte Blocks

#### Time Savings
- **Pre-built Layouts**: Dashboard structure already designed and tested
- **Consistent Design**: Professional appearance out of the box
- **Responsive by Default**: Mobile-first design patterns
- **Theme Integration**: Built-in dark/light mode support

#### Code Quality
- **Accessibility**: WCAG compliant components
- **TypeScript Support**: Full type safety
- **Best Practices**: Following Svelte and UI conventions
- **Maintainability**: Well-structured, documented code

#### Minimalist Approach
- **Clean Interface**: Focus on essential functionality
- **Efficient Navigation**: Collapsible sidebar saves space
- **Data-Focused**: Metrics cards highlight key information
- **Uncluttered Design**: Whitespace and proper spacing

## Conclusion

This modernization plan transforms go2rtc from a basic vanilla JS interface into a modern, maintainable, and user-friendly application. By leveraging SvelteKit's performance, shadcn-svelte's design system with pre-built blocks, and TanStack Query's intelligent data management, we create a professional-grade UI that enhances the user experience while maintaining all existing functionality.

The addition of TanStack Query provides:
- **Efficient real-time updates** replacing the current 1-second polling
- **Intelligent caching** reducing server load and improving performance
- **Better user experience** with loading states and optimistic updates
- **Robust error handling** with automatic retry logic

The shadcn-svelte blocks approach provides:
- **Rapid development** with pre-built, tested components
- **Professional design** with minimal customization needed
- **Consistent UX** following modern design patterns
- **Accessibility compliance** built-in from the start

The phased approach ensures minimal disruption to users while providing clear milestones for development progress.