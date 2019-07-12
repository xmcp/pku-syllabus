import React, {Component, PureComponent} from 'react';
import {List, Checkbox, Button, Icon} from 'antd';
import {describe_time} from '../utils';

export function CourseList(props) {
    return (
        <List
            bordered
            dataSource={props.courses}
            renderItem={(co)=>(
                <List.Item><Checkbox
                    checked={props.skipped_courses.indexOf(co.course_name)===-1}
                    onChange={()=>{props.toggle_course(co.course_name);}}
                >
                    {co.course_name} （{describe_time(co)} {co.classroom}）
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
