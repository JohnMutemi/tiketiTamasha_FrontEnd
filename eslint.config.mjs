import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-unused-vars': ['warn'], // Change this rule to "warn" instead of "error"
      'react/react-in-jsx-scope': 'off', // This might be needed if using React 17+
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
  },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
];
