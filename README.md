# 🚗 Futuristic Car Racing Game

A professional car racing game with smooth animations, dynamic gameplay, and a highscore system.

## 📝 Development Journey

**Initial Build (2 minutes):** Built perfectly with Cursor AI - worked flawlessly on first try!

**Complexity Journey:** 
- Added water/grease hazards → game started getting stuck
- Added multiple power-ups → more bugs
- Added pedestrians → performance issues
- Spent 20+ minutes debugging stuck state bugs
- Final solution: Simplified back to stable core features

**Lesson Learned:** Sometimes simpler is better. The initial simple version worked perfectly, and adding complexity introduced bugs that took extensive debugging to resolve.

## Features

- **Mr. Bean's Green Mini Cooper**: Classic car design with realistic animations
- **Dynamic Gameplay**: Variable speed, boost system, and lane-based obstacles
- **Highscore System**: Save and track your best scores with player names  
- **Particle Effects**: Beautiful explosion effects on collision
- **Power-Ups**: 
  - 🛸 Fly (3s invincibility)
  - ⚡ Boost (5s speed increase)
- **Simple & Stable**: Tested and working reliably

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## How to Play

- **Arrow Left/Right**: Steer your car
- **Spacebar**: Boost to increase speed
- **Avoid obstacles** to score points
- **Try to achieve the highest score!**

## Game Mechanics

- Score increases as you pass obstacles
- Speed affects difficulty and scoring potential
- Boosting increases speed but uses more resources
- Collision detection with smooth crash animations
- Particle systems for visual feedback

## Technology Stack

- **Frontend**: HTML5 Canvas, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Database**: JSON file for scores

## Known Issues (Removed Features)

The following features were removed due to causing "game stuck" bugs:
- ❌ Water puddles (caused stuck state)
- ❌ Grease patches (caused stuck state)  
- ❌ Slippery road effects (caused stuck state)

These features may work in future versions with better state management.

## File Structure

```
car-game/
├── index.html          # Main game HTML
├── styles.css          # Styling and animations
├── game.js             # Game logic and mechanics
├── server.js           # Backend API server
├── package.json        # Dependencies
├── scores.json         # Highscore database (auto-generated)
└── README.md          # This file
```

## API Endpoints

- `GET /api/scores` - Get top 10 scores
- `POST /api/scores` - Save a new score

## Customization

You can easily customize:
- Car colors and appearance
- Obstacle spawn rates
- Speed parameters
- Road design
- Particle effects

Enjoy racing! 🏁

