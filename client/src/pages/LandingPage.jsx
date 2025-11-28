import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAuth } from '../contexts/AuthContext';

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = '+' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(target);
      const duration = 2000; // 2 seconds
      const increment = end / (duration / 16); // 60fps

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

const LandingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleStartCreating = () => {
    if (currentUser) {
      navigate('/add-prompt');
    } else {
      navigate('/signup');
    }
  };

  const handleExplorePrompts = () => {
    navigate('/explore');
  };

  return (
    <AnimatedBackground>
      <div className="min-h-screen text-gray-100">

        {/* SECTION 1: HERO SECTION (Enhanced) */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <motion.div
            className="max-w-6xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Headline */}
            <h1 className="text-4xl md:text-7xl font-bold mb-5">
              <span className="text-white">Master AI Prompts.</span>
              <br />
              <span className="text-white">Boost Productivity.</span>
              <br />
              <span className="bg-gradient-to-r from-[#FFC107] to-[#FFD700] bg-clip-text text-transparent">
                10x Faster.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create and refine AI prompts with intelligent suggestions powered by{' '}
              <span className="text-[#FFC107] font-semibold">Gemini 2.0 Flash</span>.
              Join developers and creators building better prompts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={handleStartCreating}
                className="bg-[#FFC107] text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#FFD700] transition-all duration-300 shadow-lg shadow-[#FFC107]/50 hover:shadow-[#FFC107]/70 hover:scale-105"
              >
                Start Creating Free
              </button>
              <button
                onClick={handleExplorePrompts}
                className="border-2 border-[#FFC107] text-[#FFC107] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#FFC107]/10 transition-all duration-300"
              >
                Explore Prompts →
              </button>
            </div>

            {/* Trust Badges - Cleaner version */}
            <div className="flex flex-wrap justify-center gap-8 mb-16">
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-5 h-5 text-[#FFC107]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">100% Free</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-5 h-5 text-[#FFC107]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm">Privacy-First</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-5 h-5 text-[#FFC107]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm">Powered by Gemini AI</span>
              </div>
            </div>

            {/* Demo Card - Before/After Example */}
            <motion.div
              className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl shadow-[#FFC107]/10"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              whileHover={{
                borderColor: 'rgba(255, 193, 7, 0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                boxShadow: '0 8px 32px rgba(255, 193, 7, 0.15)'
              }}
            >
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-lg p-6">
                <div className="space-y-4">
                  {/* User's prompt */}
                  <div className="bg-white/5 rounded-lg p-4 border-l-4 border-gray-500">
                    <p className="text-sm text-gray-400 mb-1">Your Prompt:</p>
                    <p className="text-white">Write a blog post about AI</p>
                  </div>
                  {/* AI suggestions */}
                  <div className="bg-[#FFC107]/10 rounded-lg p-4 border-l-4 border-[#FFC107]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#FFC107]">✨</span>
                      <p className="text-sm text-[#FFC107] font-semibold">AI Enhanced:</p>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Write a comprehensive 1500-word blog post about AI&apos;s impact on modern business,
                      targeting tech executives. Include 3 case studies, expert quotes, and actionable
                      insights with SEO optimization.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* SECTION 2: PROBLEM → SOLUTION */}
        <section className="py-20 px-4">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Problem Side */}
              <motion.div
                className="bg-red-500/5 backdrop-blur-lg border border-red-500/20 rounded-xl p-8"
                whileHover={{
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  scale: 1.02
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-5xl mb-4">😫</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Struggling with AI Prompts?
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Generic prompts give mediocre results</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>No way to save and organize your prompts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Can&apos;t learn from community best practices</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Wasting time rewriting the same prompts</span>
                  </li>
                </ul>
              </motion.div>

              {/* Solution Side */}
              <motion.div
                className="bg-[#FFC107]/5 backdrop-blur-lg border border-[#FFC107]/20 rounded-xl p-8"
                whileHover={{
                  borderColor: 'rgba(255, 193, 7, 0.5)',
                  scale: 1.02
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  PromptPal Solves This
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-[#FFC107] mt-1">✓</span>
                    <span>AI-powered suggestions using Gemini 2.0 Flash</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#FFC107] mt-1">✓</span>
                    <span>Organize prompts by category and tags</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#FFC107] mt-1">✓</span>
                    <span>Browse 120+ community templates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#FFC107] mt-1">✓</span>
                    <span>Save hours with prompt reuse and sharing</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 3: KEY FEATURES (3 Columns) */}
        <section className="py-20 px-4">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Why Choose <span className="text-[#FFC107]">PromptPal</span>?
            </h2>
            <p className="text-center text-gray-400 mb-16 text-lg">
              Powerful features that make prompt engineering effortless
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1: AI */}
              <motion.div
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8"
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  borderColor: 'rgba(255, 193, 7, 0.5)',
                  boxShadow: '0 25px 50px rgba(255, 193, 7, 0.25)'
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  AI-Powered by Gemini 2.0
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  Intelligent suggestions using Google&apos;s latest Gemini 2.0 Flash
                  model. Analyze and enhance prompts for maximum effectiveness.
                </p>
                <div className="inline-block bg-[#FFC107]/20 text-[#FFC107] px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  Hybrid AI System
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Gemini 2.0 Flash (primary)</li>
                  <li>• Smart Engine fallback</li>
                  <li>• Context-aware improvements</li>
                  <li>• Never fails to suggest</li>
                </ul>
              </motion.div>

              {/* Feature 2: Community */}
              <motion.div
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8"
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  borderColor: 'rgba(255, 193, 7, 0.5)',
                  boxShadow: '0 25px 50px rgba(255, 193, 7, 0.25)'
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Community Library
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  Access 120+ battle-tested prompt templates for writing, coding,
                  marketing, and more. Learn from successful community prompts.
                </p>
                <div className="inline-block bg-[#FFC107]/20 text-[#FFC107] px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  500+ Prompts Created
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Writing &amp; Content Creation</li>
                  <li>• Programming &amp; Development</li>
                  <li>• Marketing &amp; Business</li>
                  <li>• Education &amp; Learning</li>
                </ul>
              </motion.div>

              {/* Feature 3: Free */}
              <motion.div
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8"
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  borderColor: 'rgba(255, 193, 7, 0.5)',
                  boxShadow: '0 25px 50px rgba(255, 193, 7, 0.25)'
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  100% Free
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  No paywalls. No limits. No data selling. Unlimited AI-powered
                  prompt creation for everyone. Privacy-first approach.
                </p>
                <div className="inline-block bg-[#FFC107]/20 text-[#FFC107] px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  Privacy-First
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• No credit card needed</li>
                  <li>• Unlimited prompts</li>
                  <li>• Your data stays private</li>
                  <li>• Community-driven</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 4: HOW IT WORKS (3 Steps) */}
        <section className="py-20 px-4 bg-gradient-to-b from-black to-[#0A0A0A]">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              How It <span className="text-[#FFC107]">Works</span>
            </h2>
            <p className="text-center text-gray-400 mb-16 text-lg">
              From idea to optimized prompt in 3 simple steps
            </p>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Step 1 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  className="text-6xl font-bold text-[#FFC107]/30 mb-4"
                  whileHover={{
                    scale: 1.2,
                    opacity: 1,
                    color: '#FFC107',
                    textShadow: '0 0 20px rgba(255, 193, 7, 0.8)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  01
                </motion.div>
                <div className="text-5xl mb-4">✍️</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Write or Choose
                </h3>
                <p className="text-gray-300 mb-6">
                  Start with your own prompt or pick from our template library
                  of 120+ proven prompts
                </p>
                <motion.div
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 aspect-video flex items-center justify-center"
                  whileHover={{
                    borderColor: 'rgba(255, 193, 7, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px rgba(255, 193, 7, 0.15)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-[#1a1a1a] rounded-lg p-4 text-left w-full">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#FFC107]" />
                        <span className="text-xs text-gray-400">Template Library</span>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-white/5 rounded px-3 py-2 text-xs text-gray-300">✍️ Blog Post Writer</div>
                        <div className="bg-white/5 rounded px-3 py-2 text-xs text-gray-300">💻 Code Explainer</div>
                        <div className="bg-[#FFC107]/20 rounded px-3 py-2 text-xs text-[#FFC107] border border-[#FFC107]/30">📧 Email Composer</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="text-6xl font-bold text-[#FFC107]/30 mb-4"
                  whileHover={{
                    scale: 1.2,
                    opacity: 1,
                    color: '#FFC107',
                    textShadow: '0 0 20px rgba(255, 193, 7, 0.8)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  02
                </motion.div>
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  AI Refines It
                </h3>
                <p className="text-gray-300 mb-6">
                  Gemini 2.0 Flash analyzes and suggests improvements for
                  clarity and effectiveness
                </p>
                <motion.div
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 aspect-video flex items-center justify-center"
                  whileHover={{
                    borderColor: 'rgba(255, 193, 7, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px rgba(255, 193, 7, 0.15)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-[#1a1a1a] rounded-lg p-4 text-left w-full">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#FFC107] text-sm">⚡</span>
                        <span className="text-xs text-gray-400">AI Analyzing...</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-gradient-to-r from-[#FFC107] to-[#FFD700] animate-pulse" />
                      </div>
                      <div className="space-y-1 mt-3">
                        <div className="text-xs text-gray-500">Suggestions:</div>
                        <div className="bg-[#FFC107]/10 rounded px-2 py-1 text-xs text-gray-300">✓ Add target audience</div>
                        <div className="bg-[#FFC107]/10 rounded px-2 py-1 text-xs text-gray-300">✓ Specify word count</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="text-6xl font-bold text-[#FFC107]/30 mb-4"
                  whileHover={{
                    scale: 1.2,
                    opacity: 1,
                    color: '#FFC107',
                    textShadow: '0 0 20px rgba(255, 193, 7, 0.8)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  03
                </motion.div>
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Save &amp; Share
                </h3>
                <p className="text-gray-300 mb-6">
                  Save to your library, organize by tags, or share with
                  the community
                </p>
                <motion.div
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 aspect-video flex items-center justify-center"
                  whileHover={{
                    borderColor: 'rgba(255, 193, 7, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px rgba(255, 193, 7, 0.15)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-[#1a1a1a] rounded-lg p-4 text-left w-full">
                    <div className="space-y-2">
                      <div className="text-xs text-gray-400 mb-2">Your Library</div>
                      <div className="space-y-2">
                        <div className="bg-white/5 rounded-lg p-2 flex items-center justify-between">
                          <span className="text-xs text-gray-300">Marketing Prompt</span>
                          <span className="text-xs text-[#FFC107]">🔒</span>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 flex items-center justify-between">
                          <span className="text-xs text-gray-300">Code Review</span>
                          <span className="text-xs text-green-400">🌍</span>
                        </div>
                        <div className="bg-[#FFC107]/10 rounded-lg p-2 border border-[#FFC107]/30 text-center">
                          <span className="text-xs text-[#FFC107]">+ Add New</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 5: STATS (Simple, Not Bragging) */}
        <section className="py-20 px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-3 gap-8 text-center">
              <motion.div
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  borderColor: 'rgba(255, 193, 7, 0.5)',
                  boxShadow: '0 20px 40px rgba(255, 193, 7, 0.2)'
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="text-5xl font-bold text-[#FFC107] mb-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <AnimatedCounter target="500" />
                </motion.div>
                <div className="text-gray-400">Prompts Created</div>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  borderColor: 'rgba(255, 193, 7, 0.5)',
                  boxShadow: '0 20px 40px rgba(255, 193, 7, 0.2)'
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="text-5xl font-bold text-[#FFC107] mb-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <AnimatedCounter target="100" />
                </motion.div>
                <div className="text-gray-400">Active Users</div>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  borderColor: 'rgba(255, 193, 7, 0.5)',
                  boxShadow: '0 20px 40px rgba(255, 193, 7, 0.2)'
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="text-5xl font-bold text-[#FFC107] mb-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <AnimatedCounter target="120" />
                </motion.div>
                <div className="text-gray-400">Templates</div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 6: FINAL CTA */}
        <section className="py-20 px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-white/5 to-[#FFC107]/5 backdrop-blur-lg border border-[#FFC107]/20 rounded-2xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Master AI Prompts?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join developers and creators building better prompts with AI
              </p>
              <button
                onClick={handleStartCreating}
                className="inline-block bg-[#FFC107] text-black px-12 py-4 rounded-lg text-xl font-bold hover:bg-[#FFD700] transition-all duration-300 shadow-lg shadow-[#FFC107]/50 hover:shadow-[#FFC107]/70 hover:scale-105"
              >
                Get Started - It&apos;s Free
              </button>
              <p className="text-sm text-gray-500 mt-6">
                No credit card required • Unlimited prompts • Privacy-first
              </p>
            </div>
          </motion.div>
        </section>

      </div>
    </AnimatedBackground>
  );
};

export default LandingPage;
