// eslint.config.js
import js from '@eslint/js';
import perfectionistAlphabetical from 'eslint-plugin-perfectionist/configs/recommended-alphabetical';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import { fixupPluginRules } from '@eslint/compat';
import coffee from 'eslint-plugin-coffee';

export default [
	perfectionistAlphabetical,
	js.configs.recommended,
	{
		plugins: {
			// https://github.com/facebook/react/issues/28313
			['react-hooks']: fixupPluginRules(reactHooksPlugin),
			// https://github.com/jsx-eslint/eslint-plugin-react/issues/3699
			['react']: fixupPluginRules(reactPlugin),
		},
		rules: {
			'accessor-pairs': 'error',
			'dot-notation': 'error',
			eqeqeq: 'error',
			'no-await-in-loop': 'error',
			'no-constructor-return': 'error',
			'no-undef': 'off',
			'no-unused-vars': 'off',
			'no-useless-return': 'error',
			'no-var': 'error',
			'sort-imports': 'error',
		},
	},
];
