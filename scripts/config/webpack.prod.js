const path = require("path");

module.exports = {
    mode: "production",
    entry: path.resolve(__dirname, "../../main.js"),
    output: {
        path: path.resolve(__dirname, "../../dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }]
    },
    resolve: {
        alias: {
            phaser: path.resolve(__dirname, '../../node_modules/phaser'),
        },
    },
};