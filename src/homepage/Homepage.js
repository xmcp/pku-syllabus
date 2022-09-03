import React, {Component, PureComponent} from 'react';
import {ExportOutlined, CalendarOutlined, ChromeOutlined, RightCircleOutlined} from '@ant-design/icons';
import {PageHeader, Row, Col, Card, Button, Alert, Affix, DatePicker} from 'antd';
import {ROUTES} from '../routes';
import moment from 'moment';

import './Homepage.css';

export class Homepage extends Component {
    to_moment(date) {
        if(date===null)
            return null;
        else
            return moment(date).utcOffset(8);
    }
    render() {
        let IS_WEBVIEW=/MicroMessenger\/|QQ\//.test(navigator.userAgent);

        return (
            <div>
                <Affix offsetTop={0}>
                    <PageHeader ghost={false} title="课表助手" subTitle="帮你将课表保存到日历" extra={
                        this.props.courses.length>0 && <Button onClick={()=>{this.props.navigate(ROUTES.edit);}}>
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
                    <p style={{textAlign: 'center'}}>
                        <b>开学时间：</b>
                        <DatePicker
                            style={{width: '175px'}}
                            picker="week"
                            value={this.to_moment(this.props.semester)}
                            format={'YYYY-MM-DD'}
                            onChange={(mom, _str)=>{
                                if(mom) {
                                    let monday=moment(mom).utcOffset(8).weekday(0).startOf('day');
                                    console.log(monday.toDate());
                                    this.props.setCourses(null, monday.toDate());
                                }
                            }}
                        />{' '}
                        <Button
                            type="link"
                            size="small"
                            onClick={()=>{window.open('https://www.pku.edu.cn/campus.html#p3a')}}
                        >
                            <ExportOutlined />校历
                        </Button>
                    </p>
                    {this.props.semester!==null && <>
                        <br />
                        <Row gutter={16}>
                            <Col sm={12} flex="1 1 100%">
                                <Card title={<span><ChromeOutlined /> Elective</span>}>
                                    <Button size="large" type="primary" block onClick={()=>{this.props.navigate(ROUTES.import_elective);}}>
                                        <RightCircleOutlined /> 从选课系统导入
                                    </Button>
                                    <br /><br />
                                    <p>初次使用请选择此项</p>
                                </Card>
                                <br />
                            </Col>
                            <Col sm={12} flex="1 1 100%">
                                <Card title={<span><CalendarOutlined /> .ICS</span>}>
                                    <Button size="large" type="primary" ghost block onClick={()=>{this.props.navigate(ROUTES.import_config);}}>
                                        <RightCircleOutlined /> 编辑日历文件
                                    </Button>
                                    <br /><br />
                                    <p>对本工具生成的日历进行编辑</p>
                                </Card>
                                <br />
                            </Col>
                        </Row>
                    </>}
                </div>
            </div>
        );
    }
}