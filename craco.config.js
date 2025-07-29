module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          path: false,
          os: false,
          crypto: false,
          stream: false,
          buffer: false,
          util: false,
          process: false
        }
      },
      ignoreWarnings: [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          );
        },
      ],
    },
  },
  devServer: {
    setupMiddlewares: (middlewares, { app }) => {
      return middlewares;
    },
  },
};
