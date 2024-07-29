module.exports = {
    root: true,
    extends: [
        '@nuxtjs/eslint-config-typescript',
        'eslint:recommended',
        'plugin:vue/vue3-essential',
        '@vue/eslint-config-airbnb',
    ],
    rules: {
        indent: [
            'warn',
            4,
            {
                ignoredNodes: [
                    'TemplateLiteral',
                ],
            },
        ],
        'import/no-extraneous-dependencies': 'off',
        'template-curly-spacing': 'off',
        'vue/attributes-order': 'off',
        'vue/no-unused-vars': 'error',
        'vue/order-in-components': 'error',
        'vue/this-in-template': 'error',
        'vue/component-name-in-template-casing': [
            'error',
            'PascalCase',
            {
                registeredComponentsOnly: false,
            },
        ],
        'vue/script-indent': [
            'error',
            4,
        ],
        'vue/html-indent': [
            'error',
            4,
        ],
        quotes: [
            'error',
            'single',
        ],
        'linebreak-style': 0,
        'no-extra-semi': 'off',
        semi: [
            'error',
            'always',
        ],
        'semi-style': [
            'error',
            'last',
        ],
        'object-curly-newline': [
            'error',
            {
                ObjectExpression: 'always',
                ObjectPattern: {
                    multiline: true,
                },
                ImportDeclaration: {
                    multiline: true,
                    minProperties: 3,
                },
                ExportDeclaration: {
                    multiline: true,
                    minProperties: 3,
                },
            },
        ],
        'object-property-newline': [
            'error',
            {
                allowAllPropertiesOnSameLine: false,
            },
        ],
        'space-before-function-paren': ['error', 'never'],
        'comma-dangle': ['error', 'always-multiline'],
        'arrow-parens': ['error', 'always'],
        'no-plusplus': [
            'error',
            {
                allowForLoopAfterthoughts: true,
            },
        ],
        'vue/html-self-closing': [
            'error',
            {
                html: {
                    void: 'never',
                    normal: 'always',
                },
            },
        ],
        'vue/singleline-html-element-content-newline': [
            'error',
            {
                ignoreWhenNoAttributes: true,
                ignoreWhenEmpty: true,
            },
        ],
        'vue/no-v-html': 0,
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                vue: 'always',
                js: 'never',
            },
        ],
        'no-debugger': 'warn',
        'no-underscore-dangle': 'off',
        'prefer-destructuring': ['error', {
            array: false,
            object: false,
        }, {
            enforceForRenamedProperties: false,
        }],
    },
};
