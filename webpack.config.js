/**
 * @author Anthony Altieri on 10/15/16.
 */

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: [
    './tests/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/static/',
    filename: 'app.bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'PanicJS',
      filename: 'index.html',
      template: 'template.ejs',
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        // include: path.join(__dirname, '../'),
      }
    ]
  }
};

