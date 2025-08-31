#!/usr/bin/env python3
"""
Script to add navigation bar to all FAQ HTML files in the Netlify deployment
"""

import os
import re
from pathlib import Path

# Navigation CSS to add
NAV_CSS = """
        /* Navigation Bar Styles */
        .nav-bar {
            background: rgba(47, 90, 160, 0.95);
            backdrop-filter: blur(10px);
            padding: 15px 0;
            margin: -20px -20px 20px -20px;
            border-radius: 10px 10px 0 0;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .nav-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .back-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,0.2);
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: 500;
            transition: all 0.3s ease;
            border: 1px solid rgba(255,255,255,0.3);
        }
        
        .back-button:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .back-button::before {
            content: '←';
            font-size: 16px;
            font-weight: bold;
        }
        
        .nav-title {
            color: white;
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        @media (max-width: 600px) {
            .nav-content {
                flex-direction: column;
                gap: 10px;
            }
            
            .nav-title {
                font-size: 1rem;
            }
        }"""

def get_nav_html(title, relative_path="../"):
    """Generate navigation HTML with appropriate title and path"""
    return f"""    <!-- Navigation Bar -->
    <nav class="nav-bar">
        <div class="nav-content">
            <a href="{relative_path}index.html" class="back-button">Back to Margdarshak FAQ</a>
            <div class="nav-title">{title}</div>
        </div>
    </nav>

"""

def extract_title_from_html(content):
    """Extract page title from HTML content"""
    # Try to get title from <title> tag
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    if title_match:
        title = title_match.group(1).strip()
        # Clean up title (remove " - " suffixes)
        title = re.sub(r'\s*-\s*.*$', '', title)
        return title
    
    # Fallback: try to get from first h1 tag
    h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.IGNORECASE | re.DOTALL)
    if h1_match:
        # Remove HTML tags from h1 content
        title = re.sub(r'<[^>]+>', '', h1_match.group(1)).strip()
        return title
    
    return "FAQ"

def add_navigation_to_file(file_path):
    """Add navigation to a single HTML file"""
    try:
        # Read the file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has navigation
        if 'nav-bar' in content or 'Back to Margdarshak FAQ' in content:
            print(f"✓ {file_path} already has navigation")
            return True
        
        # Extract title for navigation
        title = extract_title_from_html(content)
        
        # Determine relative path based on directory
        if file_path.startswith('./data/'):
            relative_path = "../"
        else:  # documents/ directory
            relative_path = "../"
        
        # Add CSS if not present
        if 'nav-bar' not in content:
            # Find the last CSS rule and add navigation CSS before </style>
            css_pattern = r'(\s*)(</style>)'
            if re.search(css_pattern, content):
                content = re.sub(css_pattern, f'\\1{NAV_CSS}\\1\\2', content)
        
        # Add navigation HTML after <body> tag
        body_pattern = r'(<body>)(\s*)'
        nav_html = get_nav_html(title, relative_path)
        
        if re.search(body_pattern, content):
            content = re.sub(body_pattern, f'\\1\\2{nav_html}', content)
        else:
            print(f"✗ Could not find <body> tag in {file_path}")
            return False
        
        # Write the updated content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Added navigation to {file_path} (Title: {title})")
        return True
        
    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all HTML files"""
    print("Adding navigation to all FAQ HTML files...")
    
    # Find all HTML files except index.html
    html_files = []
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html') and file != 'index.html':
                html_files.append(os.path.join(root, file))
    
    print(f"Found {len(html_files)} HTML files to process")
    
    success_count = 0
    for file_path in sorted(html_files):
        if add_navigation_to_file(file_path):
            success_count += 1
    
    print(f"\n✅ Successfully added navigation to {success_count}/{len(html_files)} files")

if __name__ == "__main__":
    main()
