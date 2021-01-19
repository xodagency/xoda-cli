const generate = require("../src/generate");

generate.generate(".cache", {
    "jsext": "jsx",
    "styleext": "scss",
    "generateLazy": true,
    "generateStorybook": true,
    "generateTest": true
})("c", "atom", "Buttofdsn")
generate.generate(".cache", {
    "jsext": "tsx",
    "styleext": "scss",
    "generateLazy": true,
    "generateStorybook": true,
    "generateTest": true
})("c", "atom", "Button")