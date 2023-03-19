import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

const config: Config = {
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@/*': ['src/*'],
      '@modules/*': ['src/modules/*'],
    },
    {
      prefix: '<rootDir>/',
    },
  ),
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;
