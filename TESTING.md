# Testing Documentation

## Overview
This document describes the comprehensive test suite for the Futuristic Car Racing Game.

## Test Coverage

### 1. Game Logic Tests (`game.test.js`)
Tests for all game mechanics including:
- **Game State Management**: Flying, slippery, boost states
- **Entity Generation**: Pedestrians, power-ups, hazards
- **Collision Detection**: With and without flying mode
- **Scoring System**: Points for obstacles and pedestrians
- **Speed & Movement**: Boost, deceleration, slippery effects
- **Particle Effects**: Explosions and dust
- **Animation**: Walk cycles, rotations, tilting
- **Edge Cases**: Multiple power-ups, boundary conditions

### 2. Server Tests (`server.test.js`)
Tests for backend API:
- **GET /api/scores**: Retrieve top 10 scores
- **POST /api/scores**: Save new scores
- **Data Validation**: Name truncation, score validation
- **Error Handling**: Invalid data, corrupted files
- **CORS Configuration**: Cross-origin requests
- **Data Persistence**: File operations

### 3. HTML Validation (`tests/html.validation.test.js`)
Validates HTML structure:
- Valid HTML5 doctype
- Required meta tags
- All game screens present
- Button and input elements
- Game controls documentation
- New features documented (power-ups, hazards)

### 4. CSS Validation (`tests/css.validation.test.js`)
Validates CSS:
- Syntax correctness
- New status-text class
- Animation definitions
- Responsive design
- Modern CSS usage

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
npm run test:server    # Server tests only
npm run test:game      # Game logic tests only
npm run test:html      # HTML validation
npm run test:css       # CSS validation
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm test -- --coverage
```

## New Features Tested

### Power-Ups
- ✈️ **Fly**: Makes player invulnerable for 3 seconds
- ⚡ **Boost**: Increases speed temporarily

### Hazards
- 💧 **Water**: Makes road slippery
- 🛢️ **Grease**: Reduces control

### Pedestrians
- New obstacle type with walk animation
- Awards more points when avoided

### Enhanced Graphics
- Car tilting when turning
- Wheel rotation
- Dust particle effects
- Enhanced explosion effects

## Test Structure

Each test file follows this pattern:
1. **Setup**: Mock DOM/Canvas, initialize state
2. **Execute**: Run the function/scenario
3. **Assert**: Verify expected behavior
4. **Cleanup**: Reset state for next test

## Continuous Integration

These tests are designed to run in CI/CD pipelines. They:
- Don't require a browser
- Mock all DOM dependencies
- Run in isolation
- Complete quickly

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure >80% code coverage
3. Test happy paths and edge cases
4. Document new test scenarios

## Debugging Tests

To debug a specific test:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand game.test.js
```

Then attach your debugger to the Node process.