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

// Ultra-refined, professional prompt templates that showcase PromptPal's AI capabilities
const promptTemplates = [
  {
    title: 'AI-Enhanced Blog Content Strategy',
    content: 'Craft a comprehensive 2000-word blog post about {topic} targeting {audience} professionals. Structure: compelling hook with statistics, expert-level introduction, 5 actionable insights with real-world case studies, data-driven evidence, expert quotes, practical implementation steps, SEO optimization with LSI keywords, social media snippets, and conversion-optimized CTA.',
    category: 'writing',
    tags: ['AI content', 'SEO strategy', 'thought leadership']
  },
  {
    title: 'Enterprise-Grade Code Architecture Review',
    content: 'Conduct a comprehensive architectural review of this {language} application. Evaluate: scalability patterns, security vulnerabilities, performance bottlenecks, SOLID principles adherence, design patterns implementation, testing coverage, documentation quality, CI/CD integration, monitoring setup, and provide specific refactoring recommendations with priority levels.',
    category: 'programming',
    tags: ['architecture', 'enterprise', 'code quality']
  },
  {
    title: 'Data-Driven Growth Marketing Framework',
    content: 'Design a complete growth marketing strategy for {product} targeting {market_segment}. Include: customer acquisition cost analysis, lifetime value optimization, multi-channel attribution modeling, conversion funnel optimization, A/B testing framework, retention campaigns, viral mechanics, referral programs, and automated email sequences with behavioral triggers.',
    category: 'marketing',
    tags: ['growth hacking', 'analytics', 'conversion optimization']
  },
  {
    title: 'Interactive Learning Experience Design',
    content: 'Create an immersive learning program for {subject} incorporating cognitive science principles. Design: learning objectives with Bloom\'s taxonomy, microlearning modules, gamification elements, spaced repetition system, peer collaboration features, adaptive assessment methods, real-world project applications, and competency-based progression tracking.',
    category: 'education',
    tags: ['instructional design', 'learning science', 'engagement']
  },
  {
    title: 'Strategic Business Transformation Plan',
    content: 'Develop a comprehensive digital transformation strategy for a {business_type}. Cover: market disruption analysis, competitive intelligence, technology adoption roadmap, organizational change management, stakeholder alignment, ROI projections, risk mitigation strategies, implementation phases, success metrics, and cultural transformation initiatives.',
    category: 'business',
    tags: ['digital transformation', 'strategy', 'change management']
  },
  {
    title: 'Immersive Narrative Experience',
    content: 'Create a multi-layered {genre} narrative set in {setting} featuring a protagonist with {character_trait}. Develop: complex character arcs with psychological depth, interconnected plot threads, thematic symbolism, sensory-rich world-building, authentic dialogue patterns, narrative tension escalation, cultural authenticity, and emotionally resonant conclusion.',
    category: 'creative',
    tags: ['storytelling', 'narrative design', 'character development']
  },
  {
    title: 'Advanced Analytics Intelligence Report',
    content: 'Generate a comprehensive {dataset_type} analysis with predictive insights. Include: exploratory data analysis with statistical significance testing, machine learning model development, feature importance analysis, trend forecasting, anomaly detection, segment analysis, actionable business recommendations, implementation roadmap, and executive dashboard design.',
    category: 'analysis',
    tags: ['data science', 'predictive analytics', 'business intelligence']
  },
  {
    title: 'Peak Performance Optimization System',
    content: 'Design a holistic productivity ecosystem for {profession} incorporating neuroscience research. Elements: circadian rhythm optimization, cognitive load management, deep work protocols, attention restoration techniques, energy management strategies, goal-setting frameworks, habit stacking systems, and performance measurement dashboards.',
    category: 'other',
    tags: ['performance optimization', 'neuroscience', 'productivity']
  },
  {
    title: 'Developer Experience Documentation Hub',
    content: 'Create a world-class documentation ecosystem for {technology} that developers love. Include: interactive getting-started guides, comprehensive API reference with live examples, troubleshooting decision trees, community contribution guidelines, video tutorials, SDK examples, best practices compendium, and automated testing documentation.',
    category: 'programming',
    tags: ['developer experience', 'documentation', 'developer tools']
  },
  {
    title: 'Omnichannel Brand Experience Strategy',
    content: 'Design a cohesive brand experience for {business_type} across all touchpoints. Develop: brand personality framework, visual identity system, content style guide, customer journey mapping, touchpoint optimization, community building strategy, influencer collaboration framework, and brand experience measurement metrics.',
    category: 'marketing',
    tags: ['brand strategy', 'omnichannel', 'customer experience']
  },
  {
    title: 'Product Launch Orchestration Framework',
    content: 'Engineer a comprehensive go-to-market strategy for {product_type} launch. Coordinate: market validation research, competitive positioning, pricing strategy optimization, distribution channel selection, PR and media outreach, influencer partnerships, customer onboarding automation, feedback collection systems, and post-launch optimization protocols.',
    category: 'business',
    tags: ['product launch', 'go-to-market', 'strategic planning']
  },
  {
    title: 'Research Methodology & Publication Strategy',
    content: 'Develop a rigorous research framework for {topic} investigation. Design: literature review methodology, hypothesis formulation, mixed-methods research design, data collection protocols, statistical analysis plan, peer review preparation, journal selection strategy, and knowledge dissemination plan.',
    category: 'education',
    tags: ['research methodology', 'academic publishing', 'evidence-based']
  },
  {
    title: 'Behavioral Interview Assessment Matrix',
    content: 'Create a comprehensive behavioral interview system for {position} roles using psychological assessment principles. Include: competency-based question bank, STAR method evaluation rubrics, cognitive bias mitigation strategies, diversity and inclusion considerations, candidate experience optimization, and predictive validity metrics.',
    category: 'business',
    tags: ['talent acquisition', 'behavioral assessment', 'HR strategy']
  },
  {
    title: 'User-Centered Design Research Protocol',
    content: 'Establish a comprehensive UX research methodology for {digital_product} optimization. Execute: user persona development with behavioral segmentation, journey mapping with emotion tracking, usability testing protocols, accessibility evaluation, conversion optimization experiments, and design system validation.',
    category: 'programming',
    tags: ['UX research', 'user-centered design', 'optimization']
  },
  {
    title: 'Personalized Wellness Optimization Plan',
    content: 'Create a scientifically-backed {diet_type} nutrition program with behavioral psychology integration. Include: metabolic assessment, nutrient timing optimization, meal prep automation systems, craving management strategies, progress tracking methods, social support structures, and long-term sustainability protocols.',
    category: 'other',
    tags: ['nutrition science', 'behavior change', 'wellness optimization']
  },
  {
    title: 'AI-Powered Content Automation Strategy',
    content: 'Develop an intelligent content generation system for {business_type} using AI tools. Implement: content strategy framework, AI prompt optimization, quality assurance protocols, brand voice consistency, SEO automation, multi-platform adaptation, performance analytics, and human-AI collaboration workflows.',
    category: 'marketing',
    tags: ['AI automation', 'content strategy', 'workflow optimization']
  },
  {
    title: 'Advanced Problem-Solving Framework',
    content: 'Create a systematic approach to complex {domain} problem-solving using first principles thinking. Include: problem decomposition techniques, root cause analysis methodologies, creative solution generation, feasibility assessment matrices, implementation planning, risk evaluation, and continuous improvement feedback loops.',
    category: 'analysis',
    tags: ['problem solving', 'critical thinking', 'methodology']
  },
  {
    title: 'Emotional Intelligence Training Program',
    content: 'Design a comprehensive emotional intelligence development program for {target_group}. Cover: self-awareness assessment tools, emotion regulation techniques, empathy building exercises, social skills enhancement, conflict resolution strategies, leadership communication, and measurable progress indicators.',
    category: 'education',
    tags: ['emotional intelligence', 'soft skills', 'leadership development']
  },
  {
    title: 'Innovation Lab Design Sprint',
    content: 'Structure a 5-day design sprint for {innovation_challenge} using design thinking methodology. Plan: problem definition workshop, ideation facilitation, rapid prototyping sessions, user testing protocols, stakeholder feedback integration, implementation roadmap, and innovation culture development.',
    category: 'creative',
    tags: ['design thinking', 'innovation', 'rapid prototyping']
  },
  {
    title: 'Cybersecurity Risk Assessment Protocol',
    content: 'Establish a comprehensive cybersecurity evaluation framework for {organization_type}. Assess: threat landscape analysis, vulnerability scanning protocols, risk quantification methodologies, incident response planning, employee training programs, compliance alignment, and continuous monitoring systems.',
    category: 'programming',
    tags: ['cybersecurity', 'risk management', 'compliance']
  }
];

