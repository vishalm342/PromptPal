import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { get, post, del, put, API_BASE_URL } from '../utils/api';

const PromptContext = createContext();

export const usePrompts = () => {
  return useContext(PromptContext);
};

export const PromptProvider = ({ children }) => {
  const { token } = useAuth();
  const [userPrompts, setUserPrompts] = useState([]);
  const [publicPrompts, setPublicPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's prompts
  const fetchUserPrompts = async () => {
    if (!token) {
      setUserPrompts([]);
      return;
    }

    try {
      setLoading(true);
      const data = await get(`${API_BASE_URL}/api/prompts`);
      console.log('Fetched user prompts:', data);
      setUserPrompts(data);
    } catch (err) {
      console.error('Error fetching prompts:', err);
      setError('Failed to load your prompts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch public prompts for explore page
  const fetchPublicPrompts = async () => {
    try {
      setLoading(true);
      const data = await get(`${API_BASE_URL}/api/prompts/public`);
      console.log('Fetched public prompts:', data);
      setPublicPrompts(data);
    } catch (err) {
      console.error('Error fetching public prompts:', err);
      setError('Failed to load public prompts');
    } finally {
      setLoading(false);
    }
  };

  // Create a new prompt
  const createPrompt = async (promptData) => {
    try {
      // Use the post helper function which handles errors and parsing
      const newPrompt = await post('/api/prompts', promptData);
      
      // Update the user prompts state with the new prompt
      setUserPrompts(prevPrompts => [newPrompt, ...prevPrompts]);
      
      // If the prompt is public, also update public prompts
      if (promptData.isPublic) {
        setPublicPrompts(prevPrompts => [newPrompt, ...prevPrompts]);
      }

      return newPrompt;
    } catch (err) {
      console.error('Error creating prompt:', err);
      throw err;
    }
  };

  // Update a prompt
  const updatePrompt = async (promptId, promptData) => {
    try {
      const updatedPrompt = await put(`${API_BASE_URL}/api/prompts/${promptId}`, promptData);
      
      // Update the user prompts state
      setUserPrompts(prevPrompts => 
        prevPrompts.map(prompt => 
          prompt._id === promptId ? updatedPrompt : prompt
        )
      );
      
      // If public prompts contain this prompt, update it there too
      setPublicPrompts(prevPrompts => 
        prevPrompts.map(prompt => 
          prompt._id === promptId ? updatedPrompt : prompt
        )
      );

      return updatedPrompt;
    } catch (err) {
      console.error('Error updating prompt:', err);
      throw err;
    }
  };

  // Delete a prompt
  const deletePrompt = async (promptId) => {
    try {
      await del(`${API_BASE_URL}/api/prompts/${promptId}`);
      
      // Remove from user prompts
      setUserPrompts(prevPrompts => 
        prevPrompts.filter(prompt => prompt._id !== promptId)
      );
      
      // Remove from public prompts if present
      setPublicPrompts(prevPrompts => 
        prevPrompts.filter(prompt => prompt._id !== promptId)
      );

      return true;
    } catch (err) {
      console.error('Error deleting prompt:', err);
      throw err;
    }
  };

  // Toggle a prompt's public/private status
  const togglePromptVisibility = async (promptId, isPublic) => {
    try {
      const prompt = userPrompts.find(p => p._id === promptId);
      if (!prompt) throw new Error('Prompt not found');
      
      const updatedPrompt = await put(`${API_BASE_URL}/api/prompts/${promptId}`, {
        ...prompt,
        isPublic: !isPublic
      });
      
      // Update in user prompts
      setUserPrompts(prevPrompts => 
        prevPrompts.map(p => 
          p._id === promptId ? updatedPrompt : p
        )
      );
      
      // Update in public prompts (add or remove)
      if (updatedPrompt.isPublic) {
        // Add to public prompts if it's now public
        setPublicPrompts(prevPrompts => [updatedPrompt, ...prevPrompts]);
      } else {
        // Remove from public prompts if it's now private
        setPublicPrompts(prevPrompts => 
          prevPrompts.filter(p => p._id !== promptId)
        );
      }

      return updatedPrompt;
    } catch (err) {
      console.error('Error toggling prompt visibility:', err);
      throw err;
    }
  };

  // Load prompts when token changes
  useEffect(() => {
    fetchUserPrompts();
    fetchPublicPrompts();
  }, [token]);

  const value = {
    userPrompts,
    publicPrompts,
    loading,
    error,
    fetchUserPrompts,
    fetchPublicPrompts,
    createPrompt,
    updatePrompt,
    deletePrompt,
    togglePromptVisibility
  };

  return <PromptContext.Provider value={value}>{children}</PromptContext.Provider>;
};
