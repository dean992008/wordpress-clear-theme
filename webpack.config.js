const path = require('path');

module.exports = {
    entry: {
        scripts: [
            './bem/entry.ts',
        ]
    },
    output: {
        filename: 'scripts.js',
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: ['./node_modules'],
        alias: {
            jquery: "jquery/src/jquery"
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "awesome-typescript-loader"
            }
        ]
    }
}