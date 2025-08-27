const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
    ...jestConfig,
    modulePathIgnorePatterns: ['<rootDir>/.localdevserver'],
    coveragePathIgnorePatterns: ['.*__snapshots__.*', 'constants.js']
};
