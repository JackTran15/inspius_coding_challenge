import { Config } from 'jest';
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
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

export default config;
