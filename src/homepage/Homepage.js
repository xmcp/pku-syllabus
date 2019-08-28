import React, {Component, PureComponent} from 'react';
import {PageHeader, Row, Col, Card, Icon, Button, Alert, Affix} from 'antd';
import {ROUTES} from '../routes';
import {SEMESTER} from '../config';

export class Homepage extends Component {
    render() {
        let IS_WEBVIEW=/MicroMessenger\/|QQ\//.test(navigator.userAgent);

        return (
            <div>
                <Affix offsetTop={0}>
                    <PageHeader title="课表助手" subTitle="帮你将课表保存到日历" extra={
                        this.props.courses.length>0 && <Button size="small" onClick={()=>{this.props.navigate(ROUTES.edit);}}>
                            编辑器
                        </Button>
                    } />
                </Affix>
                <div className="main-margin">
                    {!!IS_WEBVIEW &&
                        <Alert
                            message="请在浏览器中打开"
                            description="QQ、微信等程序的内嵌网页不支持文件下载，故无法正常保存日历。不信你试试。"
                            type="error"
                            showIcon
                        />
                    }
                    <br />
                    <p><b>选择数据来源：</b></p>
                    <br />
                    <Row gutter={16}>
                        <Col md={8}>
                            <Card title={<span><Icon type="chrome" /> Elective</span>}>
                                <Button size="large" type="primary" block onClick={()=>{this.props.navigate(ROUTES.import_elective);}}>
                                    <Icon type="right-circle" /> 选课系统
                                </Button>
                                <br /><br />
                                <p style={{fontWeight: 'bold', color: 'red'}}>选课结束（第三周）前请选择此项</p>
                            </Card>
                            <br />
                        </Col>
                        <Col md={8}>
                            <Card title={<span><Icon type="api" /> ISOP</span>}>
                                <Button size="large" type="primary" block onClick={()=>{this.props.navigate(ROUTES.import_isop);}}>
                                    <Icon type="right-circle" /> 教务系统
                                </Button>
                                <br /><br />
                                <p>数据录入可能有延迟</p>
                            </Card>
                            <br />
                        </Col>
                        <Col md={8}>
                            <Card title={<span><Icon type="calendar" /> .ICS</span>}>
                                <Button size="large" type="primary" block onClick={()=>{this.props.navigate(ROUTES.import_config);}}>
                                    <Icon type="right-circle" /> 日历文件
                                </Button>
                                <br /><br />
                                <p>对本工具生成的日历进行编辑</p>
                            </Card>
                            <br />
                        </Col>
                    </Row>
                    <br />
                    <p>
                        当前是 {SEMESTER.name} /&nbsp;
                        <a onClick={()=>{this.props.navigate(ROUTES.about);}}>关于课表助手</a>
                    </p>
                </div>
            </div>
        );
    }
}