import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://teyudjxlutkavyyigwwz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRleXVkanhsdXRrYXZ5eWlnd3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYzMDQ2NjgsImV4cCI6MjAyMTg4MDY2OH0.MvaDhHKE55sSIEiasenRbR9U1LKnt7ae6dZUa89LUJg';

const supabase = createClient(supabaseUrl, supabaseKey);

const bucketName = 'new_icons';

// Icon definitions with meanings and trigger questions
const iconsv2Data = [
  { file: 'Apple.jpg', name: 'Apple', meaning: 'Knowledge & Temptation', questions: ['What knowledge or wisdom are you currently seeking?', 'What temptations challenge your path to growth?', 'How has learning changed your perspective recently?', 'What forbidden knowledge might transform your life?'] },
  { file: 'Astronaut.jpg', name: 'Astronaut', meaning: 'Exploration & Discovery', questions: ['What unknown territories are you ready to explore?', 'How do you prepare for venturing into the unknown?', 'What discoveries have shaped your worldview?', 'Where do you find the courage to explore new frontiers?'] },
  { file: 'Bear.jpg', name: 'Bear', meaning: 'Strength & Solitude', questions: ['When do you need to tap into your inner strength?', 'How does solitude help you recharge?', 'What protective instincts guide your decisions?', 'How do you balance strength with gentleness?'] },
  { file: 'Bird.jpg', name: 'Bird', meaning: 'Freedom & Perspective', questions: ['What gives you a sense of freedom?', 'How can you gain a higher perspective on current challenges?', 'What is ready to take flight in your life?', 'How do you spread your wings beyond comfort zones?'] },
  { file: 'Boat.jpg', name: 'Boat', meaning: 'Journey & Navigation', questions: ['What journey are you currently navigating?', 'How do you stay on course during turbulent times?', 'What shores are you sailing towards?', 'Who helps you navigate life\'s waters?'] },
  { file: 'Buoy.jpg', name: 'Buoy', meaning: 'Support & Stability', questions: ['What keeps you afloat during difficult times?', 'How do you provide stability for others?', 'What markers guide you through uncertainty?', 'Where do you find support when drifting?'] },
  { file: 'Camel.jpg', name: 'Camel', meaning: 'Endurance & Resourcefulness', questions: ['How do you endure long periods of challenge?', 'What resources do you store for difficult times?', 'How do you pace yourself through demanding journeys?', 'What sustains you through the desert seasons of life?'] },
  { file: 'Coin.jpg', name: 'Coin', meaning: 'Value & Exchange', questions: ['What do you truly value in life?', 'How do you exchange your time and energy?', 'What investments are you making in yourself?', 'How do you measure worth beyond material things?'] },
  { file: 'Compass.jpg', name: 'Compass', meaning: 'Direction & True North', questions: ['What is your true north in life?', 'How do you find direction when feeling lost?', 'What internal compass guides your decisions?', 'When have you had to recalibrate your direction?'] },
  { file: 'Cork.jpg', name: 'Cork', meaning: 'Resilience & Buoyancy', questions: ['How do you bounce back from setbacks?', 'What keeps you buoyant during pressure?', 'How do you maintain lightness in heavy times?', 'What resilience have you built through challenges?'] },
  { file: 'Dino.jpg', name: 'Dinosaur', meaning: 'Legacy & Extinction', questions: ['What legacy do you want to leave behind?', 'What outdated patterns need to become extinct in your life?', 'How do you adapt to avoid becoming obsolete?', 'What ancient wisdom still guides you today?'] },
  { file: 'Dragon.jpg', name: 'Dragon', meaning: 'Power & Transformation', questions: ['What inner fire drives your ambitions?', 'How do you harness your personal power?', 'What transformation are you undergoing?', 'What fears must you face to claim your power?'] },
  { file: 'Egg.jpg', name: 'Egg', meaning: 'Potential & New Beginnings', questions: ['What potential is waiting to hatch in your life?', 'How do you nurture new beginnings?', 'What needs incubation before it can emerge?', 'What new life is ready to break through?'] },
  { file: 'Elephant.jpg', name: 'Elephant', meaning: 'Memory & Wisdom', questions: ['What memories shape who you are today?', 'How do you honor your personal history?', 'What wisdom have you gained from experience?', 'How do you carry the weight of your past gracefully?'] },
  { file: 'Fish.jpg', name: 'Fish', meaning: 'Intuition & Flow', questions: ['How do you tune into your intuition?', 'Where do you need to go with the flow?', 'What currents are guiding your life right now?', 'How do you navigate emotional depths?'] },
  { file: 'Frog.jpg', name: 'Frog', meaning: 'Transformation & Cleansing', questions: ['What transformation are you leaping into?', 'How do you cleanse negativity from your life?', 'What environments nurture your growth?', 'When is it time to take the leap?'] },
  { file: 'Goat.jpg', name: 'Goat', meaning: 'Ambition & Sure-footedness', questions: ['What peaks are you climbing towards?', 'How do you maintain sure-footedness in precarious situations?', 'What ambitious goals drive you forward?', 'How do you navigate rocky terrain in life?'] },
  { file: 'Horse.jpg', name: 'Horse', meaning: 'Freedom & Drive', questions: ['What drives your passion forward?', 'How do you express your need for freedom?', 'What wild spirit needs expression in your life?', 'How do you harness your energy productively?'] },
  { file: 'Hourglass.jpg', name: 'Hourglass', meaning: 'Time & Impermanence', questions: ['How do you relate to the passage of time?', 'What would you do if time was running out?', 'How do you make each moment count?', 'What needs your attention before time passes?'] },
  { file: 'Jellyfish.jpg', name: 'Jellyfish', meaning: 'Adaptability & Grace', questions: ['How do you adapt gracefully to changing currents?', 'What teaches you to go with life\'s flow?', 'How do you move through challenges with grace?', 'What transparency serves your journey?'] },
  { file: 'LIZARD.jpg', name: 'Lizard', meaning: 'Regeneration & Awareness', questions: ['What parts of yourself are ready for regeneration?', 'How do you shed what no longer serves you?', 'What heightened awareness do you need right now?', 'How do you adapt to your environment?'] },
  { file: 'Lamp.jpg', name: 'Lamp', meaning: 'Illumination & Guidance', questions: ['What areas of your life need more light?', 'How do you guide others through darkness?', 'What illuminates your path forward?', 'Where do you find the light in dark times?'] },
  { file: 'Lantern.jpg', name: 'Lantern', meaning: 'Hope & Inner Light', questions: ['What keeps your inner light burning?', 'How do you carry hope through difficult times?', 'What lights the way on your journey?', 'How do you share your light with others?'] },
  { file: 'Mermaid.jpg', name: 'Mermaid', meaning: 'Mystery & Dual Nature', questions: ['How do you navigate between two worlds?', 'What mysteries call to you from the depths?', 'How do you embrace your dual nature?', 'What enchantment do you bring to life?'] },
  { file: 'Mirror.jpg', name: 'Mirror', meaning: 'Reflection & Truth', questions: ['What does your reflection reveal about you?', 'How do you face difficult truths about yourself?', 'What do you see when you truly look within?', 'How has self-reflection changed you?'] },
  { file: 'Mummy.jpg', name: 'Mummy', meaning: 'Preservation & Past', questions: ['What from your past needs to be preserved?', 'How do you honor those who came before?', 'What ancient wisdom guides your present?', 'What needs to be unwrapped and released?'] },
  { file: 'Peacock.jpg', name: 'Peacock', meaning: 'Beauty & Confidence', questions: ['How do you express your authentic beauty?', 'When do you need to show your true colors?', 'How do you cultivate inner confidence?', 'What are you proud to display to the world?'] },
  { file: 'Rock.jpg', name: 'Rock', meaning: 'Stability & Foundation', questions: ['What forms your solid foundation?', 'How do you remain stable during storms?', 'What unmovable truths anchor your life?', 'How do you provide stability for others?'] },
  { file: 'Seahorse.jpg', name: 'Seahorse', meaning: 'Patience & Persistence', questions: ['Where do you need more patience in your life?', 'How do you persist through slow progress?', 'What unique approach serves your journey?', 'How do you navigate gently through challenges?'] },
  { file: 'Shell.jpg', name: 'Shell', meaning: 'Protection & Inner Voice', questions: ['What protects your inner self?', 'How do you listen to your inner voice?', 'What beauty have you created from challenges?', 'When do you need to retreat into your shell?'] },
  { file: 'Snowflake.jpg', name: 'Snowflake', meaning: 'Uniqueness & Impermanence', questions: ['How do you celebrate your uniqueness?', 'What fleeting beauty do you appreciate?', 'How do you embrace your one-of-a-kind nature?', 'What temporary things deserve your attention?'] },
  { file: 'Turtle.jpg', name: 'Turtle', meaning: 'Wisdom & Patience', questions: ['What wisdom comes from slowing down?', 'How do you carry your home within you?', 'What teaches you patience on your journey?', 'How do you protect your inner sanctuary?'] },
  { file: 'Wheel.jpg', name: 'Wheel', meaning: 'Cycles & Progress', questions: ['What cycles are you experiencing in life?', 'How do you keep moving forward?', 'What drives your progress?', 'How do you break free from repetitive patterns?'] },
  { file: 'bEETLE.jpg', name: 'Beetle', meaning: 'Transformation & Persistence', questions: ['What transformation is occurring beneath the surface?', 'How do you persist through challenges?', 'What hard shell protects your growth?', 'How do you emerge changed from difficulties?'] },
];

async function generateUrls() {
  console.log('Generating signed URLs for iconsv2...\n');

  const results = [];

  for (const icon of iconsv2Data) {
    // Files are at /new_icons/iconsv2/iconsv2/{filename}
    const filePath = `iconsv2/iconsv2/${icon.file}`;

    // Generate signed URL (1 year = 31536000 seconds)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 31536000);

    if (error) {
      console.log(`❌ ${icon.name}: ${error.message}`);
    } else {
      console.log(`✓ ${icon.name}`);
      results.push({
        ...icon,
        signedUrl: data.signedUrl
      });
    }
  }

  // Output JavaScript code for questions.jsx
  console.log('\n\n// === ADD TO questions.jsx as iconsv2_questions ===\n');
  console.log('export const iconsv2_questions = [');

  for (const r of results) {
    console.log(`  {
    journal_type: "daily_journal",
    name: "${r.name}",
    meaning: "${r.meaning}",
    icon: "${r.signedUrl}",
    trigger_question: ${JSON.stringify(r.questions)},
    uuid: "d2_${r.name.toLowerCase().replace(/\s+/g, '_')}",
  },`);
  }

  console.log('];');

  return results;
}

generateUrls().catch(console.error);
