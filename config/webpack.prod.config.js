const merge = require("webpack-merge");
const common = require("./webpack.common.config.js");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "js/[name].[chunkhash:8].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      // 这里有小伙伴可能会疑惑为什么不是 '../public/index.html'
      // 我的理解是无论与要用的template是不是在一个目录，都是从根路径开始查找
      template: "public/index.html",
      inject: "body",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
    // 打包编译前清理dist目录
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
      chunkFilename: "css/[id].[hash].css",
    }),
  ],
  optimization: {
    // 代码分割
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      cacheGroups: {
        framework: {
          test: "framework",
          name: "framework",
          enforce: true,
        },
        vendors: {
          priority: -10,
          test: /node_modules/,
          name: "vendor",
          enforce: true,
        },
      },
    },
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"),
        cssProcessorPluginOptions: {
          preset: ["default", { discardComments: { removeAll: true } }],
        },
        canPrint: true,
      }),
    ],
  },
});
