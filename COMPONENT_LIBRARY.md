# Sandbox UI Component Library

A nature-inspired design system for SandboxLife with soft pastels, organic shapes, and beautiful components.

## 🎨 Design Philosophy

The Sandbox UI component library follows a **nature-inspired aesthetic** with:
- **Soft pastel colors** that evoke calm and serenity
- **Organic shapes** with generous border radius (24-32px)
- **Gentle shadows** for subtle depth
- **Card-first layouts** for content organization
- **Generous white space** for clarity

## 📚 Component Overview

### Base UI Components (`src/components/ui/`)

#### Card
Foundational card component with multiple variants and gradient borders.

```jsx
import { Card } from '../components/ui';

// Variants
<Card variant="default">Content</Card>
<Card variant="green">Nature theme</Card>
<Card variant="orange">Warmth theme</Card>
<Card variant="blue">Calm theme</Card>
<Card variant="teal">Balance theme</Card>
<Card variant="subtle">Muted background</Card>

// Props
- variant: 'default' | 'green' | 'orange' | 'blue' | 'teal' | 'subtle'
- padding: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- hover: boolean
- onClick: function
- as: elementType (default: 'div')
```

#### Badge
Status indicators and labels.

```jsx
import { Badge } from '../components/ui';

<Badge variant="primary">Active</Badge>
<Badge variant="orange" dot>Pending</Badge>
<Badge variant="outline" size="sm">Draft</Badge>

// Props
- variant: 'primary' | 'primary-light' | 'orange' | 'orange-light' | 'blue' | 'blue-light' | 'teal' | 'teal-light' | 'neutral' | 'outline'
- size: 'sm' | 'md' | 'lg'
- dot: boolean (shows indicator dot)
```

#### Button
Action buttons with multiple variants and states.

```jsx
import { Button } from '../components/ui';
import { StarIcon } from '@heroicons/react/24/solid';

<Button variant="primary">Save Changes</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="primary" icon={<StarIcon />}>Favorite</Button>
<Button size="icon" variant="ghost" icon={<StarIcon />} />

// Props
- variant: 'primary' | 'secondary' | 'blue' | 'teal' | 'outline' | 'ghost' | 'subtle'
- size: 'sm' | 'md' | 'lg' | 'icon'
- fullWidth: boolean
- disabled: boolean
- icon: ReactNode
- iconPosition: 'left' | 'right'
```

#### Avatar
User avatars with fallback initials and status indicators.

```jsx
import { Avatar } from '../components/ui';

<Avatar src="/path/to/image.jpg" name="John Doe" size="md" />
<Avatar name="Jane Smith" status="online" />

// Props
- src: string (optional)
- name: string (for initials fallback)
- size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
- status: 'online' | 'offline' | 'busy' | 'away' (optional)
```

#### StatusChip
Status indicators with icons (Continue, Certificate, etc.)

```jsx
import { StatusChip } from '../components/ui';

<StatusChip status="continue" />
<StatusChip status="certificate" size="lg" />

// Props
- status: 'continue' | 'certificate' | 'completed' | 'review'
- size: 'sm' | 'md' | 'lg'
```

### Navigation Components (`src/components/navigation/`)

#### Sidebar
Collapsible sidebar with sections and navigation cards.

```jsx
import { Sidebar } from '../components/navigation';

<Sidebar isOpen={isMenuOpen} onClose={toggleMenu} userId={userId} />

// Props
- isOpen: boolean
- onClose: function
- userId: string
```

#### SidebarSection
Collapsible section within sidebar.

```jsx
import { SidebarSection } from '../components/navigation';

<SidebarSection title="Quick Actions" defaultOpen>
  {/* Content */}
</SidebarSection>

// Props
- title: string
- children: ReactNode
- defaultOpen: boolean
```

#### NavCard
Card-style navigation item.

```jsx
import { NavCard } from '../components/navigation';

<NavCard
  to="/home"
  title="Dashboard"
  description="Your main overview"
  variant="green"
/>

// Props
- to: string (route path)
- title: string
- description: string
- icon: ReactNode (optional)
- variant: 'default' | 'green' | 'orange' | 'blue' | 'teal'
- onClick: function (optional)
```

