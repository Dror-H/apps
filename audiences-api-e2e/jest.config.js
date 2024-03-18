// eslint-disable-next-line no-undef
module.exports = {
  displayName: 'audiences-api',
  preset: '../../jest.preset.js',
  testTimeout: 10000,
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  transformIgnorePatterns: [
    // all exceptions must be first line
    '/node_modules/(?!@nestjsplus/redirect)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.env.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'src'],
  coverageDirectory: '../../coverage/apps/audiences-api-e2e',
};
