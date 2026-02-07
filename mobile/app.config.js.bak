const { withGradleProperties } = require('expo/config-plugins');

const withKotlinVersionFix = (config) => {
  return withGradleProperties(config, (config) => {
    // Remove any existing suppressKotlinVersionCompatibilityCheck
    config.modResults = config.modResults.filter(
      (item) => item.key !== 'kotlin.compiler.suppressKotlinVersionCompatibilityCheck'
    );
    
    // Add the suppress flag
    config.modResults.push({
      type: 'property',
      key: 'kotlin.compiler.suppressKotlinVersionCompatibilityCheck',
      value: 'true',
    });
    
    return config;
  });
};

module.exports = ({ config }) => {
  // Merge app.json config with plugin modifications
  const appConfig = {
    ...config,
    plugins: [
      ...(config.plugins || []),
      [withKotlinVersionFix],
    ],
  };
  
  return appConfig;
};
