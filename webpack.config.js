const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const glob = require("glob");
const path = require("path");
const parts = require('./webpack.parts');
const PATHS = {
    app: path.join(__dirname, 'src')
};

const commonConfig = merge([
    {
        plugins: [
            new HtmlWebpackPlugin({
                title: "Webpack demo"
            })
        ]
    },
    parts.loadJavaScript({
        include: PATHS.app
    })
]);

const productionConfig = merge([

    parts.generateSourceMaps({
        type: "source-map"
    }),

    parts.extractCSS({
        use: ["css-loader", parts.autoprefix()]
    }),

    parts.purifyCSS({
        paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true })
    }),

    parts.loadImages({
        options: {
            limit: 15000,
            name: "[name].[ext]"
        }
    }),

    {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "initial"
                    }
                }
            }
        }
    },

    {
        
        plugins: [
            new webpack.optimize.AggressiveSplittingPlugin({

                minSize: 10000,
                maxSize: 30000

            })
        ]
    }
]);

const developmentConfig = merge([
    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
    }),
    
    parts.loadCSS(),
    parts.loadImages()
]);


module.exports = mode => {

    process.env.BABEL_ENV = mode;

    if (mode === "production") {
        return  merge(commonConfig, productionConfig, { mode });
    }

    return merge(commonConfig, developmentConfig, { mode });
};