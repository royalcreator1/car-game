// Game Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game State
const gameState = {
    running: false,
    score: 0,
    highScore: 0,
    speed: 0,
    maxSpeed: 20,
    roadOffset: 0,
    roadSpeed: 5
};

// Game Objects
const playerCar = {
    x: canvas.width / 2,
    y: canvas.height - 150,
    width: 60,
    height: 100,
    speed: 8,
    color: '#00f260'
};

const obstacles = [];
const roadLines = [];
const particles = [];

// Input handling
const keys = {};

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    playerCar.x = canvas.width / 2;
    playerCar.y = canvas.height - 150;
});

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Initialize road lines
function initRoad() {
    roadLines.length = 0;
    for (let i = 0; i < canvas.height + 100; i += 150) {
        roadLines.push({ y: i, opacity: Math.random() * 0.3 + 0.2 });
    }
}

// Generate obstacle
function generateObstacle() {
    const laneWidth = canvas.width / 4;
    const lanes = [laneWidth, laneWidth * 2, laneWidth * 3];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    
    obstacles.push({
        x: lane,
        y: -100,
        width: 50,
        height: 80,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        rotation: 0,
        speed: gameState.roadSpeed + 2
    });
}

// Generate particles
function createExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: x + Math.random() * 50 - 25,
            y: y + Math.random() * 50 - 25,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 1.0,
            color: `hsl(${Math.random() * 60}, 100%, 50%)`
        });
    }
}

// Update function
function update(deltaTime) {
    if (!gameState.running) return;

    // Update road animation
    gameState.roadOffset += gameState.roadSpeed;
    if (gameState.roadOffset > 150) {
        gameState.roadOffset = 0;
    }

    // Update road lines
    roadLines.forEach(line => {
        line.y += gameState.roadSpeed;
        if (line.y > canvas.height) {
            line.y = -150;
            line.opacity = Math.random() * 0.3 + 0.2;
        }
    });

    // Update player car
    if (keys['ArrowLeft'] && playerCar.x > canvas.width / 6) {
        playerCar.x -= playerCar.speed;
    }
    if (keys['ArrowRight'] && playerCar.x < canvas.width - canvas.width / 6) {
        playerCar.x += playerCar.speed;
    }

    // Boost with spacebar
    if (keys['Space']) {
        gameState.speed = Math.min(gameState.speed + 0.3, gameState.maxSpeed);
    } else {
        gameState.speed = Math.max(gameState.speed - 0.2, gameState.roadSpeed);
    }

    let collisionOccurred = false;

    // Update obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.y += obstacle.speed;
        obstacle.rotation += 0.1;
        
        // Check collision
        if (!collisionOccurred && !gameState.collisionChecked) {
            if (playerCar.x < obstacle.x + obstacle.width &&
                playerCar.x + playerCar.width > obstacle.x &&
                playerCar.y < obstacle.y + obstacle.height &&
                playerCar.y + playerCar.height > obstacle.y) {
                collisionOccurred = true;
                gameState.collisionChecked = true;
                createExplosion(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
                setTimeout(() => gameOver(), 500);
                return;
            }
        }

        // Remove obstacles that are off screen
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            gameState.score += 10;
            updateScoreDisplay();
        }
    });

    // Spawn new obstacles
    if (Math.random() < 0.02) {
        generateObstacle();
    }

    // Update particles
    particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        
        if (particle.life <= 0) {
            particles.splice(index, 1);
        }
    });
}

