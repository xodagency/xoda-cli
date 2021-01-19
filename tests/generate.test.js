const generate = require("../src/generate");
const character = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const generatename = () => {
    let firstchar = character.charAt(Math.random() * character.length).toUpperCase()
    let rest = [1, 2, 3, 4, 5, 6].map(() => character.charAt(Math.random() * character.length).toLowerCase()).join("")
    return firstchar + rest
}
generate.generate(".cache", {
    "jsext": "jsx",
    "styleext": "scss",
    "generateLazy": true,
    "generateStorybook": true,
    "generateTest": true
})("c", "atom", generatename())
generate.generate(".cache", {
    "jsext": "tsx",
    "styleext": "scss",
    "generateLazy": true,
    "generateStorybook": true,
    "generateTest": true
})("c", "atom", generatename())