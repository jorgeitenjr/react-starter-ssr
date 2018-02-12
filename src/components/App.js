import React, { Component } from 'react';
import logo from '../img/react.svg';
import logoPng from '../img/react.png';

export default class App extends Component {

    render() {
        return (
            <div className="app">
            <img src={logo}/>
            <h1>Welcome to React SSR Starter</h1>
            <img src={logoPng}/>
            </div>
        );
    }

}
