const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');
const webpack = require('webpack');
module.exports = {

    devServer: {
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },

        stats: "errors-only",
        host: process.env.HOST,
        port: process.env.PORT,

        overlay: {
            errors: true,
            warnings: true
        }
    },

    plugins: [
        new webpack.WatchIgnorePlugin([
            path.join(__dirname, "node_modules")
        ]),

        new HtmlWebpackPlugin({
            title: "Webpack demo"
        })
    ]
};