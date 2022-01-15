module.exports = {
    "env": {
        "browser": true,
	"node": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 13
    },
    "rules": {
	"no-undef": "off",
	"no-useless-concat": "off",
	"no-console": "off",
	"no-underscore-dangle": "off",
	"semi": ["error", "always"]
    },
};
