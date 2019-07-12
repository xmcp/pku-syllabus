import React, {Component, PureComponent} from 'react';
import {PageHeader, Button, Row, Col, Icon, Checkbox, List} from 'antd';
import {ROUTES} from '../routes';
import {describe_time} from '../utils';
import {CourseList} from './CourseList';

import './ImportElective.css';

import elective_instruction from './elective_instruction.jpg';

export class ImportElective extends Component {
    constructor(props) {
        super(props);
        this.state={
            courses: [],
            skipped_courses: [], // course_name
        };
        this.paster_ref=React.createRef();
    }

    clear_paster() {
        this.paster_ref.current.textContent='';
        this.do_load();
    }

    _do_load() {
        let dom=this.paster_ref.current;

        let table=dom.querySelector('.datagrid');
        if(!table)
            throw new Error('找不到选课结果列表，请确保选中了整个表格！');

        let co=Array.from(table.querySelectorAll('.datagrid-even, .datagrid-odd, .datagrid-all')).map((row)=>{
            let name=row.querySelector('td:nth-child(1)').textContent;

            let info_elem=row.querySelector('td:nth-child(8)');
            if(info_elem.querySelector('span'))
                info_elem=info_elem.querySelector('span');
            let infos=Array.from(info_elem.childNodes)
                .filter((node)=>node.nodeName.toLowerCase()==='#text')
                .map((node)=>node.textContent);

            let timepieces=[];
            infos.forEach((infostr)=>{
                let res=/^(\d+)~(\d+)周 (.)周周(.)(\d+)~(\d+)节\s*(.*)$/.exec(infostr);
                if(!res) {
                    console.log('ignoring infostr',infostr);
                    return;
                }

                //     "1",       "16",    "每",     "二",     "1",      "2",     "理教306"
                let [_,begin_week,end_week,every_str,week_str,begin_time,end_time,classroom]=res;

                timepieces.push({
                    course_name: name,
                    begin_week: parseInt(begin_week),
                    end_week: parseInt(end_week),
                    every: {'每': 'all', '单': 'odd', '双': 'even'}[every_str],
                    weekday: '啊一二三四五六日'.indexOf(week_str),
                    begin_time: parseInt(begin_time),
                    end_time: parseInt(end_time),
                    classroom: classroom,
                });
            });

            return timepieces;
        });

        this.setState({
            courses: [].concat.apply([],co),
            skipped_courses: [],
        });
    }

    do_load() {
        this.setState({
            courses: [],
            skipped_courses: [],
        },()=>{
            try {
                this._do_load();
            } catch(e) {
                console.trace(e);
            }
        });
    }

    toggle_course(name) {
        this.setState((prevState)=>{
            let skipped=prevState.skipped_courses.slice();

            if(skipped.indexOf(name)!==-1) // remove
                skipped=skipped.filter((n)=>n!==name);
            else // add
                skipped=skipped.concat([name]);

            return {
                skipped_courses: skipped,
            };
        });
    }

    do_import() {
        let imported_courses=this.state.courses.filter((co)=>this.state.skipped_courses.indexOf(co.course_name)===-1);
        this.props.setCourses(this.props.courses.concat(imported_courses));
        this.props.navigate(ROUTES.edit);
    }

    render() {
        return (
            <div>
                <PageHeader title="从选课系统导入课表" onBack={()=>{this.props.navigate(ROUTES.homepage);}} extra={
                    <Button onClick={()=>{this.props.navigate(ROUTES.edit);}}>
                        编辑器
                    </Button>
                } />
                <div className="main-margin">
                    <div className="elective-instruction">
                        <img src={elective_instruction} className="elective-instruction-img" />
                        <p>
                            请登录 <a href="http://elective.pku.edu.cn" target="_blank" rel="noopener noreferrer">选课系统</a>，
                            进入“选课结果”。
                        </p>
                        <br />
                        <p>请选中从 “<code>>>查看选课结果</code>” 到 “<code>注：</code>” 之间的内容，</p>
                        <p>确保选中<b>整个选课结果表格</b>（如右图），</p>
                        <p>然后复制粘贴到下面的文本框中。</p>
                    </div>
                    <br />
                    <p>
                        <Button type="danger" onClick={()=>{this.clear_paster();}}>
                            <Icon type="delete" /> 重置
                        </Button>
                        {this.state.courses.length>0 &&
                            <b>&nbsp; 识别成功！</b>
                        }
                    </p>
                    <div className="clearfix" />
                    <br />
                    <div className="elective-paster" ref={this.paster_ref} contentEditable onInput={this.do_load.bind(this)} />
                    <br />
                    {this.state.courses.length>0 &&
                        <CourseList
                            courses={this.state.courses}
                            skipped_courses={this.state.skipped_courses}
                            toggle_course={this.toggle_course.bind(this)}
                            do_import={this.do_import.bind(this)}
                        />
                    }
                </div>
            </div>
        );
    }
}