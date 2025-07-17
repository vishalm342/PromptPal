const mongoose = require('mongoose');
const Prompt = require('../models/Prompt');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/promptpal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Prompt categories
const categories = [
  'writing',
  'programming',
  'marketing',
  'education',
  'business',
  'creative',
  'analysis',
  'other'
];

// Sample prompt templates
const promptTemplates = [
  {
    title: 'Blog Post Outline',
    content: 'Create a detailed outline for a blog post about {topic}. Include an introduction, 3-5 main sections with subpoints, and a conclusion.',
    category: 'writing',
    tags: ['blog', 'content', 'outline']
  },
  {
    title: 'Code Review Checklist',
    content: 'As a senior developer, review this {language} code and provide feedback on: 1) Code organization, 2) Performance optimizations, 3) Security concerns, 4) Best practices, 5) Readability.',
    category: 'programming',
    tags: ['code review', 'best practices', 'development']
  },
  {
    title: 'Marketing Email Sequence',
    content: 'Create a 5-email sequence for a {product} launch. Each email should have a compelling subject line, engaging hook, value proposition, social proof, and clear call-to-action.',
    category: 'marketing',
    tags: ['email', 'campaign', 'launch']
  },
  {
    title: 'Lesson Plan Template',
    content: 'Create a detailed lesson plan for teaching {subject} to {grade level} students. Include learning objectives, materials needed, warm-up activity, main instruction, practice activities, assessment method, and homework.',
    category: 'education',
    tags: ['teaching', 'curriculum', 'education']
  },
  {
    title: 'Business Proposal Framework',
    content: 'Create a business proposal for a {business type} that addresses: 1) Problem statement, 2) Proposed solution, 3) Market analysis, 4) Revenue model, 5) Competition, 6) Implementation timeline, 7) Financial projections.',
    category: 'business',
    tags: ['proposal', 'business plan', 'strategy']
  },
  {
    title: 'Creative Story Starter',
    content: 'Write the opening paragraph for a {genre} story that takes place in {setting} and involves a character who {character trait}. The paragraph should establish tone, introduce the protagonist, and hint at a central conflict.',
    category: 'creative',
    tags: ['writing', 'fiction', 'story']
  },
  {
    title: 'Data Analysis Report',
    content: 'Create a comprehensive analysis report for {dataset type} data that includes: 1) Executive summary, 2) Methodology, 3) Key findings with visualizations, 4) Limitations of analysis, 5) Actionable recommendations.',
    category: 'analysis',
    tags: ['data', 'analytics', 'reporting']
  },
  {
    title: 'Productivity System',
    content: 'Design a productivity system for a {profession} professional that includes: 1) Daily routines, 2) Task prioritization method, 3) Tools and apps, 4) Meeting structure, 5) Focus techniques, 6) Progress tracking.',
    category: 'other',
    tags: ['productivity', 'workflow', 'organization']
  },
  {
    title: 'Technical Documentation Template',
    content: 'Create a template for technical documentation of a {technology} project. Include sections for: overview, installation, configuration, API reference, examples, troubleshooting, and version history.',
    category: 'programming',
    tags: ['documentation', 'technical writing', 'developer']
  },
  {
    title: 'Social Media Content Calendar',
    content: 'Create a 2-week social media content calendar for a {business type} with daily posts for Instagram, Twitter, and Facebook. Include post topics, hashtags, best posting times, and engagement strategies.',
    category: 'marketing',
    tags: ['social media', 'content calendar', 'engagement']
  },
  {
    title: 'Product Launch Checklist',
    content: 'Create a comprehensive checklist for launching a new {product type}. Include pre-launch preparation, launch day activities, and post-launch follow-up tasks with timeline and responsibility assignments.',
    category: 'business',
    tags: ['product launch', 'checklist', 'project management']
  },
  {
    title: 'Research Paper Structure',
    content: 'Outline the structure for an academic research paper on {topic} including: abstract, introduction with thesis statement, literature review, methodology, results, discussion, conclusion, and references.',
    category: 'education',
    tags: ['research', 'academic', 'writing']
  },
  {
    title: 'Interview Question Bank',
    content: 'Generate 20 interview questions for a {position} role, covering technical skills, experience, behavioral scenarios, problem-solving abilities, and cultural fit.',
    category: 'business',
    tags: ['interview', 'hiring', 'HR']
  },
  {
    title: 'UX Research Plan',
    content: 'Create a UX research plan for a {digital product} that includes: research questions, methodology, participant criteria, timeline, budget, and expected deliverables.',
    category: 'programming',
    tags: ['UX', 'research', 'design']
  },
  {
    title: 'Weekly Meal Plan',
    content: 'Create a 7-day meal plan for someone following a {diet type} diet. Include breakfast, lunch, dinner, and snacks with ingredients list and simple preparation instructions.',
    category: 'other',
    tags: ['meal planning', 'nutrition', 'cooking']
  }
];

