const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");

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
    const plugin = new ExtractTextPlugin({
        allChunks: true,
        filename: "[name].css"
    });

    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include,
                    exclude,

                    use: plugin.extract({
                        use,
                        fallback: "style-loader"
                    })
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
