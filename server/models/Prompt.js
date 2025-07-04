const fs = require('fs').promises;
const path = require('path');

// For now, we'll use a simple file-based storage
// In a real application, you'd use a database like MongoDB or PostgreSQL
const DATA_FILE = path.join(__dirname, '../data/prompts.json');

class Prompt {
  constructor(id, title, content, category, tags, createdAt, updatedAt) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.category = category;
    this.tags = tags || [];
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  // Read prompts from file
  static async readData() {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, return empty array
      return [];
    }
  }

  // Write prompts to file
  static async writeData(prompts) {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(DATA_FILE);
      await fs.mkdir(dataDir, { recursive: true });
      
      await fs.writeFile(DATA_FILE, JSON.stringify(prompts, null, 2));
    } catch (error) {
      throw new Error('Failed to save data');
    }
  }

  // Get all prompts
  static async getAll() {
    const prompts = await this.readData();
    return prompts;
  }

  // Get prompt by ID
  static async getById(id) {
    const prompts = await this.readData();
    return prompts.find(prompt => prompt.id === id);
  }

  // Create a new prompt
  static async create(data) {
    const prompts = await this.readData();
    const id = Date.now().toString(); // Simple ID generation
    
    const newPrompt = new Prompt(
      id,
      data.title,
      data.content,
      data.category,
      data.tags
    );

    prompts.push(newPrompt);
    await this.writeData(prompts);
    
    return newPrompt;
  }

  // Update a prompt
  static async update(id, data) {
    const prompts = await this.readData();
    const index = prompts.findIndex(prompt => prompt.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedPrompt = {
      ...prompts[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    prompts[index] = updatedPrompt;
    await this.writeData(prompts);
    
    return updatedPrompt;
  }

  // Delete a prompt
  static async delete(id) {
    const prompts = await this.readData();
    const index = prompts.findIndex(prompt => prompt.id === id);
    
    if (index === -1) {
      return false;
    }

    prompts.splice(index, 1);
    await this.writeData(prompts);
    
    return true;
  }
}

module.exports = Prompt;
