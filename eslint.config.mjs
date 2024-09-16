// eslint.config.js
import js from '@eslint/js';
import perfectionistAlphabetical from 'eslint-plugin-perfectionist/configs/recommended-alphabetical';

export default [
	perfectionistAlphabetical,
	js.configs.recommended,
	{
		plugins: {},
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