### Dashboard Components (`src/components/dashboard/`)

#### JournalCard
Enhanced journal entry card with nature theme.

```jsx
import { JournalCard } from '../components/dashboard';

<JournalCard
  title="Daily"
  iconTitle="Morning Reflection"
  date="01/14"
  time="08:30"
  message="Today's journal entry..."
  image="/path/to/image.jpg"
  index={0}
  onClick={() => {}}
/>

// Props
- title: string ('Daily' | 'Book' | 'Status')
- iconTitle: string
- date: string
- time: string
- message: string
- image: string (optional)
- index: number (for "Latest" badge)
- onClick: function (optional)
```

#### CategoryCard
Card for collection/category views with actions.

```jsx
import { CategoryCard } from '../components/dashboard';

<CategoryCard
  title="Transformation"
  description="Explore your journey"
  image="/path/to/image.jpg"
  status="continue"
  variant="green"
  actions={[
    { label: 'Continue', variant: 'primary', onClick: () => {} }
  ]}
/>

// Props
- title: string
- description: string (optional)
- image: string (optional)
- status: 'continue' | 'certificate' | 'completed' | 'review'
- variant: 'default' | 'green' | 'orange' | 'blue' | 'teal'
- actions: Array<{ label: string, onClick: function, variant: string }>
- onClick: function (optional)
```

#### ActivityCard
Compact recent activity item.

```jsx
import { ActivityCard } from '../components/dashboard';

<ActivityCard
  title="Completed Daily Journal"
  timestamp="01/14 08:30"
  onClick={() => {}}
/>

// Props
- title: string
- timestamp: string
- onClick: function (optional)
```

### Layout Components (`src/components/layouts/`)

#### DashboardLayout
Main layout wrapper with sidebar and topbar.

```jsx
import { DashboardLayout } from '../components/layouts';

<DashboardLayout
  showBreadcrumb
  breadcrumbContent={<Breadcrumb items={...} />}
>
  {/* Page content */}
</DashboardLayout>

// Props
- children: ReactNode
- showBreadcrumb: boolean
- breadcrumbContent: ReactNode
```

#### GridLayout
Responsive grid for cards.

```jsx
import { GridLayout } from '../components/layouts';

<GridLayout columns={3} gap="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</GridLayout>

// Props
- children: ReactNode
- columns: 1 | 2 | 3 | 4 | 'auto'
- gap: 'sm' | 'md' | 'lg' | 'xl'
```

#### SectionContainer
Consistent section spacing and max-width.

```jsx
import { SectionContainer } from '../components/layouts';

<SectionContainer maxWidth="6xl" padding="default">
  {/* Content */}
</SectionContainer>

// Props
- children: ReactNode
- maxWidth: '4xl' | '5xl' | '6xl' | '7xl' | 'full'
- padding: 'none' | 'sm' | 'default' | 'lg'
```

## 🎨 Design Tokens

All design tokens are defined in `src/styles/design-tokens.css` and extended in `tailwind.config.js`.

### Colors

```css
/* Primary - Green Family */
--color-primary-green: #6FCF97
--color-primary-green-light: #7FD899
--color-primary-green-pale: #D4FCD9
--color-primary-green-dark: #5CB87E

/* Accent - Orange Family */
--color-accent-orange: #F2994A
--color-accent-orange-light: #FF9E5A
--color-accent-orange-pale: #FEF3D4
--color-accent-orange-dark: #E08839

/* Accent - Blue Family */
--color-accent-blue: #56CCF2
--color-accent-blue-light: #66D4F1
--color-accent-blue-pale: #D4EDFC
--color-accent-blue-dark: #3DB8E0

/* Accent - Teal Family */
--color-accent-teal: #2D9CDB
--color-accent-teal-light: #3AA5E0
--color-accent-teal-pale: #C5E7F5
--color-accent-teal-dark: #2389C7
```

### Using in Tailwind

```jsx
// Background colors
<div className="bg-primary-green">Green background</div>
<div className="bg-accent-orange-pale">Pale orange background</div>

// Text colors
<p className="text-accent-blue">Blue text</p>
<p className="text-primary-green-dark">Dark green text</p>

// Border colors
<div className="border-2 border-accent-teal">Teal border</div>
```

