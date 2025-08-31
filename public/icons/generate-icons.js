// Icon Generator Script for Margdarshak FAQ PWA
// This script helps generate PWA icons from the SVG favicon

const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

// Icon sizes required for PWA
const iconSizes = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' }
];

// Shortcut icon themes
const shortcutIcons = [
  { name: 'shortcut-jee.png', theme: 'engineering', color: '#2563eb' },
  { name: 'shortcut-kcet.png', theme: 'karnataka', color: '#dc2626' },
  { name: 'shortcut-medical.png', theme: 'medical', color: '#059669' },
  { name: 'shortcut-science.png', theme: 'science', color: '#7c3aed' }
];

async function generateIcons() {
  const svgPath = path.join(__dirname, 'favicon.svg');
  const outputDir = __dirname;

  if (!fs.existsSync(svgPath)) {
    console.error('❌ favicon.svg not found in icons directory');
    console.log('Please ensure favicon.svg exists first');
    return;
  }

  console.log('🎨 Generating PWA icons from favicon.svg...');

  try {
    // Generate main app icons
    for (const icon of iconSizes) {
      await sharp(svgPath)
        .resize(icon.size, icon.size)
        .png()
        .toFile(path.join(outputDir, icon.name));
      
      console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
    }

    // Generate favicon.ico
    await sharp(svgPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(outputDir, 'favicon-32x32.png'));
    
    console.log('✅ Generated favicon-32x32.png');

    console.log('\n🎉 All PWA icons generated successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Optionally create themed shortcut icons');
    console.log('2. Test PWA installation');
    console.log('3. Run Lighthouse PWA audit');

  } catch (error) {
    console.error('❌ Error generating icons:', error);
    console.log('\n💡 Alternative methods:');
    console.log('1. Use online SVG to PNG converter');
    console.log('2. Use ImageMagick: convert favicon.svg -resize 192x192 icon-192x192.png');
    console.log('3. Use Figma or other design tools');
  }
}

// Instructions for running this script
console.log('📋 PWA Icon Generator for Margdarshak FAQ');
console.log('============================================');
console.log('');
console.log('To use this script:');
console.log('1. npm install sharp');
console.log('2. node generate-icons.js');
console.log('');
console.log('Manual alternatives:');
console.log('- Online: https://convertio.co/svg-png/');
console.log('- ImageMagick: convert favicon.svg -resize SIZE icon.png');
console.log('- Design tools: Figma, Photoshop, etc.');
console.log('');

// Uncomment the line below to run the generator
// generateIcons();

module.exports = { generateIcons };
