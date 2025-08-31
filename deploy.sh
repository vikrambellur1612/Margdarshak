#!/bin/bash

# Netlify Deployment Script - Force Cache Refresh
# This script helps ensure that updated files are served after deployment

echo "🚀 Preparing for Netlify deployment..."

# Add timestamp to force cache refresh
TIMESTAMP=$(date +%s)
echo "📅 Deployment timestamp: $TIMESTAMP"

# Create a deployment info file
cat > deployment-info.txt << EOF
Deployment Time: $(date)
Timestamp: $TIMESTAMP
Files Updated: All HTML documents cleaned of navigation elements
Cache Strategy: No-cache for HTML, 5-minute cache for documents
EOF

echo "✅ Deployment preparation complete!"
echo ""
echo "📋 Next steps for Netlify:"
echo "1. Deploy this folder to Netlify"
echo "2. Clear Netlify cache if issues persist:"
echo "   - Go to Site Settings > Build & deploy > Post processing"
echo "   - Click 'Clear cache and deploy site'"
echo "3. Force refresh browser cache with Ctrl+F5 (or Cmd+Shift+R on Mac)"
echo ""
echo "🔧 Cache headers updated in netlify.toml:"
echo "   - HTML files: no-cache for immediate updates"
echo "   - Documents: 5-minute cache with must-revalidate"
echo "   - Removed outdated /data/* cache rules"
