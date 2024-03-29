import React, {Component, PureComponent} from 'react';
import {EnvironmentOutlined, ImportOutlined} from '@ant-design/icons';
import {List, Checkbox, Button, Tag} from 'antd';
import {describe_time} from '../utils';

export function CourseList(props) {
    let import_btn=(
        <Button type="primary" size="large" block onClick={props.do_import}>
            <ImportOutlined /> 导入所选课程
        </Button>
    );

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
                    {!!co.classroom &&
                        <Tag color="geekblue"><EnvironmentOutlined /> {co.classroom}</Tag>
                    }
                    {!!co.desc &&
                        <Tag>{co.desc}</Tag>
                    }
                </Checkbox></List.Item>
            )}
            header={import_btn}
            footer={import_btn}
        >
        </List>
    );
}
