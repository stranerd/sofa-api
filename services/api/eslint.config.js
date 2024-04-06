import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'
import tsEslintParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier/recommended'
import promise from 'eslint-plugin-promise'
import globals from 'globals'

export default [
	eslint.configs.recommended,
	prettier,
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
			parser: tsEslintParser,
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 2021,
			},
		},
		plugins: { promise, ts: tsEslintPlugin, '@stylistic': stylistic },
		rules: {
			'prettier/prettier': 'error',
			'no-console': 'warn',
			'no-debugger': 'error',
			'no-tabs': 'off',
			'no-var': 'error',
			'accessor-pairs': 'off',
			'no-unused-vars': 0,
			'arrow-body-style': ['error', 'as-needed'],
			'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
			semi: ['error', 'never'],
			'@stylistic/semi': ['error', 'never'],
			'prefer-const': ['error'],
			'arrow-parens': ['error', 'always'],
			'no-return-assign': 'off',
			curly: 'off',
			'object-property-newline': 'off',
			'require-atomic-updates': 'off',
			'require-await': 'off',
		},
	},
].map((config) => ({
	...config,
	files: ['**/*.js', '**/*.ts'],
	ignores: ['lib/**/*'],
}))
