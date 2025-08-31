#!/usr/bin/env python3
"""
Script to add smart navigation JavaScript to all FAQ HTML files
"""

import os
import re
from pathlib import Path

# Smart navigation script to add
SMART_NAV_SCRIPT = '''
    <!-- Smart Navigation Script -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const backButton = document.getElementById('back-button');
            
            // Check if user came from main app
            const previousPage = sessionStorage.getItem('previousPage');
            const previousUrl = sessionStorage.getItem('previousUrl');
            
            if (previousPage === 'margdarshak-vault' && previousUrl) {
                // Enhanced back button for users coming from main app
                backButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Add loading state
                    backButton.style.opacity = '0.7';
                    backButton.innerHTML = '← Returning to Margdarshak FAQ...';
                    
                    // Clear session storage
                    sessionStorage.removeItem('previousPage');
                    sessionStorage.removeItem('previousUrl');
                    
                    // Navigate back with a brief delay for better UX
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 300);
                });
                
                // Update button text to show enhanced functionality
                backButton.innerHTML = '← Back to AI Search Results';
                backButton.title = 'Return to your search results in Margdarshak FAQ';
            }
        });
    </script>'''

def add_smart_navigation_to_file(file_path):
    """Add smart navigation to a single HTML file"""
    try:
        # Read the file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has smart navigation
        if 'Smart Navigation Script' in content or 'previousPage' in content:
            print(f"✓ {file_path} already has smart navigation")
            return True
        
        # Skip files that don't have the back-button structure
        if 'back-button' not in content:
            print(f"✗ {file_path} doesn't have back-button structure")
            return False
        
        # Add id="back-button" to the back button if not present
        if 'id="back-button"' not in content:
            content = re.sub(
                r'class="back-button"',
                r'class="back-button" id="back-button"',
                content
            )
        
        # Add smart navigation script before </body> tag
        body_end_pattern = r'(</body>)'
        if re.search(body_end_pattern, content):
            content = re.sub(body_end_pattern, f'{SMART_NAV_SCRIPT}\\n\\1', content)
        else:
            print(f"✗ Could not find </body> tag in {file_path}")
            return False
        
        # Write the updated content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Added smart navigation to {file_path}")
        return True
        
    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all HTML files"""
    print("Adding smart navigation to all FAQ HTML files...")
    
    # Find all HTML files except index.html
    html_files = []
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html') and file != 'index.html':
                html_files.append(os.path.join(root, file))
    
    print(f"Found {len(html_files)} HTML files to process")
    
    success_count = 0
    for file_path in sorted(html_files):
        if add_smart_navigation_to_file(file_path):
            success_count += 1
    
    print(f"\n✅ Successfully added smart navigation to {success_count}/{len(html_files)} files")

if __name__ == "__main__":
    main()
