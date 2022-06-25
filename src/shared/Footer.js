import React, {Component, PureComponent} from 'react';
import {Layout} from 'antd';
import {ROUTES} from '../routes';

const {Footer}=Layout;

export function FooterComp(props) {
    return (
        <Footer style={{textAlign: 'center', backgroundColor: 'transparent'}}>
            <a onClick={()=>{props.navigate(ROUTES.about);}}>关于课表助手</a> by @xmcp
        </Footer>
    );
}