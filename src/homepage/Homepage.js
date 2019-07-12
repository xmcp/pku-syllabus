import React, {Component, PureComponent} from 'react';
import {PageHeader, Row, Col, Card, Icon, Button} from 'antd';
import {ROUTES} from '../routes';

import './homepage.css';

import index_figure from './homepage_figure.png';

export class Homepage extends Component {
    render() {
        return (
            <div>
                <PageHeader title="课表助手" subTitle="帮您将课表保存到日历" extra={
                    <Button onClick={()=>{this.props.navigate(ROUTES.edit);}}>
                        编辑器
                    </Button>
                } />
                <div className="main-margin">
                    <img src={index_figure} className="homepage-instruction-img" />
                    <br />
                    <p><b>请选择数据来源：</b></p>
                    <br />
                    <Row gutter={16}>
                        <Col md={8}>
                            <Card title={<span><Icon type="chrome" /> Elective</span>}>
                                <Button type="primary" block onClick={()=>{this.props.navigate(ROUTES.import_elective);}}>
                                    <Icon type="right-circle" /> 选课系统
                                </Button>
                                <br /><br />
                                <p>从 elective.pku.edu.cn 导入课表。</p>
                                <p style={{fontWeight: 'bold', color: 'red'}}>选课结束（第三周）前请选择此选项。</p>
                            </Card>
                            <br />
                        </Col>
                        <Col md={8}>
                            <Card title={<span><Icon type="api" /> ISOP</span>}>
                                <Button type="primary" block onClick={()=>{this.props.navigate(ROUTES.import_isop);}}>
                                    <Icon type="right-circle" /> 教务系统
                                </Button>
                                <br /><br />
                                <p>从教务系统的接口导入课表。</p>
                                <p>请注意，数据录入可能有延迟。</p>
                            </Card>
                            <br />
                        </Col>
                        <Col md={8}>
                            <Card title={<span><Icon type="calendar" /> .ICS</span>}>
                                <Button type="primary" block onClick={()=>{this.props.navigate(ROUTES.import_config);}}>
                                    <Icon type="right-circle" /> 日历文件
                                </Button>
                                <br /><br />
                                <p>加载之前导出的日历文件。</p>
                                <p>如果您之前使用过本工具，可以对生成的日历进行编辑。</p>
                            </Card>
                            <br />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}