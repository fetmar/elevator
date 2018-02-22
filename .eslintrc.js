module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "jest/globals": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "plugins" : ["eslint-plugin-jest"],
    "rules": {
        "complexity": [
          "error", {
            "max" : 4
          }
        ],
        "no-console": 0,
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