// Render function
function render() {
    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(10, 10, 10, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw road
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(canvas.width / 6, 0, (canvas.width * 2) / 3, canvas.height);

    // Draw road lines
    roadLines.forEach(line => {
        ctx.strokeStyle = `rgba(255, 255, 255, ${line.opacity})`;
        ctx.lineWidth = 5;
        ctx.setLineDash([20, 30]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, line.y);
        ctx.lineTo(canvas.width / 2, line.y + 50);
        ctx.stroke();
    });

    // Draw obstacles with 3D effect
    obstacles.forEach(obstacle => {
        ctx.save();
        ctx.translate(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
        ctx.rotate(obstacle.rotation);
        
        // Gradient for 3D effect
        const gradient = ctx.createLinearGradient(-obstacle.width / 2, 0, obstacle.width / 2, 0);
        gradient.addColorStop(0, obstacle.color);
        gradient.addColorStop(1, '#000');
        ctx.fillStyle = gradient;
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = obstacle.color;
        ctx.fillRect(-obstacle.width / 2, -obstacle.height / 2, obstacle.width, obstacle.height);
        ctx.restore();
    });

    // Draw player car with glow effect
    ctx.save();
    ctx.shadowBlur = 30;
    ctx.shadowColor = playerCar.color;
    ctx.fillStyle = playerCar.color;
    
    // Car body
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(playerCar.x, playerCar.y, playerCar.width, playerCar.height, 10);
    } else {
        ctx.rect(playerCar.x, playerCar.y, playerCar.width, playerCar.height);
    }
    ctx.fill();
    
    // Car details
    ctx.fillStyle = '#001a0f';
    ctx.fillRect(playerCar.x + 10, playerCar.y + 5, playerCar.width - 20, playerCar.height - 60);
    
    ctx.restore();

    // Draw particles
    particles.forEach(particle => {
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
    });
    ctx.globalAlpha = 1;

    // Update speed display
    const speedPercentage = (gameState.speed / gameState.maxSpeed) * 100;
    document.getElementById('speed-fill').style.width = speedPercentage + '%';
}

// Game loop
function gameLoop(timestamp) {
    update(16);
    render();
    
    if (gameState.running) {
        requestAnimationFrame(gameLoop);
    }
}

// Initialize game
function initGame() {
    gameState.running = true;
    gameState.score = 0;
    gameState.speed = gameState.roadSpeed;
    gameState.collisionChecked = false;
    obstacles.length = 0;
    particles.length = 0;
    initRoad();
    updateScoreDisplay();
    gameLoop();
}

// Game over
function gameOver() {
    gameState.running = false;
    gameState.collisionChecked = true;
    
    const finalScore = gameState.score;
    document.getElementById('final-score').textContent = finalScore;
    
    // Check for new high score
    if (finalScore > gameState.highScore) {
        gameState.highScore = finalScore;
        document.getElementById('new-highscore').classList.remove('hidden');
    } else {
        document.getElementById('new-highscore').classList.add('hidden');
    }
    
    // Show game over screen
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.remove('hidden');
}

// Score management
function updateScoreDisplay() {
    document.getElementById('current-score').textContent = gameState.score;
    document.getElementById('high-score').textContent = gameState.highScore;
}

async function saveScore() {
    const playerName = document.getElementById('player-name').value || 'Anonymous';
    const score = gameState.score;
    
    try {
        const response = await fetch('/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: playerName, score: score })
        });
        
        if (response.ok) {
            console.log('Score saved successfully');
        }
    } catch (error) {
        console.error('Error saving score:', error);
        // Fallback to localStorage
        saveScoreToLocal(playerName, score);
    }
    
    showHighScores();
}

function saveScoreToLocal(name, score) {
    let scores = JSON.parse(localStorage.getItem('scores') || '[]');
    scores.push({ name, score, date: new Date().toISOString() });
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 10);
    localStorage.setItem('scores', JSON.stringify(scores));
    localStorage.setItem('highScore', Math.max(gameState.highScore, score).toString());
}

async function showHighScores() {
    try {
        const response = await fetch('/api/scores');
        const scores = await response.json();
        displayHighScores(scores);
    } catch (error) {
        console.error('Error fetching scores:', error);
        // Fallback to localStorage
        const scores = JSON.parse(localStorage.getItem('scores') || '[]');
        displayHighScores(scores);
    }
}

function displayHighScores(scores) {
    const list = document.getElementById('highscore-list');
    list.innerHTML = '';
    
    if (scores.length === 0) {
        list.innerHTML = '<p style="opacity: 0.5; margin: 20px 0;">No scores yet. Be the first!</p>';
        return;
    }
    
    scores.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'highscore-item';
        item.style.animationDelay = `${index * 0.1}s`;
        item.innerHTML = `
            <span>${index + 1}. ${entry.name}</span>
            <span>${entry.score}</span>
        `;
        list.appendChild(item);
    });
}

// Load high score on start
function loadHighScore() {
    gameState.highScore = parseInt(localStorage.getItem('highScore') || '0');
    updateScoreDisplay();
}

// Screen navigation
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    initGame();
});

document.getElementById('highscore-btn').addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('highscore-screen').classList.remove('hidden');
    showHighScores();
});

document.getElementById('save-score-btn').addEventListener('click', saveScore);

document.getElementById('play-again-btn').addEventListener('click', () => {
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    initGame();
});

document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('highscore-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
});

// Initialize
loadHighScore();

// Initial render
render();

