const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_ICON = path.join(__dirname, '../src/assets/logo.png'); // You'll need to provide a high-res logo
const OUTPUT_DIR = path.join(__dirname, '../public');
const ICONS_DIR = path.join(OUTPUT_DIR, 'icons');
const SPLASH_DIR = path.join(OUTPUT_DIR, 'splash');

// Icon sizes to generate
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Splash screen configurations
const SPLASH_SCREENS = [
  { width: 2048, height: 2732, name: 'apple-splash-2048-2732' },
  { width: 1668, height: 2388, name: 'apple-splash-1668-2388' },
  { width: 1536, height: 2048, name: 'apple-splash-1536-2048' },
  { width: 1125, height: 2436, name: 'apple-splash-1125-2436' },
  { width: 1242, height: 2688, name: 'apple-splash-1242-2688' },
  { width: 828, height: 1792, name: 'apple-splash-828-1792' },
  { width: 1242, height: 2208, name: 'apple-splash-1242-2208' },
  { width: 750, height: 1334, name: 'apple-splash-750-1334' },
  { width: 640, height: 1136, name: 'apple-splash-640-1136' }
];

// Create directories if they don't exist
function ensureDirectories() {
  [ICONS_DIR, SPLASH_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Generate icons
async function generateIcons() {
  console.log('Generating icons...');
  
  for (const size of ICON_SIZES) {
    const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
    await sharp(SOURCE_ICON)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated icon: ${size}x${size}`);
  }

  // Generate shortcut icons
  const shortcutIcons = [
    { name: 'hiragana', color: '#4a90e2' },
    { name: 'katakana', color: '#e24a4a' },
    { name: 'kanji', color: '#4ae24a' }
  ];

  for (const icon of shortcutIcons) {
    const outputPath = path.join(ICONS_DIR, `${icon.name}-96x96.png`);
    await sharp(SOURCE_ICON)
      .resize(96, 96)
      .tint(icon.color)
      .png()
      .toFile(outputPath);
    console.log(`Generated shortcut icon: ${icon.name}`);
  }
}

// Generate splash screens
async function generateSplashScreens() {
  console.log('Generating splash screens...');

  // First, create a resized version of the logo for splash screens
  const logoSize = 512; // Base size for the logo
  const resizedLogo = await sharp(SOURCE_ICON)
    .resize(logoSize, logoSize)
    .toBuffer();

  for (const screen of SPLASH_SCREENS) {
    const outputPath = path.join(SPLASH_DIR, `${screen.name}.png`);
    
    // Calculate logo size for this screen (40% of screen width)
    const logoWidth = Math.floor(screen.width * 0.4);
    const logoHeight = Math.floor(screen.width * 0.4);
    
    // Create a white background with the logo
    await sharp({
      create: {
        width: screen.width,
        height: screen.height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([{
      input: await sharp(resizedLogo)
        .resize(logoWidth, logoHeight)
        .toBuffer(),
      gravity: 'center'
    }])
    .png()
    .toFile(outputPath);
    
    console.log(`Generated splash screen: ${screen.name}`);
  }
}

// Main function
async function generatePWAAssets() {
  try {
    console.log('Starting PWA asset generation...');
    
    // Check if source icon exists
    if (!fs.existsSync(SOURCE_ICON)) {
      throw new Error(`Source icon not found at ${SOURCE_ICON}. Please provide a high-resolution logo image.`);
    }

    ensureDirectories();
    await generateIcons();
    await generateSplashScreens();
    
    console.log('PWA asset generation completed successfully!');
  } catch (error) {
    console.error('Error generating PWA assets:', error);
    process.exit(1);
  }
}

// Run the script
generatePWAAssets(); 