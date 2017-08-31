var webpack = require("webpack");
var path = require("path");

var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const { CheckerPlugin } = require("awesome-typescript-loader")


var baseUrl = __dirname + "/..";
var plugins = [
    new CheckerPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        name: ["app", "thirdparty", "polyfills"]
    }),
    new HtmlWebpackPlugin({
        template: baseUrl + "/src/index.html"
    })
];

// environment options
if (process.env.NODE_ENV === "production") {
    plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
}


// webpack config
var config = {
    entry: {
        "polyfills": baseUrl + "/src/polyfills.ts",
        "thirdparty": baseUrl + "/src/thirdparty.ts",
        "app": baseUrl + "/src/app.ts"
    },
    // Source maps support ("inline-source-map" also works)
    devtool: "source-map",
    output: {
        path: path.join(baseUrl, "/../dist/samples"),
        filename: "[name].js"
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                options: {
                    configFileName: baseUrl + "/src/tsconfig.json"
                }
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: "file-loader?name=assets/[name].[hash].[ext]"
            },
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    plugins: plugins
};

module.exports = config;