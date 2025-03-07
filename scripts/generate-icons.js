const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');

async function generateIcons() {
  console.log('Generating icons...');
  
  // Define icon sizes
  const sizes = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'apple-icon.png', size: 180 },
    { name: 'favicon.ico', size: 32 }
  ];
  
  // Read the SVG file
  const svgPath = path.join(__dirname, '../public/icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);
  
  // Generate each icon
  for (const { name, size } of sizes) {
    const outputPath = path.join(__dirname, '../public', name);
    
    // For favicon.ico, use a different approach
    if (name === 'favicon.ico') {
      await sharp(svgBuffer)
        .resize(size, size)
        .toFile(outputPath);
      console.log(`Generated ${name}`);
      continue;
    }
    
    // For PNG files
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`Generated ${name}`);
  }
  
  console.log('Icon generation complete!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
}); 