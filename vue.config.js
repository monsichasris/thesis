const { defineConfig } = require("@vue/cli-service");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionPlugin = require("compression-webpack-plugin");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/thesis/" : "/",
  chainWebpack: (config) => {
    config.optimization.splitChunks({
      chunks: "all",
      maxSize: 250000, // Split chunks larger than 250 KiB
    });
  },
  configureWebpack: {
    performance: {
      hints: process.env.NODE_ENV === "production" ? "warning" : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    plugins: [
      new CompressionPlugin({
        test: /\.(js|css|json|html|svg)$/, // Compress these file types
        threshold: 10240, // Only compress files larger than 10 KiB
        minRatio: 0.8, // Compress if the compression ratio is better than 0.8
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: "static", // Generates a static HTML file
        openAnalyzer: true, // Automatically opens the report in your browser
      }),
    ],
  },
});
