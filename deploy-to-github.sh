#!/bin/bash

# Margdarshak GitHub Deployment Script

echo "🚀 Margdarshak Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the netlify-deployment directory."
    exit 1
fi

# Check for git repository
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Add remote if not exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Adding GitHub remote..."
    read -p "Enter your GitHub repository URL (https://github.com/username/repo.git): " repo_url
    git remote add origin "$repo_url"
    echo "✅ Remote added: $repo_url"
fi

# Check git status
echo "📊 Checking file changes..."
git add .

# Show status
echo "📋 Files to be committed:"
git status --short

# Get commit message
echo ""
read -p "📝 Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update FAQ content and project structure"
fi

# Commit changes
echo "💾 Committing changes..."
git commit -m "$commit_msg"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Deployment completed successfully!"
echo "🔗 Your repository: $(git remote get-url origin)"
echo "🌍 Once connected to Netlify, your site will auto-deploy on every push!"
echo ""
echo "📝 Next steps:"
echo "   1. Go to netlify.com"
echo "   2. Connect your GitHub repository"
echo "   3. Set publish directory to: /"
echo "   4. Deploy!"
