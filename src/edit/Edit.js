import React, {Component, PureComponent} from 'react';
import {Table, Icon, Button, Popover, Input, InputNumber, Select, PageHeader, Row, Col, Affix} from 'antd';
import {describe_time} from '../utils';
import {ROUTES} from '../routes';

const InputGroup=Input.Group;
const {Option}=Select;

class CourseChanger extends Component {
    constructor(props) {
        super(props);
        this.state={
            changed: false,
        };
        this.inputs={};
        Object.keys(props.course).forEach((k)=>{
            this.inputs[k]=null;
        });
    }

    do_save() { // todo: validate input
        let co=Object.assign({},this.props.course);
        Object.keys(this.inputs).forEach((k)=>{
            let parse=(typeof co[k]===typeof 1) ? parseInt : (x)=>x;
            if(this.inputs[k]!==null)
                co[k]=parse(this.inputs[k]);
        });
        delete co['key'];
        this.props.do_modify(co);
        this.setState({
            changed: false,
        });
    }

    render() {
        let co=this.props.course;

        let change_meta=(name)=>{
            return (val)=>{ // val may be event (for `Input`s) or value (for `Select`s)
                if(val.target)
                    val=val.target.value;
                this.inputs[name]=val;
                this.setState({
                    changed: true,
                });
            }
        };

        return (
            <div>
                <p><Input addonBefore="名称" defaultValue={co.course_name} onChange={change_meta('course_name')} /></p>
                <br />
                <InputGroup compact>
                    <Input style={{width: '25%'}} type="number" prefix="第" defaultValue={co.begin_week} suffix="~" onChange={change_meta('begin_week')} />
                    <Input style={{width: '25%'}} type="number" defaultValue={co.end_week} suffix="周" onChange={change_meta('end_week')} />
                    <Select style={{width: '25%'}} defaultValue={co.every} onChange={change_meta('every')}>
                        <Option value="all">每周</Option>
                        <Option value="odd">单周</Option>
                        <Option value="even">双周</Option>
                    </Select>
                    <Select style={{width: '25%'}} defaultValue={co.weekday} onChange={change_meta('weekday')}>
                        <Option value={1}>周一</Option>
                        <Option value={2}>周二</Option>
                        <Option value={3}>周三</Option>
                        <Option value={4}>周四</Option>
                        <Option value={5}>周五</Option>
                        <Option value={6}>周六</Option>
                        <Option value={7}>周日</Option>
                    </Select>
                </InputGroup>
                <br />
                <InputGroup compact>
                    <Input style={{width: '25%'}} type="number" prefix="第" defaultValue={co.begin_time} suffix="~" onChange={change_meta('begin_time')} />
                    <Input style={{width: '25%'}} type="number" defaultValue={co.end_time} suffix="节" onChange={change_meta('end_time')} />
                    <Input style={{width: '50%'}} prefix="在" defaultValue={co.classroom} placeholder="教室" onChange={change_meta('classroom')} />
                </InputGroup>
                <br />
                <Button type="primary" block onClick={this.do_save.bind(this)} disabled={!this.state.changed}>
                    {!this.state.changed && <Icon type="check-circle" />}
                    保存
                </Button>
            </div>
        )
    }
}

export class Edit extends Component {
    constructor(props) {
        super(props);
    }

    delete_course_meta(idx) {
        return ()=>{
            console.log('delete',idx);
            let cos=this.props.courses.slice();
            cos.splice(idx,1);
            this.props.setCourses(cos);
        };
    }

    modify_course_meta(idx) {
        return (co)=>{
            console.log('modify',idx,co);
            let cos=this.props.courses.slice();
            cos[idx]=co;
            this.props.setCourses(cos);
        }
    }

    add_course() {
        let cos=this.props.courses.slice();
        cos.push({
            course_name: '自定义课程',
            begin_week: 1,
            end_week: 16,
            every: 'all',
            weekday: 1,
            begin_time: 1,
            end_time: 2,
            classroom: '',
        });
        this.props.setCourses(cos);
    }

    clear_courses() {
        if(window.confirm('清空所有课程？'))
            this.props.setCourses([]);
    }

    render() {
        let courses_with_key=this.props.courses.map((co,idx)=>Object.assign({},{key: idx},co));

        return (
            <div>
                <Affix offsetTop={0}>
                    <PageHeader
                        title="编辑课表"
                        backIcon={<Icon type="home" />}
                        onBack={()=>{this.props.navigate(ROUTES.homepage)}}
                        extra={
                            <Button type="primary" size="small" onClick={()=>{this.props.navigate(ROUTES.export_ics);}}>
                                生成日历
                            </Button>
                        }
                    />
                </Affix>
                <div className="main-margin">
                    <Table
                        dataSource={courses_with_key}
                        rowKey="key"
                        pagination={false}
                        scroll={{x: 500}}
                        size="small"
                        columns={[
                            {
                                title: '操作',
                                key: 'actions',
                                fixed: 'left',
                                width: 85,
                                align: 'center',
                                render: (_,co,idx)=>(
                                    <span>
                                        <Button type="danger" size="small" onClick={this.delete_course_meta(idx)}>
                                            <Icon type="delete" />
                                        </Button>
                                        &nbsp;
                                        <Popover
                                                key={`${this.props.courses.length},${idx}`} // refresh when courses are changed
                                                trigger="click"
                                                title="修改课程信息"
                                                content={<CourseChanger course={co} do_modify={this.modify_course_meta(idx)} />}
                                                placement="topLeft"
                                        >
                                            <Button size="small">
                                                <Icon type="form" />
                                            </Button>
                                        </Popover>
                                    </span>
                                )
                            },
                            {
                                title: '课程名称',
                                dataIndex: 'course_name',
                            },
                            {
                                title: '时间',
                                dataIndex: '',
                                key: 'time',
                                render: (_,co)=>describe_time(co),
                            },
                            {
                                title: '教室',
                                dataIndex: 'classroom',
                            },
                        ]}
                    />
                    <br />
                    <Button type="danger" onClick={this.clear_courses.bind(this)}>
                        <Icon type="delete" /> 清空
                    </Button>
                    &nbsp;
                    <Button onClick={this.add_course.bind(this)}>添加自定义课程</Button>
                </div>
            </div>
        )
    }
}