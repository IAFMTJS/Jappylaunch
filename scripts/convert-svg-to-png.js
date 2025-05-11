const sharp = require('sharp');
const path = require('path');

const svgPath = path.join(__dirname, '../src/assets/logo.svg');
const pngPath = path.join(__dirname, '../src/assets/logo.png');

async function convertSvgToPng() {
  try {
    console.log('Converting SVG to PNG...');
    await sharp(svgPath)
      .resize(1024, 1024) // High resolution for good quality
      .png()
      .toFile(pngPath);
    console.log('Conversion completed successfully!');
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
    process.exit(1);
  }
}

convertSvgToPng(); 