var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {

    mode: 'development',
    // 项目入口
    entry: "./src/pages/app.js",
    // 打包文件输出路径
    output: {
        path: path.join(__dirname, "./public/js"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        babelrc:true,
                        plugins: [
                            ['import', [{ libraryName: "antd", style: 'css' }]]]
                    }
                }],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.(jpg|png|otf)$/,
                use: {
                    loader: "url?limit=8192"
                }
            }, {
                test: /\.scss$/,
                use: {
                    loader: "style!css!sass"
                }
            }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./views/index.html"
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        hot: true,
        port: 5000
    }
};