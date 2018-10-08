const merge = require('webpack-merge');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HappyPack = require("happypack");

const glob = require("glob");
const path = require("path");
const parts = require('./webpack.parts');
const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, "dist")
};

const commonConfig = merge([
    {
        plugins: [
            new HappyPack({
                loaders: [
                    "babel-loader"
                ]
            })
        ]
    },
    {
        plugins: [
            new HtmlWebpackPlugin({
                title: "Webpack demo"
            })
        ]
    },
    parts.loadJavaScript({
        include: PATHS.app
    }),

    parts.setFreeVariable("HELLO", "hello from config")
]);

const productionConfig = merge([

    {
        performance: {
            hints: "warning",
            maxEntrypointSize: 50000,
            maxAssetSize: 450000
        }
    },

    {
        output: {
            chunkFilename: "[name].[chunkhash:4].js",
            filename: "[name].[chunkhash:4].js"
        },
        
        recordsPath: path.join(__dirname, "records.json")
    },

    parts.clean(PATHS.build),

    parts.minifyJavaScript(),

    parts.minifyCSS({
        options: {
            discardComments: {
                removeAll: true,
                safe: true
            }
        }
    }),

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
            name: "[name].[hash:4].[ext]"
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
            },

            runtimeChunk: {
                name: "manifest"
            }
        }
    },

    parts.attachRevision()
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