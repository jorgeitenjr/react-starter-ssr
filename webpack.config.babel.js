import path from 'path';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import webpack from 'webpack';
import StatsWebpackPlugin from 'stats-webpack-plugin';

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
        use: ExtractCssChunks.extract({
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
    },
    {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'image/svg+xml'
                }
            }
        ]
    },
    {
        test: /\.(jpe?g|png|gif|ico)$/i,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ]
    },

];

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
    new webpack.HotModuleReplacementPlugin()
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
