import {TypeScriptConfig} from '@beemo/driver-typescript';

const config: TypeScriptConfig = {
  compilerOptions: {
    typeRoots: ['node_modules/@types', 'types'],
  },
};

export default config;
