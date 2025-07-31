#!/bin/bash
# Make this script executable: chmod +x scripts/fix-build.sh

# Fix Next.js build issues and module resolution errors
# This script resolves common issues like "Cannot find module './447.js'"

echo "🔧 Starting build troubleshooting..."

# Step 1: Clean build artifacts
echo "🧹 Cleaning build artifacts..."
rm -rf .next
rm -rf out
echo "✅ Cleaned .next and out directories"

# Step 2: Clear npm cache (optional but helpful)
echo "🗑️  Clearing npm cache..."
npm cache clean --force
echo "✅ NPM cache cleared"

# Step 3: Rebuild the application
echo "🏗️  Rebuilding application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
    
    # Step 4: Check if out directory was created
    if [ -d "out" ]; then
        echo "✅ Static export created in /out directory"
        echo "🚀 Ready to serve with: npm run serve"
    else
        echo "❌ Static export not found. Check next.config.ts"
        exit 1
    fi
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi

echo "✨ Build troubleshooting completed successfully!"
echo "💡 To start the application: npm run serve"
