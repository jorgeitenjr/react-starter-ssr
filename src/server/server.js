import App from "../components/App";
import React from "react";
import { renderToString } from 'react-dom/server';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

export default ({clientStats}) => async (req, res) => {
    const appRendered = renderToString(<App />);
    const chunkNames = flushChunkNames();
    const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames });
    res.render('index', {
        appString: appRendered,
        js,
        styles,
        cssHash
    });
};
