const fs = require('fs');
const path = require('path');

// Required environment variables
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

// Log all environment variables (safely)
console.log('Environment check:');
console.log('------------------');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CI:', process.env.CI);
console.log('NETLIFY:', process.env.NETLIFY ? 'true' : 'false');
console.log('NETLIFY_ENV:', process.env.NETLIFY_ENV);
console.log('NETLIFY_DEV:', process.env.NETLIFY_DEV);

// Check required variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
const presentVars = requiredEnvVars.filter(varName => process.env[varName]);

console.log('\nRequired variables status:');
console.log('-------------------------');
console.log('Present variables:', presentVars.length);
presentVars.forEach(varName => {
  const value = process.env[varName];
  const maskedValue = value ? '*'.repeat(Math.min(4, value.length)) + value.slice(-4) : 'undefined';
  console.log(`${varName}: ${maskedValue}`);
});

console.log('\nMissing variables:', missingVars.length);
if (missingVars.length > 0) {
  console.log('Missing:', missingVars.join(', '));
}

// Check if we're in a Netlify environment
if (process.env.NETLIFY) {
  console.log('\nNetlify environment detected');
  console.log('Build directory:', process.env.NETLIFY_BUILD_BASE);
  console.log('Repository:', process.env.REPOSITORY_URL);
  
  // Try to read netlify.toml
  try {
    const netlifyConfig = fs.readFileSync(path.join(process.cwd(), 'netlify.toml'), 'utf8');
    console.log('\nnetlify.toml contents:');
    console.log('---------------------');
    console.log(netlifyConfig);
  } catch (error) {
    console.error('Error reading netlify.toml:', error.message);
  }
}

// Exit with error if any required variables are missing
if (missingVars.length > 0) {
  console.error('\n❌ Build failed: Missing required environment variables');
  console.error('Please set the following variables in your Netlify environment:');
  console.error(missingVars.join('\n'));
  process.exit(1);
}

console.log('\n✅ All required environment variables are present');
process.exit(0); 