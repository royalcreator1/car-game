const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Database file path
const scoresFile = path.join(__dirname, 'scores.json');

// Initialize scores file if it doesn't exist
if (!fs.existsSync(scoresFile)) {
    fs.writeFileSync(scoresFile, JSON.stringify([]));
}

// Helper function to read scores
function readScores() {
    try {
        const data = fs.readFileSync(scoresFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Helper function to write scores
function writeScores(scores) {
    fs.writeFileSync(scoresFile, JSON.stringify(scores, null, 2));
}

// API Routes
app.get('/api/scores', (req, res) => {
    const scores = readScores();
    // Sort by score descending and return top 10
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

app.listen(PORT, () => {
    console.log(`🎮 Game server running at http://localhost:${PORT}`);
    console.log('🚗 Futuristic Car Racing game is ready to play!');
});

