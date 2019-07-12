import React from 'react';
import ReactDOM from 'react-dom';
import {LocaleProvider} from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';

import App from './App';

import './index.css';

ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <App />
    </LocaleProvider> ,
    document.getElementById('root')
);
