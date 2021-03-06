const path = require('path')
const webpack = require('webpack')
const HtmlwebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    // publicPath: './',
    filename:'[name]bundle.js',
    chunkFilename:'[name]chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
            'stylus': 'vue-style-loader!css-loader!stylus-loader'
          }
        }
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        exclude: /favicon\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve('./'),
        exclude: /node_modules/
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.(pdf|doc)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.less', '.css', '.scss'],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      '~static': path.resolve(__dirname, 'src/static'),
      '~images': path.resolve(__dirname, 'src/images'),
      '~styles': path.resolve(__dirname, 'src/styles'),
      '~utils': path.resolve(__dirname, 'src/utils'),
      '~components': path.resolve(__dirname, 'src/components'),
      '~api': path.resolve(__dirname, 'src/api'),
      '~pages': path.resolve(__dirname, 'src/pages'),
      '~polyfill': path.resolve(__dirname, 'src/polyfill'),
      '~libs': path.resolve(__dirname, 'src/libs'),
      '~constants': path.resolve(__dirname, 'src/constants')
    }
  },
  devServer: {
    // contentBase: path.join(__dirname, "dist"),
    port: 8081,
    historyApiFallback: true,
    // noInfo: true,
    proxy: {
      '/api/*': {
        // target: 'http://future.otcgo.cn/',
        target: 'https://otcgo.cn/',
        secure: false,
        changeOrigin: true
      }
    }
  },
  plugins:[
    new HtmlwebpackPlugin({
      title: 'SEA',
      template: './src/index.html',
      inject: true
    }),
    new CopyWebpackPlugin([
      { from: 'static', to: 'static' }
    ]),
  ],
  performance: {
    hints: false
  },
  devtool: '#cheap-module-eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false,
        drop_console: true
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
