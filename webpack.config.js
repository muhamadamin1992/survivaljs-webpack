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
    })
]);

const developmentConfig = merge([
    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
    }),
    
    parts.loadCSS()
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