const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { AureliaPlugin } = require('aurelia-webpack-plugin')
const { optimize: { CommonsChunkPlugin }, ProvidePlugin } = require('webpack')

// config helpers:
const ensureArray = config =>
  (config && (Array.isArray(config) ? config : [config])) || []
const when = (condition, config, negativeConfig) =>
  condition ? ensureArray(config) : ensureArray(negativeConfig)

// primary config:
const title = 'Tenant Fit'
const outDir = path.resolve(__dirname, 'dist')
const srcDir = path.resolve(__dirname, 'src')
const nodeModulesDir = path.resolve(__dirname, 'node_modules')
const baseUrl = '/'

const cssRules = [
  { loader: 'css-loader' },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [
        require('autoprefixer')({ browsers: ['last 2 versions'] })
      ]
    }
  }
]

module.exports = ({ production, server, extractCss, coverage } = {}) => ({
  resolve: {
    extensions: ['.js'],
    modules: [srcDir, 'node_modules'],
    alias: {
      components$: path.resolve('src/components/index.js'),
      authConfig: path.resolve(__dirname, 'src/authConfig/index.js'),
      utilities$: path.resolve(__dirname, 'src/utilities/index.js'),
      valueConverters$: path.resolve(__dirname, 'src/valueConverters/index.js'),
      fa: 'font-awesome/css/font-awesome.css'
    }
  },
  devtool: production ? 'source-map' : 'cheap-module-eval-source-map',
  entry: {
    app: ['aurelia-bootstrapper'],
    vendor: ['bluebird', 'jquery', 'bootstrap']
  },
  output: {
    path: outDir,
    publicPath: baseUrl,
    filename: production
      ? '[name].[chunkhash].bundle.js'
      : '[name].[hash].bundle.js',
    sourceMapFilename: production
      ? '[name].[chunkhash].bundle.map'
      : '[name].[hash].bundle.map',
    chunkFilename: production
      ? '[name].[chunkhash].chunk.js'
      : '[name].[hash].chunk.js'
  },
  devServer: {
    port: process.env.PORT || 9000,
    contentBase: outDir,
    // serve index.html for all 404 (required for push-state)
    historyApiFallback: true
  },
  module: {
    rules: [
      // CSS required in JS/TS files should use the style-loader that auto-injects it into the website
      // only when the issuer is a .js/.ts file, so the loaders are not applied inside html templates
      {
        test: /\.css$/i,
        issuer: [{ not: [{ test: /\.html$/i }] }],
        use: extractCss
          ? ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: cssRules
            })
          : ['style-loader', ...cssRules]
      },
      {
        test: /\.css$/i,
        issuer: [{ test: /\.html$/i }],
        // CSS required in templates cannot be extracted safely
        // because Aurelia would try to require it again in runtime
        use: cssRules
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        issuer: /\.[tj]s$/i
      },
      {
        test: /\.scss$/,
        use: ['css-loader', 'sass-loader'],
        issuer: /\.html?$/i
      },
      { test: /\.html$/i, loader: 'html-loader' },
      {
        test: /\.js$/i,
        loader: 'babel-loader',
        exclude: nodeModulesDir,
        options: coverage ? { sourceMap: 'inline', plugins: ['istanbul'] } : {}
      },
      { test: /\.json$/i, loader: 'json-loader' },
      // use Bluebird as the global Promise implementation:
      {
        test: /[\/\\]node_modules[\/\\]bluebird[\/\\].+\.js$/,
        loader: 'expose-loader?Promise'
      },
      // exposes jQuery globally as $ and as jQuery:
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader?$!expose-loader?jQuery'
      },
      // embed small images and fonts as Data Urls and larger ones as files:
      {
        test: /\.(png|gif|jpg|cur|mp4)$/i,
        loader: 'url-loader',
        options: { limit: 10000 }
      },
      {
        test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: 'url-loader',
        options: { limit: 10000, mimetype: 'application/font-woff2' }
      },
      {
        test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: 'url-loader',
        options: { limit: 10000, mimetype: 'application/font-woff' }
      },
      // load these fonts normally, as files:
      {
        test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true,
        screw_ie8: true
      },
      mangle: {
        except: ['$', 'webpackJsonp'],
        screw_ie8: true,
        keep_fnames: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0
    }),
    new AureliaPlugin(),
    new ProvidePlugin({
      Promise: 'bluebird',
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      minify: production
        ? {
            removeComments: true,
            collapseWhitespace: true
          }
        : {},
      metadata: {
        // available in index.ejs //
        title,
        server,
        baseUrl
      }
    }),
    new CopyWebpackPlugin([{ from: 'static/favicon.ico', to: 'favicon.ico' }]),
    ...when(
      extractCss,
      new ExtractTextPlugin({
        filename: production ? '[contenthash].css' : '[id].css',
        allChunks: true
      })
    ),
    ...when(
      production,
      new CommonsChunkPlugin({
        name: 'common'
      })
    )
  ]
})
