const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: "source-map",
    watch: true,
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        open: true
    },
    module: {
        rules: [
           {
             test: /\.scss$/,
             use: [
                 MiniCssExtractPlugin.loader,
                 {
                     loader: "css-loader", options: {
                         sourceMap: true
                     }
                 }, {
                     loader: "sass-loader", options: {
                         sourceMap: true
                     }
                 }
             ]
       }
     ]
   },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
};