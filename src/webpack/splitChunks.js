module.exports = (splitChunks, libraries) => {
  if (typeof splitChunks === 'function') {
    return splitChunks();
  }
  if (splitChunks === 'libs') {
    if (libraries) {
      const cacheGroups = {};
      for (const libName in libraries) {
        const value = libraries[libName];
        cacheGroups[libName] = {
          test: eval(`/${value.join('|')}/`),
          name: libName,
        };
      }
      return {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 3000,
        cacheGroups: cacheGroups,
      };
    }
  }
  return {
    chunks: 'all',
    maxInitialRequests: Infinity,
    minSize: 3000,
    cacheGroups: {
      vendors: {
        test: /node_modules/,
        chunks: 'all',
        name(module) {
          let name = 'venderLibs';
          if (libraries) {
            const context = module.context.split('/');
            const nIndex = context.indexOf('node_modules');
            let packageName = context[nIndex + 1];
            if (packageName.indexOf('@') > -1) {
              packageName = `${context[nIndex + 1]}/${context[nIndex + 2]}`;
            }
            const names = Object.keys(libraries);
            names.map((val) => {
              if (libraries[val].indexOf(packageName) >= 0) {
                name = val;
              }
            });
          }
          return name;
        },
      },
    },
  };
};
