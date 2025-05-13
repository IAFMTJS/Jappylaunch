const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_SVG = path.join(__dirname, '../src/assets/logo.svg');
const OUTPUT_PNG = path.join(__dirname, '../src/assets/logo.png');

async function convertSvgToPng() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(SOURCE_SVG);

    // Convert SVG to PNG with high resolution
    await sharp(svgBuffer)
      .resize(1024, 1024, { // High resolution for PWA assets
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({
        quality: 100,
        compressionLevel: 9
      })
      .toFile(OUTPUT_PNG);

    console.log('Successfully converted SVG to high-resolution PNG');
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
    process.exit(1);
  }
}

convertSvgToPng(); 