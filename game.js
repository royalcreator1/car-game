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
    maxSpeed: 25,
    roadOffset: 0,
    roadSpeed: 5,
    flying: false,
    flyTime: 0,
    maxFlyTime: 3000,
    slippery: false,
    slipperyTime: 0,
    boostActive: false,
    boostTime: 0
};

// Game Objects
const playerCar = {
    x: canvas.width / 2,
    y: canvas.height - 150,
    width: 70,
    height: 120,
    speed: 8,
    baseSpeed: 8,
    color: '#00f260',
    tilt: 0,
    wheelsRotation: 0,
    animationFrame: 0
};

const obstacles = [];
const roadLines = [];
const particles = [];
const pedestrians = [];
const powerUps = [];
const hazards = [];
const roadDust = [];

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
        roadLines.push({ 
            y: i, 
            opacity: Math.random() * 0.3 + 0.2,
            offset: Math.random() * 50 - 25
        });
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

// Generate pedestrians
function generatePedestrian() {
    const laneWidth = canvas.width / 4;
    const lanes = [laneWidth, laneWidth * 2, laneWidth * 3];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    
    pedestrians.push({
        x: lane + Math.random() * 30 - 15,
        y: -50,
        width: 20,
        height: 40,
        color: `hsl(${Math.random() * 360}, 50%, 50%)`,
        walkCycle: 0,
        speed: gameState.roadSpeed,
        side: Math.random() > 0.5 ? 1 : -1
    });
}

// Generate power-ups
function generatePowerUp() {
    const laneWidth = canvas.width / 4;
    const lanes = [laneWidth, laneWidth * 2, laneWidth * 3];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const types = ['fly', 'boost'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    powerUps.push({
        x: lane,
        y: -50,
        width: 30,
        height: 30,
        type: type,
        rotation: 0,
        pulse: 0,
        speed: gameState.roadSpeed
    });
}

// Generate hazards
function generateHazard() {
    const laneWidth = canvas.width / 4;
    const lanes = [laneWidth, laneWidth * 2, laneWidth * 3];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const types = ['water', 'grease'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    hazards.push({
        x: lane,
        y: -50,
        width: 60,
        height: 60,
        type: type,
        rotation: 0,
        opacity: 0.7,
        speed: gameState.roadSpeed
    });
}

// Generate particles
function createExplosion(x, y, color = null) {
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: x + Math.random() * 50 - 25,
            y: y + Math.random() * 50 - 25,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            life: 1.0,
            color: color || `hsl(${Math.random() * 60}, 100%, 50%)`
        });
    }
}

