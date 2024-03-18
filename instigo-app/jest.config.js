module.exports = {
  displayName: 'instigo-app',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: [
    // all exceptions must be first line
    '/node_modules/(?!lodash-es)',
    'node_modules/(?!@angular|@ngx-translate)',
    'node_modules/(?!.*\\.mjs$)',
  ],
  coverageDirectory: '../../coverage/apps/instigo-app',
  collectCoverage: true,
  coverageReporters: ['html', 'json', 'text', 'lcov'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
    'jest-preset-angular/build/serializers/no-ng-attributes',
  ],
};
