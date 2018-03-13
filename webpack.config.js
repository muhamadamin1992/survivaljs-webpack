const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {

    devServer: {
        stats: "errors-only",
        host: process.env.HOST,
        port: process.env.PORT,

        overlay: {
            errors: true,
            warnings: true
        }
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "Webpack demo"
        })
    ]
};