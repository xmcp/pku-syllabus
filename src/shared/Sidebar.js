import React, {Component, PureComponent} from 'react';
import {CheckSquareOutlined, EditOutlined, ImportOutlined, InfoCircleOutlined, SettingOutlined} from '@ant-design/icons';
import {Menu, Layout, Badge} from 'antd';
import {ROUTES} from '../routes';

import './Sidebar.css';

const {Item, SubMenu}=Menu;
const {Sider}=Layout;

export function SidebarComp(props) {
    return (
        <Sider
            theme="light"
            breakpoint="md"
            collapsedWidth="0"
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                top: 0,
                // paddingTop: '2em',
                left: 0,
            }}
            width={170}
            trigger={null}
        >
            <Menu
                    theme="light"
                    mode="inline"
                    inlineIndent={18}
                    selectedKeys={[props.current_route]}
                    openKeys={["--import-menu"]}
                    onSelect={(e)=>{
                        props.navigate(e.key);
                    }}
            >
                <Item key={ROUTES.homepage}>
                    <SettingOutlined /> 学期配置
                </Item>
                <SubMenu
                    key={"--import-menu"}
                    title={
                        <span>
                            <ImportOutlined /> 导入课表
                        </span>
                    }
                    onTitleClick={(e)=>{
                        props.navigate(ROUTES.import_elective);
                    }}
                    popupClassName="sidebar-menu-popup"
                >
                    <Item key={ROUTES.import_elective}>从选课系统</Item>
                    <Item key={ROUTES.import_config}>从日历文件</Item>
                </SubMenu>
                <Item key={ROUTES.edit}>
                    <EditOutlined /> 编辑
                    &nbsp;
                    <Badge
                        count={props.courses.length}
                        style={{
                            marginTop: '-3px',
                            backgroundColor: 'darkblue',
                        }}
                    />
                </Item>
                <Item key={ROUTES.export_ics}>
                    <CheckSquareOutlined /> 生成日历
                </Item>
                <Item key={ROUTES.about}>
                    <InfoCircleOutlined /> 关于
                </Item>
            </Menu>
        </Sider>
    );
}