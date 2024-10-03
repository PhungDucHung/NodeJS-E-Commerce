// config-overrides.js
module.exports = {
    webpack: function (config, env) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        zlib: require.resolve('browserify-zlib'),
      };
      return config;
    },
  };