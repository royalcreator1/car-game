# 🚗 Futuristic Car Racing Game

A professional, feature-rich car racing game with smooth animations, dynamic gameplay, and a highscore system.

## Features

- **Professional Graphics**: Neon-lit futuristic aesthetic with smooth animations
- **Dynamic Gameplay**: Variable speed, boost system, and lane-based obstacles
- **Highscore System**: Save and track your best scores with player names
- **Particle Effects**: Beautiful explosion and particle effects
- **Responsive Design**: Works on all screen sizes
- **3D Effects**: Rotating obstacles with shadows and gradients

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

- **Frontend**: HTML5 Canvas, CSS3, JavaScript
- **Backend**: Node.js, Express
- **Database**: JSON file (easily replaceable with MongoDB/PostgreSQL)

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