function createDust(x, y) {
    for (let i = 0; i < 5; i++) {
        roadDust.push({
            x: x + Math.random() * 80 - 40,
            y: y + Math.random() * 80 - 40,
            size: Math.random() * 8 + 2,
            life: 1.0,
            opacity: Math.random() * 0.3 + 0.2
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

    // Update flying state
    if (gameState.flying) {
        gameState.flyTime -= 16;
        if (gameState.flyTime <= 0) {
            gameState.flying = false;
        }
    }

    // Update slippery state
    if (gameState.slippery) {
        gameState.slipperyTime -= 16;
        if (gameState.slipperyTime <= 0) {
            gameState.slippery = false;
            playerCar.speed = playerCar.baseSpeed;
        }
    }

    // Update boost state
    if (gameState.boostActive) {
        gameState.boostTime -= 16;
        if (gameState.boostTime <= 0) {
            gameState.boostActive = false;
        }
    }

    // Update road lines
    roadLines.forEach(line => {
        line.y += gameState.roadSpeed;
        if (line.y > canvas.height) {
            line.y = -150;
            line.opacity = Math.random() * 0.3 + 0.2;
            line.offset = Math.random() * 50 - 25;
        }
    });

    // Update player car
    const moveSpeed = gameState.slippery ? playerCar.speed * 0.5 : playerCar.speed;
    let moved = false;
    
    if (keys['ArrowLeft'] && playerCar.x > canvas.width / 6) {
        playerCar.x -= moveSpeed;
        moved = true;
        playerCar.tilt = -0.15;
    }
    if (keys['ArrowRight'] && playerCar.x < canvas.width - canvas.width / 6) {
        playerCar.x += moveSpeed;
        moved = true;
        playerCar.tilt = 0.15;
    }
    
    if (!moved) {
        playerCar.tilt *= 0.9;
    }
    
    playerCar.wheelsRotation += gameState.speed * 0.1;
    playerCar.animationFrame += gameState.speed * 0.05;

    // Boost with spacebar
    if (keys['Space'] || gameState.boostActive) {
        gameState.speed = Math.min(gameState.speed + 0.5, gameState.maxSpeed);
    } else {
        gameState.speed = Math.max(gameState.speed - 0.3, gameState.roadSpeed);
    }

    let collisionOccurred = false;

    // Update pedestrians
    pedestrians.forEach((ped, index) => {
        ped.y += ped.speed;
        ped.walkCycle += 0.2;
        
        if (!collisionOccurred && !gameState.collisionChecked && !gameState.flying) {
            if (playerCar.x < ped.x + ped.width &&
                playerCar.x + playerCar.width > ped.x &&
                playerCar.y < ped.y + ped.height &&
                playerCar.y + playerCar.height > ped.y) {
                collisionOccurred = true;
                gameState.collisionChecked = true;
                createExplosion(ped.x + ped.width / 2, ped.y + ped.height / 2, '#ff4444');
                setTimeout(() => gameOver(), 500);
                return;
            }
        }
        
        if (ped.y > canvas.height) {
            pedestrians.splice(index, 1);
            gameState.score += 15;
            updateScoreDisplay();
        }
    });

    // Update obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.y += obstacle.speed;
        obstacle.rotation += 0.15;
        
        if (!collisionOccurred && !gameState.collisionChecked && !gameState.flying) {
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
        
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            gameState.score += 10;
            updateScoreDisplay();
        }
    });

    // Update power-ups
    powerUps.forEach((power, index) => {
        power.y += power.speed;
        power.rotation += 0.1;
        power.pulse = (power.pulse + 0.1) % (Math.PI * 2);
        
        if (playerCar.x < power.x + power.width &&
            playerCar.x + playerCar.width > power.x &&
            playerCar.y < power.y + power.height &&
            playerCar.y + playerCar.height > power.y) {
            if (power.type === 'fly') {
                gameState.flying = true;
                gameState.flyTime = gameState.maxFlyTime;
                createExplosion(power.x + power.width / 2, power.y + power.height / 2, '#00f0ff');
            } else if (power.type === 'boost') {
                gameState.boostActive = true;
                gameState.boostTime = 5000;
                createExplosion(power.x + power.width / 2, power.y + power.height / 2, '#ffff00');
            }
            powerUps.splice(index, 1);
            return;
        }
        
        if (power.y > canvas.height) {
            powerUps.splice(index, 1);
        }
    });

    // Update hazards
    hazards.forEach((hazard, index) => {
        hazard.y += hazard.speed;
        hazard.rotation += 0.05;
        
        if (playerCar.x < hazard.x + hazard.width &&
            playerCar.x + playerCar.width > hazard.x &&
            playerCar.y < hazard.y + hazard.height &&
            playerCar.y + playerCar.height > hazard.y &&
            !gameState.slippery) {
            gameState.slippery = true;
            gameState.slipperyTime = 2000;
            createDust(hazard.x + hazard.width / 2, hazard.y + hazard.height / 2);
        }
        
        if (hazard.y > canvas.height) {
            hazards.splice(index, 1);
        }
    });

    // Spawn entities
    if (Math.random() < 0.015) {
        generateObstacle();
    }
    if (Math.random() < 0.008) {
        generatePedestrian();
    }
    if (Math.random() < 0.003) {
        generatePowerUp();
    }
    if (Math.random() < 0.005) {
        generateHazard();
    }

    // Update particles
    particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        particle.vy += 0.3;
        
        if (particle.life <= 0) {
            particles.splice(index, 1);
        }
    });

    // Update road dust
    roadDust.forEach((dust, index) => {
        dust.y += gameState.roadSpeed;
        dust.life -= 0.01;
        
        if (dust.life <= 0) {
            roadDust.splice(index, 1);
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

    // Draw grass/side edges
    const gradient = ctx.createLinearGradient(0, 0, canvas.width / 6, 0);
    gradient.addColorStop(0, '#0a1a0a');
    gradient.addColorStop(1, '#001a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width / 6, canvas.height);
    ctx.fillRect(canvas.width - canvas.width / 6, 0, canvas.width / 6, canvas.height);

    // Draw road lines with perspective
    roadLines.forEach(line => {
        ctx.strokeStyle = `rgba(255, 255, 255, ${line.opacity})`;
        ctx.lineWidth = 6;
        ctx.setLineDash([30, 40]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 + line.offset, line.y);
        ctx.lineTo(canvas.width / 2 + line.offset, line.y + 60);
        ctx.stroke();
        ctx.setLineDash([]);
    });

    // Draw hazards
    hazards.forEach(hazard => {
        ctx.save();
        ctx.globalAlpha = hazard.opacity;
        
        if (hazard.type === 'water') {
            ctx.fillStyle = '#0099ff';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#0099ff';
        } else {
            ctx.fillStyle = '#888888';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#888888';
        }
        
        ctx.beginPath();
        ctx.arc(hazard.x + hazard.width / 2, hazard.y + hazard.height / 2, 
                hazard.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    // Draw road dust
    roadDust.forEach(dust => {
        ctx.globalAlpha = dust.life * dust.opacity;
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Draw pedestrians
    pedestrians.forEach(ped => {
        ctx.save();
        
        // Body
        ctx.fillStyle = ped.color;
        ctx.fillRect(ped.x + 5, ped.y + 20, 10, 20);
        
        // Head
        ctx.beginPath();
        ctx.arc(ped.x + ped.width / 2, ped.y + 12, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs (walking animation)
        const legOffset = Math.sin(ped.walkCycle) * 3;
        ctx.fillStyle = '#333';
        ctx.fillRect(ped.x + 6, ped.y + 35 + legOffset, 4, 8);
        ctx.fillRect(ped.x + 12, ped.y + 35 - legOffset, 4, 8);
        
        // Arms
        ctx.strokeStyle = ped.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ped.x + 5, ped.y + 25);
        ctx.lineTo(ped.x + 2, ped.y + 25 + Math.sin(ped.walkCycle) * 5);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(ped.x + 15, ped.y + 25);
        ctx.lineTo(ped.x + 18, ped.y + 25 - Math.sin(ped.walkCycle) * 5);
        ctx.stroke();
        
        ctx.restore();
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

    // Draw power-ups
    powerUps.forEach(power => {
        ctx.save();
        ctx.translate(power.x + power.width / 2, power.y + power.height / 2);
        
        const size = 15 + Math.sin(power.pulse) * 5;
        ctx.globalAlpha = 0.8;
        ctx.shadowBlur = 20;
        
        if (power.type === 'fly') {
            ctx.fillStyle = '#00f0ff';
            ctx.shadowColor = '#00f0ff';
        } else {
            ctx.fillStyle = '#ffff00';
            ctx.shadowColor = '#ffff00';
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Icon
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        if (power.type === 'fly') {
            // Wing icon
            ctx.beginPath();
            ctx.moveTo(-size * 0.6, 0);
            ctx.lineTo(0, -size * 0.6);
            ctx.lineTo(size * 0.6, 0);
            ctx.stroke();
        } else {
            // Bolt icon
            ctx.beginPath();
            ctx.moveTo(0, -size * 0.4);
            ctx.lineTo(-size * 0.3, size * 0.2);
            ctx.lineTo(0, 0);
            ctx.lineTo(size * 0.3, size * 0.2);
            ctx.lineTo(0, size * 0.5);
            ctx.stroke();
        }
        
        ctx.restore();
    });
    ctx.globalAlpha = 1;

    // Draw player car with improved design
    ctx.save();
    
    // Flying effect
    if (gameState.flying) {
        ctx.shadowBlur = 40;
        ctx.shadowColor = '#00f0ff';
        
        // Draw wings
        ctx.fillStyle = '#00f0ff';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(playerCar.x - 20, playerCar.y + 40);
        ctx.lineTo(playerCar.x - 40, playerCar.y + 60);
        ctx.lineTo(playerCar.x - 20, playerCar.y + 80);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(playerCar.x + playerCar.width + 20, playerCar.y + 40);
        ctx.lineTo(playerCar.x + playerCar.width + 40, playerCar.y + 60);
        ctx.lineTo(playerCar.x + playerCar.width + 20, playerCar.y + 80);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    
    // Apply tilt
    ctx.translate(playerCar.x + playerCar.width / 2, playerCar.y + playerCar.height / 2);
    ctx.rotate(playerCar.tilt);
    
    // Car body
    const carGradient = ctx.createLinearGradient(-playerCar.width / 2, 0, playerCar.width / 2, 0);
    carGradient.addColorStop(0, '#00ff88');
    carGradient.addColorStop(0.5, playerCar.color);
    carGradient.addColorStop(1, '#00aa44');
    ctx.fillStyle = carGradient;
    
    ctx.shadowBlur = 30;
    ctx.shadowColor = playerCar.color;
    
    // Main body
    ctx.beginPath();
    ctx.moveTo(-playerCar.width / 2 + 5, -playerCar.height / 2);
    ctx.lineTo(playerCar.width / 2 - 5, -playerCar.height / 2);
    ctx.lineTo(playerCar.width / 2, -playerCar.height / 4);
    ctx.lineTo(playerCar.width / 2, playerCar.height / 4);
    ctx.lineTo(playerCar.width / 2 - 5, playerCar.height / 2);
    ctx.lineTo(-playerCar.width / 2 + 5, playerCar.height / 2);
    ctx.lineTo(-playerCar.width / 2, playerCar.height / 4);
    ctx.lineTo(-playerCar.width / 2, -playerCar.height / 4);
    ctx.closePath();
    ctx.fill();
    
    // Windows
    ctx.fillStyle = '#001122';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(-playerCar.width / 3, -playerCar.height / 4, playerCar.width / 1.5, playerCar.height / 3);
    ctx.globalAlpha = 1;
    
    // Wheels
    ctx.save();
    ctx.translate(-playerCar.width / 3, playerCar.height / 2);
    ctx.rotate(playerCar.wheelsRotation);
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(i * Math.PI / 4) * 8, Math.sin(i * Math.PI / 4) * 8);
        ctx.stroke();
    }
    ctx.restore();
    
    ctx.save();
    ctx.translate(playerCar.width / 3, playerCar.height / 2);
    ctx.rotate(playerCar.wheelsRotation);
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(i * Math.PI / 4) * 8, Math.sin(i * Math.PI / 4) * 8);
        ctx.stroke();
    }
    ctx.restore();
    
    ctx.restore();

    // Draw particles
    particles.forEach(particle => {
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
    });
    ctx.globalAlpha = 1;

    // Draw UI overlays
    if (gameState.flying) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    if (gameState.slippery) {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
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
    gameState.flying = false;
    gameState.flyTime = 0;
    gameState.slippery = false;
    gameState.slipperyTime = 0;
    gameState.boostActive = false;
    gameState.boostTime = 0;
    obstacles.length = 0;
    pedestrians.length = 0;
    particles.length = 0;
    powerUps.length = 0;
    hazards.length = 0;
    roadDust.length = 0;
    initRoad();
    updateScoreDisplay();
    gameLoop();
}

// Game over
function gameOver() {
    gameState.running = false;
    gameState.collisionChecked = true;
    gameState.flying = false;
    gameState.slippery = false;
    gameState.boostActive = false;
    
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
    
    // Update speed display
    const speedPercentage = (gameState.speed / gameState.maxSpeed) * 100;
    document.getElementById('speed-fill').style.width = speedPercentage + '%';
    
    // Update status indicators
    let statusText = '';
    if (gameState.flying) {
        statusText = `FLYING (${Math.ceil(gameState.flyTime / 1000)}s)`;
    } else if (gameState.slippery) {
        statusText = `SLIPPERY (${Math.ceil(gameState.slipperyTime / 1000)}s)`;
    } else if (gameState.boostActive) {
        statusText = `BOOSTED (${Math.ceil(gameState.boostTime / 1000)}s)`;
    }
    
    const statusDisplay = document.getElementById('status-display');
    if (statusText) {
        if (!statusDisplay) {
            const div = document.createElement('div');
            div.id = 'status-display';
            div.className = 'status-text';
            document.querySelector('.score-display').appendChild(div);
        }
        statusDisplay.textContent = statusText;
    } else if (statusDisplay) {
        statusDisplay.remove();
    }
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
