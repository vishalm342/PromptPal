const express = require('express');
const router = express.Router();
const Prompt = require('../models/Prompt');
const auth = require('../middleware/auth');

// Route to get public prompts without authentication
router.get('/public', async (req, res) => {
  try {
    const publicPrompts = await Prompt.find({ isPublic: true })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .limit(100); // Increased to 100 to show more prompts
    res.json(publicPrompts);
  } catch (error) {
    console.error('Error fetching public prompts:', error);
    res.status(500).json({ error: 'Failed to fetch public prompts' });
  }
});

// Apply authentication middleware to all other routes
router.use(auth);

// GET /api/prompts - Get all prompts for the authenticated user
router.get('/', async (req, res) => {
  try {
    const prompts = await Prompt.find({ user: req.user._id })
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// GET /api/prompts/:id - Get a specific prompt
router.get('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('user', 'username email');
    
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    res.json(prompt);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid prompt ID' });
    }
    res.status(500).json({ error: 'Failed to fetch prompt' });
  }
});

// POST /api/prompts - Create a new prompt
router.post('/', async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    // Validation
    if (!title || !content || !category) {
      return res.status(400).json({ 
        error: 'Title, content, and category are required' 
      });
    }

    const prompt = new Prompt({
      title,
      content,
      category,
      tags: tags || [],
      isPublic: req.body.isPublic || false,
      user: req.user._id
    });

    const savedPrompt = await prompt.save();
    await savedPrompt.populate('user', 'username email');
    
    res.status(201).json(savedPrompt);
  } catch (error) {
    console.error('Error creating prompt:', error);
    res.status(400).json({ error: 'Failed to create prompt' });
  }
});

// PUT /api/prompts/:id - Update a prompt
router.put('/:id', async (req, res) => {
  try {
    const { title, content, category, tags, isPublic } = req.body;
    
    const prompt = await Prompt.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content, category, tags, isPublic },
      { new: true, runValidators: true }
    ).populate('user', 'username email');
    
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    res.json(prompt);
  } catch (error) {
    console.error('Error updating prompt:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid prompt ID' });
    }
    res.status(400).json({ error: 'Failed to update prompt' });
  }
});

// DELETE /api/prompts/:id - Delete a prompt
router.delete('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting prompt:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid prompt ID' });
    }
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
});

module.exports = router;
