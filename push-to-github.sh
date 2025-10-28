#!/bin/bash

# Script to push code to GitHub and create PR

echo "🚀 GitHub Push and PR Setup Script"
echo "===================================="
echo ""

# Check if remote exists
if git remote -v | grep -q "origin"; then
    echo "✅ Remote 'origin' already configured"
    git remote -v
    echo ""
else
    echo "❌ No remote configured yet"
    echo ""
    echo "Please follow these steps:"
    echo ""
    echo "1. Create a new repository on GitHub:"
    echo "   Go to: https://github.com/new"
    echo "   Name it: car-game"
    echo "   DON'T initialize with README/gitignore"
    echo ""
    echo "2. Run these commands:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/car-game.git"
    echo "   git push -u origin main"
    echo "   git push -u origin develop"
    echo ""
    echo "3. Create PR on GitHub:"
    echo "   - Go to your repository"
    echo "   - Click 'Compare & pull request'"
    echo "   - Merge develop into main"
    echo ""
    exit 0
fi

echo "Current branches:"
git branch -a
echo ""

echo "Ready to push? This will:"
echo "  - Push main branch"
echo "  - Push develop branch"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Pushing main branch..."
    git push -u origin main
    
    echo "📤 Pushing develop branch..."
    git push -u origin develop
    
    echo ""
    echo "✅ Done! Now go to GitHub to create your PR:"
    echo "   https://github.com/YOUR_USERNAME/car-game/compare/main...develop"
else
    echo "❌ Cancelled"
fi

