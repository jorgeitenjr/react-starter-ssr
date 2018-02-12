
import React from 'react';
import { hydrate } from 'react-dom';
import App from "./components/App";
import './styles/main.scss';
const render = Component => {
    hydrate(
        <Component/>,
        document.getElementById('react-root')
    );
};

render(App);

/**
 * This script provides hot module reloading in development mode.
 */
if (module.hot && process.env.NODE_ENV === 'development') {
    module.hot.accept('./components/App', () => {
        const App = require('./components/App').default;
        render(App);
    });
}