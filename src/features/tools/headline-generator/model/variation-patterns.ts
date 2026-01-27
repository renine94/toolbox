import type { VariationPattern } from "./types";

export const VARIATION_PATTERNS: VariationPattern[] = [
  // Numbers
  {
    id: "numbers-ways",
    name: "7 Ways Pattern",
    category: "numbers",
    template: "7 Ways to {topic}",
    description: "Classic numbered list format that promises specific, actionable tips",
  },
  {
    id: "numbers-reasons",
    name: "5 Reasons Pattern",
    category: "numbers",
    template: "5 Reasons Why You Should {topic}",
    description: "Explains benefits with specific reasons",
  },
  {
    id: "numbers-steps",
    name: "10 Steps Pattern",
    category: "numbers",
    template: "10 Steps to {topic} Successfully",
    description: "Step-by-step guide format",
  },

  // Questions
  {
    id: "questions-mistakes",
    name: "Mistakes Question",
    category: "questions",
    template: "Are You Making These {topic} Mistakes?",
    description: "Creates curiosity by implying common errors",
  },
  {
    id: "questions-ready",
    name: "Ready Question",
    category: "questions",
    template: "Are You Ready to {topic}?",
    description: "Challenges readers to take action",
  },
  {
    id: "questions-what-if",
    name: "What If Question",
    category: "questions",
    template: "What If You Could {topic}?",
    description: "Opens possibilities and imagination",
  },

  // How-to
  {
    id: "howto-quick",
    name: "Quick How-to",
    category: "howto",
    template: "How to {topic} in Just 5 Minutes",
    description: "Promises quick results with time constraint",
  },
  {
    id: "howto-without",
    name: "Without Struggle",
    category: "howto",
    template: "How to {topic} Without the Struggle",
    description: "Promises easy path to success",
  },
  {
    id: "howto-like-pro",
    name: "Like a Pro",
    category: "howto",
    template: "How to {topic} Like a Pro",
    description: "Promises professional-level results",
  },

  // Lists
  {
    id: "lists-ultimate",
    name: "Ultimate Guide",
    category: "lists",
    template: "The Ultimate Guide to {topic}",
    description: "Comprehensive resource on the topic",
  },
  {
    id: "lists-complete",
    name: "Complete List",
    category: "lists",
    template: "The Complete {topic} Checklist",
    description: "Thorough checklist format",
  },
  {
    id: "lists-essential",
    name: "Essential Tips",
    category: "lists",
    template: "Essential {topic} Tips You Need to Know",
    description: "Must-know information format",
  },

  // Urgency
  {
    id: "urgency-before-late",
    name: "Before Too Late",
    category: "urgency",
    template: "{topic} Before It's Too Late",
    description: "Creates time pressure",
  },
  {
    id: "urgency-now",
    name: "Act Now",
    category: "urgency",
    template: "Why You Need to {topic} Right Now",
    description: "Emphasizes immediate action",
  },
  {
    id: "urgency-today",
    name: "Start Today",
    category: "urgency",
    template: "Start {topic} Today or Risk Falling Behind",
    description: "Fear of missing out on progress",
  },

  // FOMO
  {
    id: "fomo-wrong",
    name: "Gets Wrong",
    category: "fomo",
    template: "What Everyone Gets Wrong About {topic}",
    description: "Implies insider knowledge",
  },
  {
    id: "fomo-missing",
    name: "Missing Out",
    category: "fomo",
    template: "What You're Missing About {topic}",
    description: "Suggests hidden opportunities",
  },
  {
    id: "fomo-dont-know",
    name: "Don't Know Yet",
    category: "fomo",
    template: "The {topic} Secret Most People Don't Know Yet",
    description: "Exclusive information format",
  },

  // Comparison
  {
    id: "comparison-vs",
    name: "A vs B",
    category: "comparison",
    template: "{topic} vs Traditional Methods: Which is Better?",
    description: "Direct comparison format",
  },
  {
    id: "comparison-difference",
    name: "Key Difference",
    category: "comparison",
    template: "The Key Difference Between {topic} and Everything Else",
    description: "Highlights unique value",
  },

  // Secrets
  {
    id: "secrets-nobody",
    name: "Nobody Talks",
    category: "secrets",
    template: "The Secret to {topic} Nobody Talks About",
    description: "Exclusive insider information",
  },
  {
    id: "secrets-hidden",
    name: "Hidden Truth",
    category: "secrets",
    template: "The Hidden Truth About {topic}",
    description: "Reveals unknown facts",
  },
  {
    id: "secrets-insiders",
    name: "Insider Secrets",
    category: "secrets",
    template: "Insider Secrets to {topic} Revealed",
    description: "Professional insider knowledge",
  },

  // Beginner
  {
    id: "beginner-everything",
    name: "Everything You Need",
    category: "beginner",
    template: "{topic} for Beginners: Everything You Need to Know",
    description: "Comprehensive beginner guide",
  },
  {
    id: "beginner-simple",
    name: "Simple Guide",
    category: "beginner",
    template: "A Simple Guide to {topic} for Complete Beginners",
    description: "Easy-to-follow format",
  },
  {
    id: "beginner-first-time",
    name: "First Timer",
    category: "beginner",
    template: "{topic}: A First-Timer's Complete Handbook",
    description: "Designed for newcomers",
  },

  // Expert
  {
    id: "expert-advanced",
    name: "Advanced Strategies",
    category: "expert",
    template: "Advanced {topic} Strategies That Actually Work",
    description: "Expert-level techniques",
  },
  {
    id: "expert-masterclass",
    name: "Masterclass",
    category: "expert",
    template: "The {topic} Masterclass: Expert-Level Techniques",
    description: "Professional training format",
  },
  {
    id: "expert-pro-tips",
    name: "Pro Tips",
    category: "expert",
    template: "Pro {topic} Tips That Experts Use Daily",
    description: "Practical expert advice",
  },

  // Trending
  {
    id: "trending-why",
    name: "Why Trending",
    category: "trending",
    template: "Why {topic} is Trending in 2025",
    description: "Current relevance and popularity",
  },
  {
    id: "trending-new",
    name: "New Approach",
    category: "trending",
    template: "The New Approach to {topic} Everyone's Talking About",
    description: "Latest developments",
  },
  {
    id: "trending-future",
    name: "Future of",
    category: "trending",
    template: "The Future of {topic}: What's Coming Next",
    description: "Forward-looking predictions",
  },

  // Results
  {
    id: "results-get",
    name: "Get Results",
    category: "results",
    template: "Get Amazing Results with These {topic} Tips",
    description: "Promises tangible outcomes",
  },
  {
    id: "results-proven",
    name: "Proven Methods",
    category: "results",
    template: "Proven {topic} Methods That Deliver Results",
    description: "Evidence-based approach",
  },
  {
    id: "results-transform",
    name: "Transform",
    category: "results",
    template: "How {topic} Can Transform Your Life",
    description: "Life-changing potential",
  },

  // Negative
  {
    id: "negative-stop",
    name: "Stop Doing",
    category: "negative",
    template: "Stop {topic} The Wrong Way and Start Getting Results",
    description: "Corrects common mistakes",
  },
  {
    id: "negative-avoid",
    name: "Avoid Mistakes",
    category: "negative",
    template: "{topic} Mistakes to Avoid at All Costs",
    description: "Prevention-focused advice",
  },
  {
    id: "negative-never",
    name: "Never Do This",
    category: "negative",
    template: "Never Do This When {topic}",
    description: "Strong warning format",
  },

  // Challenge
  {
    id: "challenge-master",
    name: "Master in 30 Days",
    category: "challenge",
    template: "Can You Master {topic} in 30 Days?",
    description: "Time-bound challenge",
  },
  {
    id: "challenge-dare",
    name: "Dare to Try",
    category: "challenge",
    template: "Dare to {topic}: A Challenge Worth Taking",
    description: "Motivational challenge",
  },
  {
    id: "challenge-test",
    name: "Test Yourself",
    category: "challenge",
    template: "Test Your {topic} Skills: Are You Good Enough?",
    description: "Self-assessment challenge",
  },

  // Warning
  {
    id: "warning-cost",
    name: "Could Cost You",
    category: "warning",
    template: "Warning: Ignoring {topic} Could Cost You Big",
    description: "Risk-based warning",
  },
  {
    id: "warning-dangerous",
    name: "Dangerous Mistakes",
    category: "warning",
    template: "Dangerous {topic} Mistakes You Might Be Making",
    description: "Safety-focused alert",
  },
  {
    id: "warning-dont-skip",
    name: "Don't Skip",
    category: "warning",
    template: "Don't Skip {topic}: Here's Why It Matters",
    description: "Importance emphasis",
  },
];

export function generateHeadlineFromPattern(
  pattern: VariationPattern,
  topic: string
): string {
  return pattern.template.replace(/{topic}/g, topic);
}
