import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import PromptCard from '../components/PromptCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { usePrompts } from '../contexts/PromptContext';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    userPrompts, 
    loading, 
    error, 
    fetchUserPrompts, 
    deletePrompt, 
    togglePromptVisibility 
  } = usePrompts();
  const [message, setMessage] = useState('');

  // Fetch prompts on component mount
  useEffect(() => {
    fetchUserPrompts();
  }, []);

  const handleEdit = (promptId) => {
    // Navigate to the edit page with the prompt ID
    navigate(`/edit-prompt/${promptId}`);
  };

  const handleDelete = async (promptId) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        await deletePrompt(promptId);
        setMessage('Prompt deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setMessage('Failed to delete prompt');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleCopy = (promptText) => {
    navigator.clipboard.writeText(promptText);
    setMessage('Prompt copied to clipboard');
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleToggleVisibility = async (promptId, currentVisibility) => {
    try {
      const updatedPrompt = await togglePromptVisibility(promptId, currentVisibility);
      setMessage(`Prompt is now ${updatedPrompt.isPublic ? 'public' : 'private'}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update prompt visibility');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <AnimatedBackground>
      <div className="min-h-screen text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-100 mb-2">My Dashboard</h1>
              <p className="text-gray-400">Manage and organize your AI prompts</p>
              {message && (
                <div className="mt-2 p-2 bg-[#FFD700]/20 text-[#FFD700] rounded-md border border-[#FFD700]/30">
                  {message}
                </div>
              )}
            </div>
            <Link
              to="/add-prompt"
              className="inline-flex items-center px-6 py-3 bg-[#FFD700] text-black font-semibold rounded-lg hover:bg-[#FFC700] transition-all duration-300 shadow-lg shadow-[#FFD700]/30 hover:shadow-[#FFD700]/50 transform hover:scale-105 mt-4 md:mt-0"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create New Prompt
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD700]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Prompts</p>
                  <p className="text-2xl font-bold text-gray-100">
                    {loading ? '...' : userPrompts.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 backdrop-blur-sm rounded-xl flex items-center justify-center border border-[#FFD700]/20">
                  <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD700]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Public Prompts</p>
                  <p className="text-2xl font-bold text-gray-100">
                    {loading ? '...' : userPrompts.filter(prompt => prompt.isPublic).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 backdrop-blur-sm rounded-xl flex items-center justify-center border border-[#FFD700]/20">
                  <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD700]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Private Prompts</p>
                  <p className="text-2xl font-bold text-gray-100">
                    {loading ? '...' : userPrompts.filter(prompt => !prompt.isPublic).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 backdrop-blur-sm rounded-xl flex items-center justify-center border border-[#FFD700]/20">
                  <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Prompts */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">My Prompts</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-16 h-16 border-4 border-gray-600 border-t-[#FFD700] rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Loading your prompts...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-300 mb-2">Failed to load prompts</h3>
                <p className="text-gray-400 mb-6">{error}</p>
                <button 
                  onClick={fetchUserPrompts}
                  className="inline-flex items-center px-6 py-3 bg-[#FFD700] text-black font-semibold rounded-lg hover:bg-[#FFC700] transition-all duration-300 shadow-lg shadow-[#FFD700]/30"
                >
                  Retry
                </button>
              </div>
            ) : userPrompts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt._id}
                    title={prompt.title}
                    prompt={prompt.content}
                    category={prompt.category}
                    tags={prompt.tags}
                    author="You"
                    isPublic={prompt.isPublic}
                    onEdit={() => handleEdit(prompt._id)}
                    onDelete={() => handleDelete(prompt._id)}
                    onCopy={() => handleCopy(prompt.content)}
                    onToggleVisibility={() => handleToggleVisibility(prompt._id, prompt.isPublic)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/5 backdrop-blur-lg rounded-full mx-auto mb-4 flex items-center justify-center border border-white/10">
                  <svg className="w-8 h-8 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No prompts yet</h3>
                <p className="text-gray-400 mb-6">Create your first prompt to get started</p>
                <Link
                  to="/add-prompt"
                  className="inline-flex items-center px-6 py-3 bg-[#FFD700] text-black font-semibold rounded-lg hover:bg-[#FFC700] transition-all duration-300 shadow-lg shadow-[#FFD700]/30 transform hover:scale-105"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Your First Prompt
                </Link>
              </div>
            )}
          </div>
        </motion.div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Dashboard;
