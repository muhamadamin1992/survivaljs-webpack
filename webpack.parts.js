const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");


exports.setFreeVariable = (key, value) => {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [new webpack.DefinePlugin(env)]
    };
}

exports.minifyCSS = ({ options }) => ({
    plugins: [
        new OptimizeCSSAssetsPlugin({
            cssProcessor: cssnano,
            cssProcessorOptions: options,
            canPrint: false
        })
    ]
});

exports.minifyJavaScript = () => ({
    optimization: {
        minimizer: [new TerserPlugin({
            sourceMap: true
        })]
    }
});

exports.attachRevision = () => ({
    plugins: [
        new webpack.BannerPlugin({
            banner: new GitRevisionPlugin().version()
        })
    ]
})

exports.clean = path => ({
    plugins: [new CleanWebpackPlugin([path])]
});

exports.autoprefix = () => ({
    loader: "postcss-loader",
    options: {
        plugins: () => [require("autoprefixer")()]
    }
});

exports.purifyCSS = ({ paths }) => ({
    plugins: [new PurifyCSSPlugin({ paths })]
});

exports.extractCSS = ({ include, exclude, use }) => {
    const plugin = new MiniCssExtractPlugin({
        filename: "[name].[contenthash:4].css"
    });

    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include,
                    exclude,

                    use: [
                        MiniCssExtractPlugin.loader,
                      ].concat(use)
                }
            ]
        },
        plugins: [plugin]
    };
};

exports.devServer = ({ host, port } = {}) => ({
    devServer: {
        stats: "errors-only",
        host,
        port,
        overlay: {
            errors: true,
            warnings: true
        }
    }
});

exports.loadCSS = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                include,
                exclude,

                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    },
                    "sass-loader"
                ]
            }
        ]
    }
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                include,
                exclude,
                use: {
                    loader: "url-loader",
                    options
                }
            }
        ]
    }
});

exports.loadJavaScript = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.js$/,
                include,
                exclude,
                use: "babel-loader"
            }
        ]
    }
});

exports.generateSourceMaps = ({ type }) => ({
    devtool: type
})