const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const os = require('os');
const dotenv = require('dotenv');

// Load environment variables from .env file
const envFile = dotenv.config().parsed || {};

// Merge environment variables, prioritizing process.env (Netlify) over .env file
const envKeys = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  ...Object.keys(process.env)
    .filter(key => key.startsWith('REACT_APP_'))
    .reduce((prev, next) => {
      const value = process.env[next];
      if (value === undefined) {
        console.error(`Error: Environment variable ${next} is undefined`);
        process.exit(1);
      }
      // Ensure the value is properly stringified and wrapped in quotes
      prev[`process.env.${next}`] = JSON.stringify(value || '');
      return prev;
    }, {}),
  ...Object.keys(envFile)
    .filter(key => key.startsWith('REACT_APP_') && !process.env[key])
    .reduce((prev, next) => {
      console.log(`Using .env file value for ${next}`);
      // Ensure the value is properly stringified and wrapped in quotes
      prev[`process.env.${next}`] = JSON.stringify(envFile[next] || '');
      return prev;
    }, {})
};

// Add debug logging for environment variables
console.log('Environment variables being injected:', 
  Object.keys(envKeys)
    .filter(key => key.startsWith('process.env.REACT_APP_'))
    .reduce((obj, key) => {
      const value = envKeys[key];
      // Only log the first few characters of sensitive values
      const maskedValue = typeof value === 'string' && value.length > 4 
        ? value.slice(0, 4) + '...' 
        : value;
      obj[key] = maskedValue;
      return obj;
    }, {})
);

// Validate required environment variables
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

// Enhanced environment variable validation
const validateEnvVars = () => {
  const missingEnvVars = requiredEnvVars.filter(varName => {
    const hasVar = !!(process.env[varName] || envFile[varName]);
    if (!hasVar) {
      console.error(`Missing required environment variable: ${varName}`);
    }
    return !hasVar;
  });

  if (missingEnvVars.length > 0) {
    console.error('Build failed: Missing required environment variables:', missingEnvVars.join(', '));
    console.error('Please ensure these variables are set in your Netlify environment settings.');
    process.exit(1);
  }

  // Log successful validation
  console.log('Environment variables validation successful');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Available variables:', Object.keys(envKeys).map(key => key.replace('process.env.', '')));
  console.log('Timestamp:', new Date().toISOString());
};

// Always validate in production
if (process.env.NODE_ENV === 'production') {
  validateEnvVars();
}

// Only require webpack-obfuscator in production
const WebpackObfuscator = process.env.NODE_ENV === 'production' 
  ? require('webpack-obfuscator')
  : null;

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  // Add environment variable validation at the start of the build
  if (isProduction) {
    console.log('Validating environment variables for production build...');
    validateEnvVars();
  }

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: isProduction ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js',
      chunkFilename: isProduction ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
      publicPath: '/',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'thread-loader',
              options: {
                workers: os.cpus().length - 1,
                poolTimeout: isProduction ? 500 : 2000
              }
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                happyPackMode: true,
                configFile: path.resolve(__dirname, 'tsconfig.json')
              }
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: [
            /node_modules/,
            /\.(ts|tsx)$/,
            /\.test\.js$/,
            /\.spec\.js$/
          ],
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                cacheDirectory: true,
                cacheCompression: false
              }
            },
            ...(isProduction && WebpackObfuscator ? [{
              loader: WebpackObfuscator.loader,
              options: {
                rotateStringArray: true,
                stringArray: true,
                stringArrayEncoding: ['base64'],
                stringArrayThreshold: 0.75,
                identifierNamesGenerator: 'hexadecimal',
                compact: true,
                controlFlowFlattening: false,
                deadCodeInjection: false,
                debugProtection: false,
                debugProtectionInterval: false,
                disableConsoleOutput: false,
                log: false,
                numbersToExpressions: false,
                renameGlobals: false,
                selfDefending: false,
                simplify: true,
                splitStrings: false,
                stringArrayIndexShift: true,
                stringArrayRotate: true,
                stringArrayShuffle: true,
                stringArrayWrappersCount: 2,
                stringArrayWrappersChainedCalls: true,
                stringArrayWrappersParametersMaxCount: 4,
                stringArrayWrappersType: 'variable',
                transformObjectKeys: false,
                unicodeEscapeSequence: false
              }
            }] : [])
          ]
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: !isProduction
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !isProduction
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024 // 8kb
            }
          },
          generator: {
            filename: 'static/media/[name].[hash:8][ext]'
          }
        },
        {
          test: /\.json$/,
          type: 'json',
          parser: {
            parse: JSON.parse
          }
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@context': path.resolve(__dirname, 'src/context')
      },
      fallback: {
        "path": "path-browserify",
        "crypto": "crypto-browserify",
        "stream": "stream-browserify",
        "buffer": "buffer",
        "process": "process/browser",
        "zlib": "browserify-zlib",
        "http": "stream-http",
        "https": "https-browserify",
        "os": "os-browserify/browser",
        "url": "url",
        "assert": "assert",
        "util": "util"
      }
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: false,
              drop_debugger: isProduction,
              pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug', 'console.warn'] : [],
              keep_fnames: true,
              keep_classnames: true,
              passes: 2
            },
            mangle: {
              keep_fnames: true,
              keep_classnames: true
            },
            format: {
              comments: false
            }
          },
          extractComments: false
        })
      ],
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `vendor.${packageName.replace('@', '')}`;
            },
            priority: 20,
            reuseExistingChunk: true
          },
          common: {
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true
          }
        }
      },
      runtimeChunk: 'single'
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new webpack.DefinePlugin({
        ...envKeys,
        // Add a global flag to indicate if we're in production
        'process.env.PRODUCTION': JSON.stringify(isProduction),
        // Ensure all environment variables are strings
        ...Object.keys(envKeys).reduce((acc, key) => {
          if (key.startsWith('process.env.REACT_APP_')) {
            acc[key] = JSON.stringify(String(envKeys[key].replace(/^"|"$/g, '')));
          }
          return acc;
        }, {})
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        inject: true,
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        } : false
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public/dict',
            to: 'dict',
            noErrorOnMissing: true
          },
          {
            from: 'public',
            to: '.',
            globOptions: {
              ignore: ['**/index.html', '**/.DS_Store', '**/dict/**']
            }
          },
          { from: 'src/data/romaji-data.json', to: 'romaji-data.json' }
        ]
      }),
      ...(isProduction ? [
        new CompressionPlugin({
          test: /\.(js|css|html|svg)$/,
          algorithm: 'gzip',
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        }),
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
        })
      ] : [])
    ],
    devServer: {
      historyApiFallback: true,
      hot: true,
      port: 3000,
      static: {
        directory: path.join(__dirname, 'public')
      },
      compress: true,
      client: {
        overlay: true,
        progress: true
      }
    },
    devtool: isProduction ? false : 'eval-source-map',
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    stats: {
      errorDetails: true,
      loggingDebug: ['webpack-obfuscator'],
      logging: 'verbose',
      modules: true,
      reasons: true,
      moduleTrace: true,
      errorStack: true,
      children: true
    }
  };
}; 