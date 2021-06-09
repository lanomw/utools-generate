'use strict'

const path = require('path')
const outputPath = path.join(__dirname, 'dist')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  target: 'web',
  mode: 'development',
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: outputPath
  },

  resolve: {
    alias: {
      '@': path.resolve('src')
    }
  },
  plugins: [
    new CopyWebpackPlugin({ patterns: [{ from: 'public', to: outputPath }] })
  ],
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: { chrome: 80 } }], '@babel/preset-react'],
            plugins: [
              '@babel/plugin-transform-runtime',
              ['@babel/plugin-proposal-decorators', { 'legacy': true }],
              '@babel/plugin-proposal-class-properties',
            ]
          }
        }
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: { url: false }
          },
        ]
      }
    ]
  }
}
