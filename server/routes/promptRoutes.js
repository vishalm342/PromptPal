const express = require('express');
const router = express.Router();
const Prompt = require('../models/Prompt');

// GET /api/prompts - Get all prompts
router.get('/', async (req, res) => {
  try {
    const prompts = await Prompt.getAll();
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// GET /api/prompts/:id - Get a specific prompt
router.get('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.getById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    res.json(prompt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prompt' });
  }
});

// POST /api/prompts - Create a new prompt
router.post('/', async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const prompt = await Prompt.create({ title, content, category, tags });
    res.status(201).json(prompt);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create prompt' });
  }
});

// PUT /api/prompts/:id - Update a prompt
router.put('/:id', async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const prompt = await Prompt.update(req.params.id, { title, content, category, tags });
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    res.json(prompt);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update prompt' });
  }
});

// DELETE /api/prompts/:id - Delete a prompt
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Prompt.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
});

module.exports = router;
