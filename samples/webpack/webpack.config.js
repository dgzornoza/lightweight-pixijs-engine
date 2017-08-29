var webpack = require("webpack");
var path = require("path");

// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const { CheckerPlugin } = require("awesome-typescript-loader")


var libraryName = "charm";
var baseUrl = __dirname + "/..";
var plugins = [new CheckerPlugin()];

// environment options
var outputFile;
if (process.env.NODE_ENV === "production") {
    plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
    outputFile = libraryName + ".min.js";
} else {
    outputFile = libraryName + ".js";
}


// webpack config
var config = {
    entry: [
        baseUrl + "/src/charm.ts"
    ],
    // Source maps support ("inline-source-map" also works)
    devtool: "source-map",
    output: {
        path: path.join(baseUrl, "/dist"),
        filename: outputFile,
        library: libraryName,
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    externals: {
        "pixi.js": "pixi.js",
        "es6-shim": "es6-shim"
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    plugins: plugins
};

module.exports = config;