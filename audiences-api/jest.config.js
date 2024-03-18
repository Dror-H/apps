module.exports = {
  displayName: 'audiences-api',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['jest-extended/all'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      isolatedModules: true,
    },
  },
  collectCoverage: true,
  coverageReporters: ['html', 'json', 'text', 'lcov'],
  moduleFileExtensions: ['ts', 'js', 'html', 'src'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/audiences-api',
};
