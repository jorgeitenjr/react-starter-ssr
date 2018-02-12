import path from 'path';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import webpack from 'webpack';
import StatsWebpackPlugin from 'stats-webpack-plugin';

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const entries = [path.resolve(__dirname, 'src/')];
if (process.env.NODE_ENV === 'development') {
    entries.push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false');
}

const commonModules = [{
    test: /\.jsx?/,
    use: {
        loader: 'babel-loader'
    },
    include: path.resolve(__dirname, 'src'),
},
    {
        test: /(\.css|\.scss|\.sass)$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
            use: [
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                        importLoader: true,
                        localIdentName: '[name]__[local]__[hash:base64:7]'
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        importLoader: true,
                        localIdentName: '[name]__[local]__[hash:base64:7]'
                    }
                }
            ],
            fallback: 'style-loader',
        })
    }];

const plugins = [
    new ExtractCssChunks(),
    new webpack.optimize.CommonsChunkPlugin({
        names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
        filename: '[name].js',
        minChunks: Infinity
    }),
    new StatsWebpackPlugin('stats.json'),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('development')
        }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
        filename: 'bundle.css',
        allChunks: true,
    })
];

export default [{
    name: 'client',
    entry: entries,

    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'client.js',
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
    },
    module: {
        loaders: commonModules
    },
    plugins: plugins
}, {
    name: 'server',
    target: 'node',
    entry: [
        path.resolve(__dirname, 'src/server/server')
    ],
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        loaders: commonModules
    }
}
];
