import express from "express";
import webpack from 'webpack';
import config from '../../webpack.config.babel';
import path from 'path';
import chalk from 'chalk';

/* eslint-disable no-console */
const app = express();

app.set('port', process.env.PORT || 3000);


const compiler = webpack(config);
const clientCompiler = compiler.compilers[0];
const publicPath = config[0].output.publicPath;
const outputPath = config[0].output.path;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../views'));
if (process.env.NODE_ENV !== 'production') {
  console.log(chalk.green(`Running on development mode`));
  app.use(require('webpack-dev-middleware')(compiler, {
    serverSideRender: true
  }));
  app.use(require('webpack-hot-middleware')(clientCompiler));
  app.use(require('webpack-hot-server-middleware')(compiler, {
    serverRendererOptions: {outputPath}
  }));

  app.use(publicPath, express.static(outputPath));
} else {
  console.log(chalk.green(`Running on production mode`));
  const clientStats = require(path.join(__dirname, '../../dist/stats.json'));
  const serverRender = require(path.join(__dirname, '../../dist/server.js')).default;
  const publicPath = '/';
  const outputPath = path.join(__dirname, '../../dist/');

  app.use(publicPath, express.static(outputPath));
  app.use(serverRender({
    clientStats,
    outputPath
  }));
}

app.listen(app.get('port'), () => console.log(chalk.green(`Server listening on port ${app.get('port')}...`)));
