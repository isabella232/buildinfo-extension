import path from 'path'

import webpack from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ZipPlugin from 'zip-webpack-plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

export default (env={}) => {

  return ({
    entry: ['babel-polyfill', './src/index.js'],
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist')
    },

    module: {
      rules: [
        { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
        { test: /\.css$/, loader: ['style-loader', 
          { loader: 'css-loader', options: { modules: true }}]
        },
        { test: /\.styl$/, loader: ['style-loader',
          { loader: 'css-loader', options: { modules: true }}, 'stylus-loader'] 
        }
      ]
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new CopyWebpackPlugin([
        {from: './chrome/manifest.json', to: '.' },
        {from: './public/inject.js', to: '.' },
        {from: './public/popup.html', to: '.' },
        {from: './public/icons', to: './icons' },
      ], {copyUnmodified: true}),
      (env.prod && new UglifyJSPlugin({
        //sourceMap: true
      })),
      (env.zip && new ZipPlugin({
        filename: 'extension.zip'
      }))
    ].filter(x => x)
  })
}
