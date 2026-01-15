import DashboardLayout from '../components/layouts/DashboardLayout';
import SectionContainer from '../components/layouts/SectionContainer';
import GridLayout from '../components/layouts/GridLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import StatusChip from '../components/ui/StatusChip';
import JournalCard from '../components/dashboard/JournalCard';
import CategoryCard from '../components/dashboard/CategoryCard';
import Breadcrumb from '../components/Breadcrumb';
import { useParams } from 'react-router-dom';
import { 
  SparklesIcon, 
  HeartIcon,
  StarIcon,
  SunIcon 
} from '@heroicons/react/24/solid';

/**
 * ComponentShowcase - Demonstrates all components in the new design system
 */
const ComponentShowcase = () => {
  const { userId } = useParams();

  return (
    <DashboardLayout
      showBreadcrumb
      breadcrumbContent={
        <Breadcrumb
          items={[
            { label: 'Dashboard', to: `/home/${userId}` },
            { label: 'Component Showcase' },
          ]}
        />
      }
    >
      <SectionContainer maxWidth="7xl" padding="lg">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-serif font-bold text-slate-900">
              Sandbox UI Component Library
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A nature-inspired design system with soft pastels, organic shapes, and beautiful components
            </p>
          </div>

          {/* Color Palette */}
          <Card variant="subtle" padding="xl">
            <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-6">
              Color Palette
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Green Family */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Primary Green</p>
                <div className="space-y-2">
                  <div className="h-16 rounded-2xl bg-primary-green flex items-center justify-center text-white font-semibold shadow-nature-sm">
                    #6FCF97
                  </div>
                  <div className="h-12 rounded-xl bg-primary-green-light flex items-center justify-center text-white text-sm">
                    Light
                  </div>
                  <div className="h-12 rounded-xl bg-primary-green-pale flex items-center justify-center text-primary-green-dark text-sm">
                    Pale
                  </div>
                </div>
              </div>

              {/* Orange Family */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Accent Orange</p>
                <div className="space-y-2">
                  <div className="h-16 rounded-2xl bg-accent-orange flex items-center justify-center text-white font-semibold shadow-nature-sm">
                    #F2994A
                  </div>
                  <div className="h-12 rounded-xl bg-accent-orange-light flex items-center justify-center text-white text-sm">
                    Light
                  </div>
                  <div className="h-12 rounded-xl bg-accent-orange-pale flex items-center justify-center text-accent-orange-dark text-sm">
                    Pale
                  </div>
                </div>
              </div>

              {/* Blue Family */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Accent Blue</p>
                <div className="space-y-2">
                  <div className="h-16 rounded-2xl bg-accent-blue flex items-center justify-center text-white font-semibold shadow-nature-sm">
                    #56CCF2
                  </div>
                  <div className="h-12 rounded-xl bg-accent-blue-light flex items-center justify-center text-white text-sm">
                    Light
                  </div>
                  <div className="h-12 rounded-xl bg-accent-blue-pale flex items-center justify-center text-accent-blue-dark text-sm">
                    Pale
                  </div>
                </div>
              </div>

              {/* Teal Family */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Accent Teal</p>
                <div className="space-y-2">
                  <div className="h-16 rounded-2xl bg-accent-teal flex items-center justify-center text-white font-semibold shadow-nature-sm">
                    #2D9CDB
                  </div>
                  <div className="h-12 rounded-xl bg-accent-teal-light flex items-center justify-center text-white text-sm">
                    Light
                  </div>
                  <div className="h-12 rounded-xl bg-accent-teal-pale flex items-center justify-center text-accent-teal-dark text-sm">
                    Pale
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Buttons */}
          <Card variant="subtle" padding="xl">
            <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-6">
              Buttons
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Primary Buttons</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="blue">Blue</Button>
                  <Button variant="teal">Teal</Button>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Button Variants</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="subtle">Subtle</Button>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">With Icons</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" icon={<SparklesIcon className="w-5 h-5" />}>
                    With Icon
                  </Button>
                  <Button variant="secondary" icon={<HeartIcon className="w-5 h-5" />} iconPosition="right">
                    Icon Right
                  </Button>
                  <Button size="icon" variant="primary" icon={<StarIcon className="w-5 h-5" />} />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Sizes</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" variant="primary">Small</Button>
                  <Button size="md" variant="primary">Medium</Button>
                  <Button size="lg" variant="primary">Large</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Badges */}
          <Card variant="subtle" padding="xl">
            <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-6">
              Badges & Status Chips
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Badge Variants</p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="orange">Orange</Badge>
                  <Badge variant="blue">Blue</Badge>
                  <Badge variant="teal">Teal</Badge>
                  <Badge variant="neutral">Neutral</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Light Variants</p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary-light">Primary Light</Badge>
                  <Badge variant="orange-light">Orange Light</Badge>
                  <Badge variant="blue-light">Blue Light</Badge>
                  <Badge variant="teal-light">Teal Light</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">With Dots</p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary" dot>Active</Badge>
                  <Badge variant="orange" dot>Pending</Badge>
                  <Badge variant="blue" dot>In Progress</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Status Chips</p>
                <div className="flex flex-wrap gap-3">
                  <StatusChip status="continue" />
                  <StatusChip status="certificate" />
                  <StatusChip status="completed" />
                  <StatusChip status="review" />
                </div>
              </div>
            </div>
          </Card>

          {/* Avatars */}
          <Card variant="subtle" padding="xl">
            <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-6">
              Avatars
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Sizes</p>
                <div className="flex flex-wrap items-end gap-4">
                  <Avatar size="xs" name="John Doe" />
                  <Avatar size="sm" name="Jane Smith" />
                  <Avatar size="md" name="Alex Johnson" />
                  <Avatar size="lg" name="Sarah Williams" />
                  <Avatar size="xl" name="Mike Brown" />
                  <Avatar size="2xl" name="Emma Davis" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">With Status</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar size="md" name="Online User" status="online" />
                  <Avatar size="md" name="Busy User" status="busy" />
                  <Avatar size="md" name="Away User" status="away" />
                  <Avatar size="md" name="Offline User" status="offline" />
                </div>
              </div>
            </div>
          </Card>

          {/* Cards */}
          <Card variant="subtle" padding="xl">
            <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-6">
              Card Variants
            </h2>
            <GridLayout columns={4} gap="md">
              <Card variant="default" padding="md">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-200 flex items-center justify-center">
                    <SunIcon className="w-6 h-6 text-slate-600" />
                  </div>
                  <h3 className="font-serif font-semibold">Default</h3>
                  <p className="text-sm text-slate-600">Standard card style</p>
                </div>
              </Card>

              <Card variant="green" padding="md">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6 text-primary-green" />
                  </div>
                  <h3 className="font-serif font-semibold">Green</h3>
                  <p className="text-sm text-slate-600">Nature & growth</p>
                </div>
              </Card>

              <Card variant="orange" padding="md">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center">
                    <HeartIcon className="w-6 h-6 text-accent-orange" />
                  </div>
                  <h3 className="font-serif font-semibold">Orange</h3>
                  <p className="text-sm text-slate-600">Warmth & energy</p>
                </div>
              </Card>

              <Card variant="blue" padding="md">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center">
                    <StarIcon className="w-6 h-6 text-accent-blue" />
                  </div>
                  <h3 className="font-serif font-semibold">Blue</h3>
                  <p className="text-sm text-slate-600">Calm & clarity</p>
                </div>
              </Card>
            </GridLayout>
          </Card>

          {/* Journal Cards */}
          <div>
            <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-6">
              Journal Cards
            </h2>
            <GridLayout columns={3} gap="lg">
              <JournalCard
                title="Daily"
                iconTitle="Morning Reflection"
                date="01/14"
                time="08:30"
                message="Started the day with a peaceful meditation session. Feeling grateful for the quiet morning moments and the opportunity to set intentions."
                image="https://i.pravatar.cc/80?u=daily1"
                index={0}
              />
              <JournalCard
                title="Book"
                iconTitle="Chapter 5: The Journey Begins"
                date="01/13"
                time="14:20"
                message="The protagonist discovers a hidden path in the forest. This chapter introduces new characters and deepens the mystery surrounding the ancient symbols."
                image="https://i.pravatar.cc/80?u=book1"
                index={1}
              />
              <JournalCard
                title="Status"
                iconTitle="Feeling Energized"
                date="01/14"
                time="16:45"
                message="Completed a challenging workout and feeling accomplished. Energy levels are high and ready to tackle the evening tasks."
                image="https://i.pravatar.cc/80?u=status1"
                index={2}
              />
            </GridLayout>
          </div>

          {/* Category Cards */}
          <div>
            <h2 className="text-2xl font-serif font-semibold text-slate-900 mb-6">
              Category Cards
            </h2>
            <GridLayout columns={4} gap="md">
              <CategoryCard
                title="Transformation"
                description="Explore your journey of personal growth and change"
                image="https://picsum.photos/300/300?random=1"
                status="continue"
                variant="green"
                actions={[
                  { label: 'Continue', variant: 'primary', onClick: () => {} },
                ]}
              />
              <CategoryCard
                title="Fertility & Abundance"
                description="Nurture your creative and productive energy"
                image="https://picsum.photos/300/300?random=2"
                status="certificate"
                variant="orange"
                actions={[
                  { label: 'View Certificate', variant: 'secondary', onClick: () => {} },
                ]}
              />
              <CategoryCard
                title="Enlightenment"
                description="Deepen your understanding and awareness"
                image="https://picsum.photos/300/300?random=3"
                status="completed"
                variant="blue"
                actions={[
                  { label: 'Review', variant: 'blue', onClick: () => {} },
                ]}
              />
              <CategoryCard
                title="Vitality"
                description="Boost your physical and mental wellness"
                image="https://picsum.photos/300/300?random=4"
                status="review"
                variant="teal"
                actions={[
                  { label: 'Start', variant: 'teal', onClick: () => {} },
                ]}
              />
            </GridLayout>
          </div>
        </div>
      </SectionContainer>
    </DashboardLayout>
  );
};

export default ComponentShowcase;