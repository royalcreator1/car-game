/**
 * HTML Validation Tests for index.html
 * Validates structure, accessibility, and critical elements
 */

const fs = require('fs');
const path = require('path');

describe('HTML Validation', () => {
  let htmlContent;
  
  beforeAll(() => {
    const htmlPath = path.join(__dirname, '..', 'index.html');
    htmlContent = fs.readFileSync(htmlPath, 'utf8');
  });

  test('should have valid HTML5 doctype', () => {
    expect(htmlContent).toMatch(/<!DOCTYPE html>/i);
  });

  test('should have required meta tags', () => {
    expect(htmlContent).toMatch(/<meta charset="UTF-8">/i);
    expect(htmlContent).toMatch(/<meta name="viewport"/i);
  });

  test('should have title tag', () => {
    expect(htmlContent).toMatch(/<title>.*<\/title>/);
  });

  test('should link to styles.css', () => {
    expect(htmlContent).toMatch(/href="styles\.css"/);
  });

  test('should link to game.js', () => {
    expect(htmlContent).toMatch(/src="game\.js"/);
  });

  test('should have gameCanvas element', () => {
    expect(htmlContent).toMatch(/id="gameCanvas"/);
  });

  test('should have all required screens', () => {
    expect(htmlContent).toMatch(/id="start-screen"/);
    expect(htmlContent).toMatch(/id="game-screen"/);
    expect(htmlContent).toMatch(/id="gameover-screen"/);
    expect(htmlContent).toMatch(/id="highscore-screen"/);
  });

  test('should have all required buttons', () => {
    expect(htmlContent).toMatch(/id="start-btn"/);
    expect(htmlContent).toMatch(/id="highscore-btn"/);
    expect(htmlContent).toMatch(/id="save-score-btn"/);
    expect(htmlContent).toMatch(/id="play-again-btn"/);
    expect(htmlContent).toMatch(/id="back-btn"/);
  });

  test('should have score display elements', () => {
    expect(htmlContent).toMatch(/id="current-score"/);
    expect(htmlContent).toMatch(/id="high-score"/);
    expect(htmlContent).toMatch(/id="final-score"/);
  });

  test('should have speed meter', () => {
    expect(htmlContent).toMatch(/id="speed-fill"/);
    expect(htmlContent).toMatch(/class="speed-meter"/);
  });

  test('should have player name input', () => {
    expect(htmlContent).toMatch(/id="player-name"/);
    expect(htmlContent).toMatch(/type="text"/);
  });

  test('should document new power-ups in controls', () => {
    expect(htmlContent).toMatch(/Fly.*3s/i);
    expect(htmlContent).toMatch(/Boost/i);
  });

  test('should document new hazards in controls', () => {
    expect(htmlContent).toMatch(/Water/i);
    expect(htmlContent).toMatch(/Grease/i);
    expect(htmlContent).toMatch(/Slippery/i);
  });

  test('should document game controls', () => {
    expect(htmlContent).toMatch(/Arrow Keys/i);
    expect(htmlContent).toMatch(/Spacebar/i);
  });

  test('should have proper HTML structure', () => {
    const openTags = (htmlContent.match(/<[^/][^>]*>/g) || []).length;
    const closeTags = (htmlContent.match(/<\/[^>]+>/g) || []).length;
    const selfClosing = (htmlContent.match(/<[^>]+\/>/g) || []).length;
    
    // Basic sanity check: should have balanced-ish tags
    expect(openTags - selfClosing).toBeGreaterThanOrEqual(closeTags - 5);
  });

  test('should not have obvious syntax errors', () => {
    expect(htmlContent).not.toMatch(/<<|>>/);
    expect(htmlContent).not.toMatch(/<\/>/);
  });

  test('should have semantic HTML elements', () => {
    expect(htmlContent).toMatch(/<h1>|<h2>/);
    expect(htmlContent).toMatch(/<button/);
    expect(htmlContent).toMatch(/<div/);
  });
});

// Run the tests
console.log('Running HTML Validation Tests...\n');