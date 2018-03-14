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
                test: /\.less$/,
                include,
                exclude,

                use: ["style-loader", "css-loader", "less-loader"]
            }
        ]
    }
});