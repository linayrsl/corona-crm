const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/client/index.js',
        styles: './src/client/styles.scss'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
        ],
    },
    watchOptions: {
        poll: true,
        ignored: /node_modules/
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new CopyPlugin([
            { from: 'src/client/images', to: 'images' },
            { from: 'src/client/index.html', to: 'index.html' },
        ]),
    ]
};
