// eslint-disable-next-line no-undef
module.exports = {
  displayName: 'api',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['jest-extended/all'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      isolatedModules: true,
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  transformIgnorePatterns: [
    // all exceptions must be first line
    '/node_modules/(?!@nestjsplus/redirect)',
  ],
  collectCoverage: true,
  coverageReporters: ['html', 'json', 'text', 'lcov'],
  moduleFileExtensions: ['ts', 'js', 'html', 'src'],
  coverageDirectory: '../../coverage/apps/api',
};
