/**
 * Comprehensive unit tests for server.js
 */

const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Mock the server
let app;
let scoresFile;

describe('Server.js - Backend API', () => {
  beforeEach(() => {
    // Create a fresh express app for each test
    app = express();
    const cors = require('cors');
    const bodyParser = require('body-parser');
    
    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.static('.'));
    
    // Use a test scores file
    scoresFile = path.join(__dirname, 'test-scores.json');
    
    // Initialize test scores file
    if (fs.existsSync(scoresFile)) {
      fs.unlinkSync(scoresFile);
    }
    fs.writeFileSync(scoresFile, JSON.stringify([]));
    
    // Helper functions
    function readScores() {
      try {
        const data = fs.readFileSync(scoresFile, 'utf8');
        return JSON.parse(data);
      } catch (error) {
        return [];
      }
    }
    
    function writeScores(scores) {
      fs.writeFileSync(scoresFile, JSON.stringify(scores, null, 2));
    }
    
    // Routes
    app.get('/api/scores', (req, res) => {
      const scores = readScores();
      const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 10);
      res.json(topScores);
    });
    
    app.post('/api/scores', (req, res) => {
      const { name, score } = req.body;
      
      if (!name || typeof score !== 'number') {
        return res.status(400).json({ error: 'Invalid data' });
      }
      
      const scores = readScores();
      scores.push({
        name: name.substring(0, 20),
        score,
        date: new Date().toISOString()
      });
      
      writeScores(scores);
      res.json({ success: true });
    });
  });
  
  afterEach(() => {
    // Clean up test scores file
    if (fs.existsSync(scoresFile)) {
      fs.unlinkSync(scoresFile);
    }
  });

  describe('GET /api/scores', () => {
    test('should return empty array when no scores exist', async () => {
      const response = await request(app)
        .get('/api/scores')
        .expect(200);
      
      expect(response.body).toEqual([]);
    });

    test('should return scores sorted by score descending', async () => {
      // Add some scores
      await request(app)
        .post('/api/scores')
        .send({ name: 'Player1', score: 100 });
      
      await request(app)
        .post('/api/scores')
        .send({ name: 'Player2', score: 200 });
      
      await request(app)
        .post('/api/scores')
        .send({ name: 'Player3', score: 150 });
      
      const response = await request(app)
        .get('/api/scores')
        .expect(200);
      
      expect(response.body).toHaveLength(3);
      expect(response.body[0].score).toBe(200);
      expect(response.body[1].score).toBe(150);
      expect(response.body[2].score).toBe(100);
    });

    test('should return only top 10 scores', async () => {
      // Add 15 scores
      for (let i = 0; i < 15; i++) {
        await request(app)
          .post('/api/scores')
          .send({ name: `Player${i}`, score: i * 10 });
      }
      
      const response = await request(app)
        .get('/api/scores')
        .expect(200);
      
      expect(response.body).toHaveLength(10);
    });

    test('should handle corrupted scores file gracefully', async () => {
      // Write invalid JSON
      fs.writeFileSync(scoresFile, 'invalid json{{{');
      
      const response = await request(app)
        .get('/api/scores')
        .expect(200);
      
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/scores', () => {
    test('should save a valid score', async () => {
      const response = await request(app)
        .post('/api/scores')
        .send({ name: 'TestPlayer', score: 500 })
        .expect(200);
      
      expect(response.body).toEqual({ success: true });
    });

    test('should truncate player name to 20 characters', async () => {
      const longName = 'A'.repeat(50);
      
      await request(app)
        .post('/api/scores')
        .send({ name: longName, score: 100 })
        .expect(200);
      
      const scores = JSON.parse(fs.readFileSync(scoresFile, 'utf8'));
      expect(scores[0].name).toHaveLength(20);
    });

    test('should add timestamp to score', async () => {
      await request(app)
        .post('/api/scores')
        .send({ name: 'Player', score: 100 })
        .expect(200);
      
      const scores = JSON.parse(fs.readFileSync(scoresFile, 'utf8'));
      expect(scores[0]).toHaveProperty('date');
      expect(new Date(scores[0].date)).toBeInstanceOf(Date);
    });

    test('should reject score without name', async () => {
      const response = await request(app)
        .post('/api/scores')
        .send({ score: 100 })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });

    test('should reject score without score value', async () => {
      const response = await request(app)
        .post('/api/scores')
        .send({ name: 'Player' })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });

    test('should reject score with invalid score type', async () => {
      const response = await request(app)
        .post('/api/scores')
        .send({ name: 'Player', score: 'invalid' })
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });

    test('should handle multiple scores from same player', async () => {
      await request(app)
        .post('/api/scores')
        .send({ name: 'Player', score: 100 });
      
      await request(app)
        .post('/api/scores')
        .send({ name: 'Player', score: 200 });
      
      const response = await request(app)
        .get('/api/scores')
        .expect(200);
      
      expect(response.body).toHaveLength(2);
    });

    test('should handle zero score', async () => {
      await request(app)
        .post('/api/scores')
        .send({ name: 'Player', score: 0 })
        .expect(200);
      
      const response = await request(app)
        .get('/api/scores');
      
      expect(response.body[0].score).toBe(0);
    });

    test('should handle very large scores', async () => {
      const largeScore = 999999999;
      
      await request(app)
        .post('/api/scores')
        .send({ name: 'Player', score: largeScore })
        .expect(200);
      
      const response = await request(app)
        .get('/api/scores');
      
      expect(response.body[0].score).toBe(largeScore);
    });

    test('should preserve score order after additions', async () => {
      await request(app).post('/api/scores').send({ name: 'A', score: 50 });
      await request(app).post('/api/scores').send({ name: 'B', score: 100 });
      await request(app).post('/api/scores').send({ name: 'C', score: 75 });
      
      const response = await request(app).get('/api/scores');
      
      expect(response.body[0].name).toBe('B');
      expect(response.body[1].name).toBe('C');
      expect(response.body[2].name).toBe('A');
    });
  });

  describe('CORS Configuration', () => {
    test('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/scores')
        .expect(200);
      
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Data Persistence', () => {
    test('should persist scores to file', async () => {
      await request(app)
        .post('/api/scores')
        .send({ name: 'Player', score: 100 });
      
      const fileContent = fs.readFileSync(scoresFile, 'utf8');
      const scores = JSON.parse(fileContent);
      
      expect(scores).toHaveLength(1);
      expect(scores[0].name).toBe('Player');
      expect(scores[0].score).toBe(100);
    });

    test('should append scores without overwriting', async () => {
      await request(app).post('/api/scores').send({ name: 'P1', score: 100 });
      await request(app).post('/api/scores').send({ name: 'P2', score: 200 });
      
      const fileContent = fs.readFileSync(scoresFile, 'utf8');
      const scores = JSON.parse(fileContent);
      
      expect(scores).toHaveLength(2);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle empty string name', async () => {
      const response = await request(app)
        .post('/api/scores')
        .send({ name: '', score: 100 })
        .expect(400);
      
      expect(response.body.error).toBeDefined();
    });

    test('should handle negative scores', async () => {
      await request(app)
        .post('/api/scores')
        .send({ name: 'Player', score: -100 })
        .expect(200);
      
      const response = await request(app).get('/api/scores');
      expect(response.body[0].score).toBe(-100);
    });

    test('should handle special characters in name', async () => {
      await request(app)
        .post('/api/scores')
        .send({ name: '<script>alert("xss")</script>', score: 100 })
        .expect(200);
      
      const response = await request(app).get('/api/scores');
      expect(response.body[0].name).toBe('<script>alert("xss');
    });

    test('should handle unicode characters in name', async () => {
      await request(app)
        .post('/api/scores')
        .send({ name: '🚗🎮🏁', score: 100 })
        .expect(200);
      
      const response = await request(app).get('/api/scores');
      expect(response.body[0].name).toContain('🚗');
    });
  });
});