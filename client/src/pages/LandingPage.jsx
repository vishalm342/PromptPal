import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';

const LandingPage = () => {
  return (
    <AnimatedBackground>
      <motion.div 
        className="min-h-screen text-gray-100 flex flex-col items-center justify-center px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
      <div className="text-center max-w-6xl mx-auto w-full">

        
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-white mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Welcome to PromptPal
        </motion.h1>
        
        <motion.p 
          className="text-gray-300 max-w-2xl mx-auto text-lg mb-8 leading-relaxed"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Discover, create, and share AI prompts that spark creativity and productivity. 
          Join our community of prompt engineers and unlock the power of AI.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link 
            to="/explore"
            className="bg-[#FFD700] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#FFC700] transition-all duration-300 shadow-lg shadow-[#FFD700]/50 hover:shadow-[#FFD700]/75 transform hover:scale-105"
          >
            Explore Prompts
          </Link>
          
          <Link 
            to="/signup"
            className="border-2 border-[#FFD700] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#FFD700]/10 hover:border-[#FFC700] transition-all duration-300"
          >
            Get Started
          </Link>
        </motion.div>

        {/* Why PromptPal Section */}
        <motion.div 
          className="mt-20 mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          <motion.div
            className="bg-gradient-to-r from-[#FFD700]/5 via-transparent to-[#FFD700]/5 border border-[#FFD700]/30 rounded-2xl p-10 md:p-14 backdrop-blur-sm"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center justify-center gap-3">
              <span className="text-[#FFD700]">Why</span> PromptPal<span className="text-[#FFD700]">?</span>
            </h2>
            <div className="space-y-5 text-gray-300 max-w-3xl mx-auto">
              <p className="text-lg leading-relaxed">
                PromptPal is your ultimate companion for mastering AI interactions. Whether you're a developer, 
                content creator, or AI enthusiast, our platform provides you with the tools and community to 
                create, refine, and share powerful prompts.
              </p>
              <p className="text-lg leading-relaxed">
                With intelligent AI-powered suggestions powered by Ollama and our smart engine, you'll never run 
                out of creative ideas. Save time, boost productivity, and join thousands of users who are already 
                transforming the way they work with AI.
              </p>
            </div>
          </motion.div>
        </motion.div>
        
        {/* How PromptPal Empowers You Section */}
        <motion.div 
          className="mt-16 mb-20"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-16">
            How PromptPal <span className="text-[#FFD700]">Empowers You</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-4">
            {/* Create Card */}
            <motion.div 
              className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-[#FFD700] rounded-xl p-8 hover:bg-gradient-to-br hover:from-gray-900/90 hover:to-gray-800/70 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFD700]/40 hover:-translate-y-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#FFD700]/50"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-[#FFD700]">Create</h3>
              <p className="text-gray-300 leading-relaxed">
                Craft powerful prompts for any AI model or use case. Our intelligent suggestion 
                engine helps you create prompts that get better results.
              </p>
            </motion.div>
            
            {/* Share Card */}
            <motion.div 
              className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-[#FFD700] rounded-xl p-8 hover:bg-gradient-to-br hover:from-gray-900/90 hover:to-gray-800/70 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFD700]/40 hover:-translate-y-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#FFD700]/50"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-[#FFD700]">Share</h3>
              <p className="text-gray-300 leading-relaxed">
                Share your prompts with the community and get valuable feedback. 
                Collaborate with other prompt engineers and grow together.
              </p>
            </motion.div>
            
            {/* Discover Card */}
            <motion.div 
              className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border-2 border-[#FFD700] rounded-xl p-8 hover:bg-gradient-to-br hover:from-gray-900/90 hover:to-gray-800/70 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFD700]/40 hover:-translate-y-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#FFD700]/50"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-[#FFD700]">Discover</h3>
              <p className="text-gray-300 leading-relaxed">
                Explore thousands of prompts created by the community. 
                Find inspiration and learn from the best prompt engineers.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
    </AnimatedBackground>
  );
};

export default LandingPage;
