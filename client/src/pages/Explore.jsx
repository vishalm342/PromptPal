import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PromptCard from '../components/PromptCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { usePrompts } from '../contexts/PromptContext';
import { useAuth } from '../contexts/AuthContext';

const Explore = () => {
  const navigate = useNavigate();
  const { publicPrompts, loading, error, fetchPublicPrompts, deletePrompt } = usePrompts();
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All Categories');

  // Fetch public prompts on component mount
  useEffect(() => {
    fetchPublicPrompts();
  }, []);

  // Filter prompts based on search term and category
  const filteredPrompts = publicPrompts.filter(prompt => {
    const matchesSearch = searchTerm === '' || 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prompt.tags && prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = category === 'All Categories' || 
      prompt.category.toLowerCase() === category.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (promptId) => {
    // Navigate to edit page if the user owns this prompt
    navigate(`/edit-prompt/${promptId}`);
  };

  const handleDelete = async (promptId) => {
    // Only owners should be able to delete prompts
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        await deletePrompt(promptId);
        setMessage('Prompt deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setMessage('Failed to delete prompt. You can only delete your own prompts.');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleCopy = (promptText) => {
    navigator.clipboard.writeText(promptText);
    setMessage('Prompt copied to clipboard');
    setTimeout(() => setMessage(''), 3000);
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-100 mb-4">Explore Prompts</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover amazing prompts created by our community. Find inspiration for your next AI-powered project.
            </p>
            {message && (
              <div className="mt-4 p-2 bg-[#FFD700]/20 text-[#FFD700] rounded-md max-w-md mx-auto border border-[#FFD700]/30">
                {message}
              </div>
            )}
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#FFD700]/50 focus:shadow-lg focus:shadow-[#FFD700]/10 transition-all duration-200"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:border-[#FFD700]/50 transition-all duration-200"
                >
                  <option>All Categories</option>
                  <option>Writing</option>
                  <option>Programming</option>
                  <option>Marketing</option>
                  <option>Education</option>
                  <option>Business</option>
                  <option>Creative</option>
                  <option>Analysis</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prompts Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-16 h-16 border-4 border-gray-600 border-t-[#FFD700] rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading prompts...</p>
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
                onClick={fetchPublicPrompts}
                className="px-6 py-3 bg-[#FFD700] text-black font-semibold rounded-lg hover:bg-[#FFC700] transition-all duration-300 shadow-lg shadow-[#FFD700]/30"
              >
                Retry
              </button>
            </div>
          ) : filteredPrompts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {filteredPrompts.map((prompt, index) => (
                <motion.div
                  key={prompt._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * Math.min(index, 5), duration: 0.5 }}
                >
                  <PromptCard
                    title={prompt.title}
                    tags={prompt.tags}
                    isPublic={true}
                    promptText={prompt.content}
                    author={prompt.user?.username || "Anonymous"}
                    onCopy={() => handleCopy(prompt.content)}
                    // Disable edit/delete for non-owners
                    onEdit={currentUser && prompt.user && currentUser._id === prompt.user._id ? 
                      () => handleEdit(prompt._id) : null}
                    onDelete={currentUser && prompt.user && currentUser._id === prompt.user._id ? 
                      () => handleDelete(prompt._id) : null}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 backdrop-blur-lg rounded-full mx-auto mb-4 flex items-center justify-center border border-white/10">
                <svg className="w-8 h-8 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No prompts found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </motion.div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Explore;
