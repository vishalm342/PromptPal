import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAuth } from '../contexts/AuthContext';
import { usePrompts } from '../contexts/PromptContext';

const EditPrompt = () => {
  const navigate = useNavigate();
  const { promptId } = useParams();
  const { token, currentUser } = useAuth();
  const { userPrompts, fetchUserPrompts, updatePrompt } = usePrompts();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    isPublic: false
  });
  
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Load prompt data when component mounts
  useEffect(() => {
    const loadPromptData = async () => {
      if (!promptId) {
        setError('No prompt ID provided');
        setLoading(false);
        return;
      }
      
      try {
        // First make sure we have user prompts loaded
        if (!userPrompts || userPrompts.length === 0) {
          await fetchUserPrompts();
        }
        
        // Find the prompt in user's prompts
        const prompt = userPrompts.find(p => p._id === promptId);
        
        if (!prompt) {
          setError('Prompt not found or you do not have permission to edit it');
          setLoading(false);
          return;
        }
        
        // Set form data from prompt
        setFormData({
          title: prompt.title || '',
          content: prompt.content || '',
          category: prompt.category || '',
          tags: prompt.tags || [],
          isPublic: prompt.isPublic || false
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading prompt:', err);
        setError('Failed to load prompt data');
        setLoading(false);
      }
    };
    
    loadPromptData();
  }, [promptId, userPrompts, fetchUserPrompts]);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!token && !currentUser) {
      setError('You must be logged in to edit prompts');
      navigate('/login', { state: { from: `/edit-prompt/${promptId}` } });
    }
  }, [token, currentUser, navigate, promptId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitMessage('');
    setError('');
    
    try {
      if (!token) {
        setError('You must be logged in to update a prompt');
        setIsSubmitting(false);
        return;
      }
      
      // Update the prompt using the updatePrompt function from context
      const updatedPrompt = await updatePrompt(promptId, formData);
      
      console.log('Prompt updated successfully:', updatedPrompt);
      setSubmitMessage('Prompt updated successfully!');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      console.error('Error updating prompt:', err);
      
      // Handle different error types
      if (err.status === 401) {
        setError('Authentication error: Please log in again');
        setTimeout(() => {
          navigate('/login', { state: { from: `/edit-prompt/${promptId}` } });
        }, 2000);
      } else if (err.status === 404) {
        setError('Prompt not found or you don\'t have permission to edit it');
      } else if (err.status === 400) {
        setError(err.message || 'Please check your form input');
      } else {
        setError(err.message || 'An error occurred while updating the prompt');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AnimatedBackground>
        <div className="min-h-screen flex items-center justify-center text-gray-100">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-gray-600 border-t-sky-400 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading prompt data...</p>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <div className="min-h-screen text-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link
              to="/dashboard"
              className="mr-4 p-2 text-gray-400 hover:text-sky-400 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-100">Edit Prompt</h1>
              <p className="text-gray-400 mt-2">Update your AI prompt</p>
            </div>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-gray-100 mb-2">
                Prompt Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-gray-600/30 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-sky-400 transition-colors duration-200"
                placeholder="Enter a descriptive title for your prompt"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-lg font-medium text-gray-100 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-zinc-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-sky-400 transition-colors duration-200"
              >
                <option value="">Select a category</option>
                <option value="writing">Writing</option>
                <option value="programming">Programming</option>
                <option value="marketing">Marketing</option>
                <option value="education">Education</option>
                <option value="business">Business</option>
                <option value="creative">Creative</option>
                <option value="analysis">Analysis</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-lg font-medium text-gray-100 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-sky-400/20 text-sky-400 text-sm rounded-full border border-sky-400/30"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-sky-400 hover:text-sky-300"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 bg-zinc-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-sky-400 transition-colors duration-200"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition-colors duration-200"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="content" className="block text-lg font-medium text-base">
                  Prompt Content *
                </label>
              </div>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={12}
                className="w-full px-4 py-3 bg-card border border-gray-700 rounded-lg text-base placeholder-gray-400 focus:outline-none focus:border-accentBlue transition-colors duration-200 resize-vertical"
                placeholder="Enter your prompt content here. Be detailed and specific about what you want the AI to do..."
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-gray-400 text-sm">
                  {formData.content.length} characters
                </p>
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </div>
            </div>

            {/* Visibility */}
            <div className="bg-card p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-base">Make this prompt public</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Public prompts can be discovered and used by other users
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accentBlue"></div>
                </label>
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                {error}
              </div>
            )}
            
            {submitMessage && (
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
                {submitMessage}
              </div>
            )}
            
            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 ${isSubmitting ? 'bg-gray-500' : 'bg-accentBlue'} text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 flex justify-center items-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
              <Link
                to="/dashboard"
                className="flex-1 text-center border border-gray-600 text-base px-6 py-3 rounded-lg font-semibold hover:bg-card transition-colors duration-200"
              >
                Cancel
              </Link>
            </div>
          </motion.form>
        </motion.div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default EditPrompt;
