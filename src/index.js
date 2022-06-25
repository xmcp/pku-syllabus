import React from 'react';
import ReactDOM from 'react-dom';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import App from './App';

import './index.less';

moment.locale('zh-cn');
moment.updateLocale('zh-cn', {
    week : {
        dow: 1, // First day of week is Monday
        doy: 7,  // First week of year must contain 1 January (7 + 1 - 1)
    }
});

ReactDOM.render(
    <ConfigProvider locale={zhCN} autoInsertSpaceInButton={false}>
        <App />
    </ConfigProvider> ,
    document.getElementById('root')
);
