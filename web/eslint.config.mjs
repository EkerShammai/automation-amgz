import pluginJs from '@eslint/js';
import pluginChaiFriendly from 'eslint-plugin-chai-friendly';
import pluginCypress from 'eslint-plugin-cypress/flat';
import pluginMocha from 'eslint-plugin-mocha';
import globals from 'globals';

export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  pluginCypress.configs.recommended,
  pluginChaiFriendly.configs.recommended,
  pluginMocha.configs.flat.recommended,
  {
    rules: {
      'mocha/no-exclusive-tests': 'warn',
      'mocha/no-skipped-tests': 'warn',
      'mocha/no-mocha-arrows': 'off',
      'cypress/no-unnecessary-waiting': 'off',
      quotes: ['error', 'single', { avoidEscape: true }],
    },
  },
];
