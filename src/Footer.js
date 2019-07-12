import React, {Component, PureComponent} from 'react';
import {Layout} from 'antd';

const {Footer}=Layout;

export function FooterComp(props) {
    return (
        <Footer style={{textAlign: 'center', backgroundColor: 'transparent'}}>
            基于 GPLv3 协议在 <a href="https://github.com/pkuhelper-web/syllabus" target="_blank">GitHub</a> 开源
        </Footer>
    );
}