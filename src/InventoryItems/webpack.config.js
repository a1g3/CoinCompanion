const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = './wwwroot/dist';

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    return [{
        mode: isDevBuild ? 'development' : 'production',
        stats: { modules: false },
        context: __dirname,
        resolve: { extensions: [ '.js', '.ts' ] },
        entry: { 'main': './ClientApp/boot.ts' },
        module: {
            rules: [
                { test: /\.vue\.html$/, include: /ClientApp/, loader: 'vue-loader', options: { loaders: { js: 'awesome-typescript-loader?silent=true' } } },
                { test: /\.ts$/, include: /ClientApp/, use: 'awesome-typescript-loader?silent=true' },
                { test: /\.css$/, use: isDevBuild ? ['style-loader', 'css-loader'] : [MiniCssExtractPlugin.loader, 'css-loader'] },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
            ]
        },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: '[name].js',
            publicPath: 'dist/'
        },
        plugins: [
            new VueLoaderPlugin(),
            new CheckerPlugin(),
            new MiniCssExtractPlugin({
                filename: isDevBuild ? '[name].css' : '[name].[hash].css',
                chunkFilename: isDevBuild ? '[id].css' : '[id].[hash].css',
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(isDevBuild ? 'development' : 'production')
                }
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            // Plugins that apply in production builds only
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: true
                },
                sourceMap: true
            }),
            new MiniCssExtractPlugin('site.css')
        ])
    }];
};