// Professional-grade variables for sophisticated prompt generation
const substitutions = {
  topic: ['AI-driven business transformation', 'sustainable technology innovation', 'behavioral economics in fintech', 'neuroscience-based productivity', 'quantum computing applications', 'ethical AI development', 'remote team dynamics', 'data privacy regulations'],
  audience: ['C-suite executives', 'senior engineers', 'product managers', 'data scientists', 'marketing directors', 'startup founders', 'tech leads', 'innovation managers'],
  language: ['TypeScript', 'Python', 'Rust', 'Go', 'Kotlin', 'Swift', 'C#', 'Scala', 'Elixir'],
  product: ['AI-powered SaaS platform', 'B2B automation tool', 'developer API service', 'enterprise security solution', 'data analytics dashboard', 'mobile productivity app', 'blockchain infrastructure'],
  market_segment: ['enterprise clients', 'mid-market companies', 'early-stage startups', 'SME businesses', 'Fortune 500 organizations', 'government agencies', 'educational institutions'],
  subject: ['machine learning fundamentals', 'advanced data structures', 'behavioral psychology', 'design systems', 'financial modeling', 'strategic thinking', 'systems architecture'],
  business_type: ['tech unicorn startup', 'traditional manufacturing company', 'financial services firm', 'healthcare organization', 'e-commerce marketplace', 'SaaS enterprise', 'consulting agency'],
  genre: ['psychological thriller', 'hard science fiction', 'speculative fiction', 'cyberpunk', 'urban fantasy', 'climate fiction', 'techno-thriller'],
  setting: ['AI-governed smart city', 'post-climate change world', 'virtual reality metaverse', 'interplanetary colony', 'bioengineered ecosystem', 'neural network simulation', 'quantum computing lab'],
  character_trait: ['can interface directly with AI systems', 'has perfect memory recall', 'sees probability outcomes', 'experiences time non-linearly', 'communicates through quantum entanglement', 'manipulates digital reality'],
  dataset_type: ['customer behavioral analytics', 'predictive maintenance sensor data', 'social media sentiment analysis', 'financial market indicators', 'healthcare outcome metrics', 'supply chain optimization data'],
  profession: ['AI research scientist', 'product strategy director', 'DevOps architect', 'UX design lead', 'growth marketing manager', 'venture capital partner', 'innovation consultant'],
  technology: ['microservices ecosystem', 'machine learning pipeline', 'blockchain infrastructure', 'edge computing platform', 'real-time analytics engine', 'API gateway architecture'],
  product_type: ['AI-native software platform', 'IoT-enabled hardware device', 'developer tools ecosystem', 'enterprise automation solution', 'consumer wellness app', 'B2B marketplace platform'],
  position: ['senior AI engineer', 'product management director', 'customer success architect', 'data science lead', 'growth marketing specialist', 'business development manager'],
  digital_product: ['AI-powered mobile application', 'enterprise SaaS dashboard', 'developer collaboration platform', 'e-commerce optimization tool', 'data visualization interface', 'customer engagement platform'],
  diet_type: ['plant-based performance nutrition', 'metabolic optimization protocol', 'cognitive enhancement nutrition', 'longevity-focused eating', 'athletic performance fueling', 'gut microbiome optimization'],
  domain: ['artificial intelligence', 'sustainable technology', 'organizational psychology', 'systems thinking', 'behavioral economics', 'innovation management'],
  target_group: ['technical leadership teams', 'cross-functional product teams', 'remote workforce', 'startup founders', 'enterprise executives', 'emerging technology professionals'],
  innovation_challenge: ['AI ethics framework development', 'sustainable technology adoption', 'remote collaboration optimization', 'customer experience transformation', 'data privacy implementation', 'organizational agility enhancement'],
  organization_type: ['fintech startup', 'healthcare technology company', 'e-commerce platform', 'SaaS enterprise', 'government agency', 'educational technology organization']
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
