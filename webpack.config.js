const merge = require('webpack-merge');
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
]);

const productionConfig = merge([
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
    })
]);

const developmentConfig = merge([
    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
    }),
    
    parts.loadCSS(),
    parts.loadImages()
]);

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                include: PATHS.app,

                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]"
                    }
                }
            },
            {
                test: /\.css$/,
                use: 'style-loader'
            },
            {
                test: /\.css$/,
                use: 'css-loader'
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                use: 'eslint-loader'
            },
            {
                test: /\.svg$/,
                use: "file-loader"
            },
            {
                test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader",
                options: {
                    limit: 50000,
                    mimetype: "application/font-woff",
                    name: "fonts/[name].[ext]",
                    publicPath: "../"
                }
            }
        ]
    }
};

// module.exports = mode => {

//     if (mode === "production") {
//         return  merge(commonConfig, productionConfig, { mode });
//     }

//     return merge(commonConfig, developmentConfig, { mode });
// };