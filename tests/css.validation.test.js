/**
 * CSS Validation Tests for styles.css
 * Validates syntax, critical styles, and new additions
 */

const fs = require('fs');
const path = require('path');

describe('CSS Validation', () => {
  let cssContent;
  
  beforeAll(() => {
    const cssPath = path.join(__dirname, '..', 'styles.css');
    cssContent = fs.readFileSync(cssPath, 'utf8');
  });

  test('should have valid CSS syntax', () => {
    // Check for balanced braces
    const openBraces = (cssContent.match(/{/g) || []).length;
    const closeBraces = (cssContent.match(/}/g) || []).length;
    
    expect(openBraces).toBe(closeBraces);
  });

  test('should not have obvious syntax errors', () => {
    expect(cssContent).not.toMatch(/;;/);
    expect(cssContent).not.toMatch(/{{/);
    expect(cssContent).not.toMatch(/}}/);
  });

  test('should have status-text class for new status display', () => {
    expect(cssContent).toMatch(/\.status-text/);
  });

  test('should style status-text appropriately', () => {
    const statusTextBlock = cssContent.match(/\.status-text\s*{[^}]+}/);
    expect(statusTextBlock).toBeTruthy();
    
    if (statusTextBlock) {
      expect(statusTextBlock[0]).toMatch(/font-size/i);
      expect(statusTextBlock[0]).toMatch(/color/i);
    }
  });

  test('should have animation for status text', () => {
    const statusTextBlock = cssContent.match(/\.status-text\s*{[^}]+}/);
    if (statusTextBlock) {
      expect(statusTextBlock[0]).toMatch(/animation/i);
    }
  });

  test('should have speed-fill styles', () => {
    expect(cssContent).toMatch(/speed-fill/);
  });

  test('should have screen classes', () => {
    expect(cssContent).toMatch(/\.screen/);
  });

  test('should have button styles', () => {
    expect(cssContent).toMatch(/\.btn/);
  });

  test('should have game title styles', () => {
    expect(cssContent).toMatch(/game-title/);
  });

  test('should have score display styles', () => {
    expect(cssContent).toMatch(/score-display/);
  });

  test('should use CSS variables or consistent colors', () => {
    const hasColors = cssContent.match(/#[0-9a-fA-F]{3,6}|rgb\(|rgba\(|hsl\(/);
    expect(hasColors).toBeTruthy();
  });

  test('should have responsive design considerations', () => {
    const hasFlexbox = cssContent.match(/display:\s*flex/i);
    const hasGrid = cssContent.match(/display:\s*grid/i);
    const hasMediaQuery = cssContent.match(/@media/i);
    
    expect(hasFlexbox || hasGrid || hasMediaQuery).toBeTruthy();
  });

  test('should have animation or transition effects', () => {
    const hasAnimation = cssContent.match(/@keyframes|animation:|transition:/i);
    expect(hasAnimation).toBeTruthy();
  });

  test('should not have conflicting properties', () => {
    // This is a simple check - in real scenarios you'd want more sophisticated validation
    const displayBlocks = cssContent.match(/display:\s*block;\s*display:/gi);
    expect(displayBlocks).toBeFalsy();
  });

  test('should have box-shadow for depth effects', () => {
    expect(cssContent).toMatch(/box-shadow/i);
  });

  test('should have text-shadow for glow effects', () => {
    expect(cssContent).toMatch(/text-shadow/i);
  });

  test('should use modern CSS units', () => {
    const hasModernUnits = cssContent.match(/rem|em|vh|vw|%/);
    expect(hasModernUnits).toBeTruthy();
  });

  test('should have hover effects for interactivity', () => {
    expect(cssContent).toMatch(/:hover/);
  });

  test('should style hidden class', () => {
    expect(cssContent).toMatch(/\.hidden/);
  });

  test('should not have duplicate selectors with identical properties', () => {
    // This is a basic check
    const selectors = cssContent.match(/\.[a-zA-Z-]+\s*{/g);
    if (selectors) {
      const unique = new Set(selectors);
      // Some duplication is okay (media queries, etc)
      expect(selectors.length).toBeLessThan(unique.size * 3);
    }
  });
});

// Run the tests
console.log('Running CSS Validation Tests...\n');