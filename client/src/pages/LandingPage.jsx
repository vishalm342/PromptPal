import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';

const LandingPage = () => {
  return (
    <AnimatedBackground>
      <motion.div 
        className="min-h-screen text-gray-100 flex flex-col items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
      <div className="text-center max-w-4xl mx-auto">
        <motion.h1 
          className="text-5xl font-bold text-gray-100 mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Welcome to PromptPal
        </motion.h1>
        
        <motion.p 
          className="text-gray-400 max-w-xl mx-auto text-lg mb-8 leading-relaxed"
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
            to="/signup"
            className="bg-gray-100 text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 shadow-lg"
          >
            Get Started
          </Link>
          
          <Link 
            to="/explore"
            className="border border-gray-600 text-gray-100 px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors duration-200"
          >
            Explore Prompts
          </Link>
        </motion.div>
        
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-sky-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-sky-400">Create</h3>
            <p className="text-gray-400">Craft powerful prompts for any AI model or use case</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-violet-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-violet-400">Share</h3>
            <p className="text-gray-400">Share your prompts with the community and get feedback</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-sky-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-sky-400">Discover</h3>
            <p className="text-gray-400">Explore thousands of prompts created by the community</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
    </AnimatedBackground>
  );
};

export default LandingPage;
