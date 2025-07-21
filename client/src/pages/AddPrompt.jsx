import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAuth } from '../contexts/AuthContext';
import { usePrompts } from '../contexts/PromptContext';
import { post, AI_BASE_URL } from '../utils/api';

const AddPrompt = () => {
  const navigate = useNavigate();
  const { token, currentUser } = useAuth();
  const { createPrompt } = usePrompts();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    isPublic: false
  });
  
  const [newTag, setNewTag] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Check if user is authenticated
  useEffect(() => {
    if (!token && !currentUser) {
      setError('You must be logged in to create prompts');
    }
  }, [token, currentUser]);

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
    console.log('Form submitted:', formData);
    
    setIsSubmitting(true);
    setSubmitMessage('');
    setError('');
    
    try {
      if (!token) {
        setError('You must be logged in to create a prompt');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Using token for authentication:', token ? `${token.substring(0, 10)}...` : 'No token');
      
      // Send the data to the Node.js backend using the createPrompt function from PromptContext
      const promptData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        isPublic: formData.isPublic
      };
      
      console.log('Sending prompt data to backend:', promptData);
      
      // Use the createPrompt function from our context
      const responseData = await createPrompt(promptData);
      
      console.log('Prompt created successfully:', responseData);
      setSubmitMessage('Prompt created successfully!');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      console.error('Error creating prompt:', err);
      
      // Handle different error types
      if (err.status === 401) {
        setError('Authentication error: Please log in again');
        
        // If token is invalid, redirect to login
        setTimeout(() => {
          navigate('/login', { state: { from: '/add-prompt' } });
        }, 2000);
      } else if (err.status === 400) {
        setError(err.message || 'Please check your form input');
      } else {
        setError(err.message || 'An error occurred while creating the prompt');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getSuggestions = async () => {
    if (!formData.content.trim()) {
      setError('Please enter some prompt content first');
      return;
    }
    
    setIsLoadingSuggestions(true);
    setError('');
    setSuggestions([]); // Clear previous suggestions
    
    console.log("Sending request to get suggestions with:", {
      promptText: formData.content,
      tags: formData.tags
    });
    
    try {
      console.log(`Fetching from ${AI_BASE_URL}/suggest`);
      
      // We don't use the API helper here since this is a different backend
      const response = await fetch(`${AI_BASE_URL}/suggest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          promptText: formData.content,
          tags: formData.tags
        }),
      });
      
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      
      if (data.error) {
        setError(data.error);
      } else if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError('Failed to get suggestions: ' + err.message);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };
  
  const applyPromptSuggestion = (suggestion) => {
    // Clean up the suggestion text - remove any numbering or prefixes
    const cleanedSuggestion = suggestion
      .replace(/^\d+[\.\):]?\s*/, '')  // Remove numbering like "1.", "1)", "1:"
      .replace(/^(prompt|suggestion)[\s\d]*[:.-]\s*/i, '')  // Remove prefixes like "Prompt:", "Suggestion 1 -"
      .trim();
    
    // Set the suggestion as the new content
    setFormData(prev => ({
      ...prev,
      content: cleanedSuggestion
    }));
    
    // Add a success message
    setSubmitMessage('Suggestion applied successfully!');
    
    // Clear the message after 1.5 seconds
    setTimeout(() => {
      setSubmitMessage('');
    }, 1500);
    
    // Clear suggestions after applying
    setSuggestions([]);
  };

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
              <h1 className="text-4xl font-bold text-gray-100">Create New Prompt</h1>
              <p className="text-gray-400 mt-2">Share your creativity with the community</p>
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
                <button
                  type="button"
                  onClick={getSuggestions}
                  disabled={isLoadingSuggestions || !formData.content.trim()}
                  className="inline-flex items-center px-4 py-2 bg-sky-500/20 text-sky-400 rounded-md hover:bg-sky-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingSuggestions ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Get AI Suggestions
                    </>
                  )}
                </button>
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
              
              {/* AI Suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-4 bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
                  <h3 className="text-sky-400 flex items-center text-sm font-medium mb-3">
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    AI Suggestions
                  </h3>
                  <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-zinc-700/30 hover:bg-zinc-700/50 rounded-lg border border-zinc-600/30 cursor-pointer transition-all duration-200 hover:border-sky-400/50 hover:shadow-lg hover:shadow-sky-400/10"
                        onClick={() => applyPromptSuggestion(suggestion)}
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-400/30 text-sky-400 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-grow">
                            <p className="text-gray-100 leading-relaxed">{suggestion}</p>
                            <p className="text-xs text-sky-400 mt-2 flex items-center">
                              <SparklesIcon className="w-3 h-3 mr-1" />
                              Click to use this suggestion
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    Creating...
                  </>
                ) : 'Create Prompt'}
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

export default AddPrompt;
