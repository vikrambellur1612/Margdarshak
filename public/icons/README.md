# PWA Icons Generation Instructions

This directory contains the PWA icons for Margdarshak FAQ.

## Icons Required

The following PNG icons need to be generated from favicon.svg:

- icon-72x72.png (72x72 pixels)
- icon-96x96.png (96x96 pixels)  
- icon-128x128.png (128x128 pixels)
- icon-144x144.png (144x144 pixels)
- icon-152x152.png (152x152 pixels)
- icon-192x192.png (192x192 pixels)
- icon-384x384.png (384x384 pixels)
- icon-512x512.png (512x512 pixels)
- apple-touch-icon.png (180x180 pixels)

## How to Generate

You can use any of these methods:

### Method 1: Online SVG to PNG Converter
1. Use a service like https://convertio.co/svg-png/
2. Upload favicon.svg
3. Generate each required size

### Method 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
convert favicon.svg -resize 72x72 icon-72x72.png
convert favicon.svg -resize 96x96 icon-96x96.png
convert favicon.svg -resize 128x128 icon-128x128.png
convert favicon.svg -resize 144x144 icon-144x144.png
convert favicon.svg -resize 152x152 icon-152x152.png
convert favicon.svg -resize 192x192 icon-192x192.png
convert favicon.svg -resize 384x384 icon-384x384.png
convert favicon.svg -resize 512x512 icon-512x512.png
convert favicon.svg -resize 180x180 apple-touch-icon.png
```

### Method 3: Using Node.js Script
```bash
npm install sharp
node generate-icons.js
```

## Shortcut Icons

For app shortcuts, create these themed icons:
- shortcut-jee.png (JEE themed - engineering colors)
- shortcut-kcet.png (KCET themed - Karnataka colors) 
- shortcut-medical.png (Medical themed - health colors)
- shortcut-science.png (Science themed - research colors)

## Design Guidelines

- Use the same gradient background (#667eea to #764ba2)
- Maintain the book and graduation cap theme
- Ensure icons look good at all sizes
- Use rounded corners (radius: 32px for 192px icon)
- Keep contrast high for readability
- Follow Material Design and iOS Human Interface Guidelines

## Current Status

✅ favicon.svg created (base icon design)
⏳ PNG icons need to be generated
⏳ Shortcut icons need to be created

Once generated, the PWA will have professional icons for all platforms and use cases.
