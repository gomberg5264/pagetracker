export const workspaceEx = {
  'teambit.bit/workspace': {
    name: 'a-ws-using-react',
    icon: 'https://domain.com/my-ws-icon.svg',
    defaultScope: 'my-org.my-scope',
  },
  'teambit.bit/react': {
    compiler: 'babel',
    tester: 'mocha',
    reactVersion: '^16.13.1',
  },
  'teambit.bit/variants': {
    'components/react/ui-primitives': {
      'teambit.bit/react': {
        compiler: 'ts',
        tester: 'jest',
      },
    },
  },
  'teambit.bit/dependency-resolver': {
    packageManager: 'teambit.bit/pnpm',
    policy: {
      peerDependencies: {
        react: '^16.13.1',
        '@babel/runtime': '^7.11.2',
        'react-dom': '^16.13.1',
      },
    },
  },
};

export const workspaceProps = [
  {
    name: 'compiler',
    type: "'babel' | 'ts'",
    description: 'Choose a compiler',
    default: { value: "'ts'" },
  },
  {
    name: 'tester',
    type: "'jest' | 'mocha'",
    description: 'Choose a test runner.',
    default: { value: "'jest'" },
  },
  {
    name: 'reactVersion',
    type: 'string',
    description: 'Choose a version of React.',
    default: { value: "'^16.13.1'" },
  },
];

export const extensionDirStructure = `
$ mkdir -p extensions/custom-react
$ touch extensions/custom-react/custom-react.extension.ts
$ touch extensions/custom-react/index.ts
`;

export const customReactExt = `
// Import from the Environments aspect to register this extension as an environment
import { EnvsMain, EnvsAspect } from '@teambit/environments';
// Import from the React aspect to extend it
import { ReactAspect, ReactMain } from '@teambit/react';

export class CustomReactExtension {
  constructor(private react: ReactMain) {}

  // This icon will be shown in the Workspace UI navigation for every component using this extension 
  icon() {
    return this.react.icon;
  }

  // Set the necessary dependencies to be injected (by Harmony) in the following 'provider' function
  static dependencies: any = [EnvsAspect, ReactAspect];

  static async provider([envs, react]: [EnvsMain, ReactMain]) {
    const customReactEnv = react.compose([

      // THIS IS WHERE WE PLACE THE RELEVANT OVERRIDE FUNCTIONS

    ]);

    // Register this extension as an environment using the "registerEnv" slot (provided by the Environments aspect).
    envs.registerEnv(customReactEnv);

    return new CustomReactExtension(react);
  }
}

`;

export const exportExtension = `
import { CustomReactExtension } from './custom-react.extension';

export { CustomReactExtension };
export default CustomReactExtension;
`;
