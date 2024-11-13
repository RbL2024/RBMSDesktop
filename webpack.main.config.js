const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Path to your HTML template
      filename: 'index.html', // Output HTML file
      inject: 'body', // Inject scripts into the body
    }),
  ],
  devServer: {
    contentBase: './dist', // Serve content from the dist directory
  },
};
