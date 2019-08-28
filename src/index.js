import React from 'react';
import ReactDOM from 'react-dom';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';

import App from './App';

import './index.css';

ReactDOM.render(
    <ConfigProvider locale={zhCN} autoInsertSpaceInButton={false}>
        <App />
    </ConfigProvider> ,
    document.getElementById('root')
);
