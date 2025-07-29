module.exports = {
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // Your custom middleware setup here if needed
      return middlewares;
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Your webpack customizations here if needed
      return webpackConfig;
    },
  },
};