### Shadows

```jsx
// Nature-inspired shadows (soft and subtle)
<Card className="shadow-nature-sm">Small shadow</Card>
<Card className="shadow-nature-md">Medium shadow</Card>
<Card className="shadow-nature-lg">Large shadow</Card>
<Card className="shadow-nature-xl">Extra large shadow</Card>
```

### Border Radius

```jsx
<div className="rounded-2xl">20px radius</div>
<div className="rounded-3xl">24px radius</div>
<div className="rounded-4xl">32px radius</div>
```

## 🚀 Usage Examples

### Creating a Dashboard Page

```jsx
import { DashboardLayout, SectionContainer, GridLayout } from '../components/layouts';
import { JournalCard, CategoryCard } from '../components/dashboard';
import { Card, Button } from '../components/ui';
import Breadcrumb from '../components/Breadcrumb';

function MyDashboard() {
  return (
    <DashboardLayout
      showBreadcrumb
      breadcrumbContent={
        <Breadcrumb items={[
          { label: 'Home', to: '/home' },
          { label: 'Dashboard' }
        ]} />
      }
    >
      <SectionContainer maxWidth="7xl">
        <div className="space-y-8">
          <Card variant="subtle" padding="lg">
            <h1 className="text-2xl font-serif font-semibold">Welcome back!</h1>
            <p className="text-slate-600 mt-2">Here's what's happening today</p>
          </Card>

          <GridLayout columns={3} gap="lg">
            <JournalCard
              title="Daily"
              iconTitle="Morning thoughts"
              date="01/14"
              time="08:30"
              message="Today's reflection..."
              index={0}
            />
            {/* More cards */}
          </GridLayout>
        </div>
      </SectionContainer>
    </DashboardLayout>
  );
}
```

### Creating Custom Cards

```jsx
import { Card, Badge, Button } from '../components/ui';

function CustomCard() {
  return (
    <Card variant="green" padding="lg" hover>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-serif font-semibold">Card Title</h3>
        <Badge variant="primary-light">New</Badge>
      </div>
      <p className="text-sm text-slate-600 mb-4">Card description goes here</p>
      <Button variant="primary" fullWidth>Take Action</Button>
    </Card>
  );
}
```

## 📖 Live Showcase

Visit `/component-showcase/:userId` to see all components in action with interactive examples.

## 🎯 Best Practices

1. **Consistent Spacing**: Use the spacing scale (4, 8, 12, 16, 20, 24, 32, 40, 48px)
2. **Color Usage**:
   - Green: Growth, success, daily activities
   - Orange: Energy, warmth, important actions
   - Blue: Calm, learning, information
   - Teal: Balance, secondary actions
3. **Shadow Application**: Use nature-inspired shadows for depth, not decoration
4. **Border Radius**: Stick to 2xl (24px), 3xl (28px), or 4xl (32px) for cards
5. **Typography**: Use serif fonts for headings, sans-serif for body text
6. **Component Composition**: Build complex UIs by composing simple components

## 🔧 Customization

### Extending Colors

Add new colors in `tailwind.config.js`:

```js
extend: {
  colors: {
    custom: {
      purple: '#A78BFA',
      'purple-light': '#C4B5FD',
      'purple-pale': '#EDE9FE',
    }
  }
}
```

### Creating New Variants

Extend existing components with new variants:

```jsx
// In Card.jsx
const variantClasses = {
  // ... existing variants
  purple: 'bg-custom-purple-pale border-2 border-custom-purple-light',
};
```

## 📦 Component Import Paths

```jsx
// Base UI
import { Card, Badge, Button, Avatar, StatusChip } from '../components/ui';

// Navigation
import { Sidebar, SidebarSection, NavCard } from '../components/navigation';

// Dashboard
import { JournalCard, CategoryCard, ActivityCard } from '../components/dashboard';

// Layouts
import { DashboardLayout, GridLayout, SectionContainer } from '../components/layouts';
```

---

Built with ❤️ for SandboxLife - A nature-inspired journaling experience