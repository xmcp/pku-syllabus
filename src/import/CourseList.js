import React, {Component, PureComponent} from 'react';
import {List, Checkbox, Button, Icon, Tag} from 'antd';
import {describe_time} from '../utils';

export function CourseList(props) {
    return (
        <List
            bordered
            size="small"
            dataSource={props.courses}
            renderItem={(co)=>(
                <List.Item><Checkbox
                    checked={props.skipped_courses.indexOf(co._skip_idx)===-1}
                    onChange={()=>{props.toggle_course(co._skip_idx);}}
                >
                    <b>{co.course_name}</b> &nbsp;
                    <Tag color="blue">{describe_time(co)}</Tag>
                    <Tag color="geekblue"><Icon type="environment" /> {co.classroom}</Tag>
                    {!!co.desc &&
                        <Tag>{co.desc}</Tag>
                    }
                </Checkbox></List.Item>
            )}
            header={
                    <Button type="primary" size="large" block onClick={props.do_import}>
                        <Icon type="import" /> 导入所选课程
                    </Button>
            }
        >
        </List>
    )
}