// Variables to substitute in the prompt templates
const substitutions = {
  topic: ['artificial intelligence', 'sustainable living', 'personal finance', 'mental health', 'career development', 'digital marketing trends', 'home improvement', 'parenting tips'],
  language: ['JavaScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'TypeScript', 'PHP', 'Swift'],
  product: ['SaaS platform', 'mobile app', 'online course', 'physical product', 'subscription service', 'community membership', 'digital tool'],
  subject: ['mathematics', 'science', 'history', 'literature', 'programming', 'art', 'music', 'physical education'],
  'grade level': ['elementary', 'middle school', 'high school', 'college', 'adult'],
  'business type': ['tech startup', 'local restaurant', 'e-commerce store', 'consulting firm', 'non-profit organization', 'fitness studio', 'online education platform'],
  genre: ['science fiction', 'mystery', 'fantasy', 'romance', 'horror', 'historical fiction', 'thriller', 'comedy'],
  setting: ['post-apocalyptic world', 'medieval kingdom', 'modern city', 'space colony', 'enchanted forest', 'underwater civilization', 'desert oasis'],
  'character trait': ['can see the future', 'is hiding a secret identity', 'has recently lost everything', 'possesses a magical ability', 'is on the run from authorities'],
  'dataset type': ['customer behavior', 'financial performance', 'marketing campaign results', 'health outcomes', 'environmental measurements', 'social media engagement'],
  profession: ['software developer', 'marketing manager', 'teacher', 'freelancer', 'healthcare professional', 'small business owner', 'creative professional'],
  technology: ['web application', 'mobile app', 'API', 'machine learning model', 'IoT device', 'blockchain system', 'database architecture'],
  'product type': ['software product', 'physical consumer good', 'service offering', 'digital content', 'mobile application', 'B2B solution'],
  position: ['software engineer', 'marketing manager', 'customer support specialist', 'product manager', 'data analyst', 'sales representative', 'project manager'],
  'digital product': ['mobile app', 'website', 'web application', 'e-commerce platform', 'SaaS product', 'smart home device'],
  'diet type': ['vegetarian', 'keto', 'paleo', 'vegan', 'Mediterranean', 'gluten-free', 'low-carb']
};

// Function to replace placeholders in template with random substitutions
function fillTemplate(template) {
  let filledTemplate = template;
  
  // Find all placeholders {placeholder}
  const placeholders = template.match(/\{([^}]+)\}/g) || [];
  
  // Replace each placeholder with a random substitution
  placeholders.forEach(placeholder => {
    const key = placeholder.replace('{', '').replace('}', '');
    if (substitutions[key]) {
      const randomValue = substitutions[key][Math.floor(Math.random() * substitutions[key].length)];
      filledTemplate = filledTemplate.replace(placeholder, randomValue);
    }
  });
  
  return filledTemplate;
}

// Generate a random prompt based on the templates
function generateRandomPrompt(userId) {
  // Pick a random template
  const template = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];
  
  // Fill in the template
  const content = fillTemplate(template.content);
  const title = fillTemplate(template.title);
  
  // Create prompt object
  return {
    title,
    content,
    category: template.category,
    tags: template.tags,
    isPublic: Math.random() > 0.3, // 70% chance of being public
    user: userId
  };
}

// Seed the database
async function seedDatabase() {
  try {
    // Clean up existing data
    await Prompt.deleteMany({ isSeeded: true });
    
    // Find or create a seed user
    let seedUser = await User.findOne({ email: 'seed@example.com' });
    if (!seedUser) {
      seedUser = new User({
        username: 'SeedUser',
        email: 'seed@example.com',
        password: 'password123'
      });
      await seedUser.save();
      console.log('Seed user created');
    }
    
    // Find all users to distribute prompts among them
    const users = await User.find();
    if (users.length === 0) {
      console.error('No users found in database');
      process.exit(1);
    }
    
    // Generate and save 100+ prompts
    const promptsToCreate = 120;
    const prompts = [];
    
    for (let i = 0; i < promptsToCreate; i++) {
      // Distribute prompts among users, with bias toward seed user
      const userId = Math.random() > 0.3 
        ? seedUser._id 
        : users[Math.floor(Math.random() * users.length)]._id;
      
      const promptData = generateRandomPrompt(userId);
      promptData.isSeeded = true; // Mark as a seeded prompt for future cleanup
      prompts.push(promptData);
    }
    
    // Insert all prompts
    await Prompt.insertMany(prompts);
    console.log(`Successfully created ${promptsToCreate} prompts`);
    
    // Disconnect from database
    mongoose.disconnect();
    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
