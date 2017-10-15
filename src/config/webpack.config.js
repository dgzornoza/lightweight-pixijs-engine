var webpack = require("webpack");
var path = require("path");

// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const { CheckerPlugin } = require("awesome-typescript-loader")


var libraryName = "lightweight-pixijs-engine";
var baseUrl = __dirname + "/..";
var plugins = [
    new CheckerPlugin()
];



// environment options
var outputFile;
if (process.env.NODE_ENV === "production") {
    plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
    outputFile = libraryName + ".min.js";
} else {
    plugins.push(new DtsBundlePlugin());
    outputFile = libraryName + ".js";
}


// webpack config
var config = {
    entry: [
        baseUrl + "/pixi-engine.ts"
    ],
    // Source maps support ("inline-source-map" also works)
    devtool: "source-map",
    output: {
        path: path.join(baseUrl, "/../dist"),
        filename: outputFile,
        library: libraryName,
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    externals: {
        "es6-shim": "es6-shim",
        "pixi.js": "pixi.js",
        "fpsmeter": "fpsmeter",
        "pixijs-charm": "pixijs-charm"
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "awesome-typescript-loader",
            options: {
                configFileName: baseUrl + "/config/tsconfig.json"
            }
        }]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    plugins: plugins
};

module.exports = config;


/**
 * Plugin for use dtsbundle and unify typescript declaration files
 */
function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function(compiler) {
    compiler.plugin("done", function() {
        var dts = require("dts-bundle");
        var fs = require("fs");

        // delete ouput
        var outputDts = baseUrl + "/../dist/lightweight-pixijs-engine.d.ts";
        if (fs.existsSync(outputDts)) { fs.unlinkSync(outputDts); }

        // bundle
        dts.bundle({
            name: libraryName,
            main: baseUrl + "/../dist/**/*.d.ts",
            out: outputDts,
            removeSource: true,
            outputAsModuleFolder: true
        });
    });
};