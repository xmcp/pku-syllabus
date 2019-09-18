import React, {Component, PureComponent} from 'react';
import {PageHeader, Button, Icon, Affix, Checkbox} from 'antd';
import {ROUTES} from '../routes';
import {CourseList} from './CourseList';

import './ImportElective.css';

import elective_instruction from './elective_instruction.jpg';

export class ImportElective extends Component {
    constructor(props) {
        super(props);

        this.DESC_DISP_NAMES=['教师','班号','课程类别','学分'];
        this.DESC_KEY={teacher:'教师',classid:'班号',coursetype:'课程类别',credits:'学分'};

        this.state={
            courses: [],
            skipped_courses: [],
            desc_checked: ['教师','班号'],
        };
        this.paster_ref=React.createRef();
    }

    clear_paster() {
        if(this.paster_ref.current)
            this.paster_ref.current.textContent='';
        this.setState({
            courses: [],
            skipped_courses: [],
        })
    }

    _do_load(target) {
        let table=target.querySelector('.datagrid');
        if(!table)
            throw new Error('找不到选课结果列表，请确保选中了整个表格！');

        let skip_co=[];
        let co=Array.from(table.querySelectorAll('.datagrid-even, .datagrid-odd, .datagrid-all')).map((row,idx)=>{
            let name=row.querySelector('td:nth-child(1)').textContent;

            let info_elem=row.querySelector('td:nth-child(8)');
            if(info_elem.querySelector('span'))
                info_elem=info_elem.querySelector('span');
            let infos=Array.from(info_elem.childNodes)
                .filter((node)=>node.nodeName.toLowerCase()==='#text')
                .map((node)=>node.textContent);

            let status_elem=row.querySelector('td:nth-child(9)');
            let status=status_elem?status_elem.textContent:'?';

            if(status==='未选上')
                skip_co.push(idx);

            let desc_items=[];
            if(this.state.desc_checked.indexOf(this.DESC_KEY.teacher)!==-1)
                desc_items.push(row.querySelector('td:nth-child(5)').textContent.replace(/[,，、].+$/,'等').replace(/\(.+\)/,''));
            if(this.state.desc_checked.indexOf(this.DESC_KEY.classid)!==-1)
                desc_items.push(row.querySelector('td:nth-child(6)').textContent+'班');
            if(this.state.desc_checked.indexOf(this.DESC_KEY.coursetype)!==-1)
                desc_items.push(row.querySelector('td:nth-child(2)').textContent);
            if(this.state.desc_checked.indexOf(this.DESC_KEY.credits)!==-1)
                desc_items.push(row.querySelector('td:nth-child(3)').textContent.replace(/\.0$/,'')+'学分');

            let desc=desc_items.join('，');

            let timepieces=[];
            infos.forEach((infostr)=>{
                let res=/^(\d+)~(\d+)周 (.)周周(.)(\d+)~(\d+)节\s*(.*)$/.exec(infostr);
                if(!res) {
                    //console.log('ignoring infostr',infostr);
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
                    desc: desc,
                    _skip_idx: idx,
                });
            });

            return timepieces;
        });

        co=[].concat.apply([],co);
        if(co.length>0)
            this.setState({
                courses: co,
                skipped_courses: skip_co,
            });
    }

    do_load(e) {
        if(e)
            e.persist();
        this.setState({
            courses: [],
            skipped_courses: [],
        },()=>{
            try {
                this._do_load(this.paster_ref.current);
            } catch(error) {
                console.trace(error);
            }
        });
    }

    on_desc_change(li) {
        this.setState({
            desc_checked: li,
        },()=>{
            this.do_load();
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
        let imported_courses=this.state.courses
            .filter((co)=>this.state.skipped_courses.indexOf(co._skip_idx)===-1)
            .map((co)=>{
                let {_skip_idx, ...other}=co;
                return other;
            });
        this.props.setCourses(this.props.courses.concat(imported_courses));
        this.props.navigate(ROUTES.edit);
    }

    render() {
        let loaded=this.state.courses.length>0;
        return (
            <div>
                <Affix offsetTop={0}>
                    <PageHeader title="从选课系统导入课表" onBack={()=>{this.props.navigate(ROUTES.homepage);}} extra={
                        this.props.courses.length>0 && <Button size="small" onClick={()=>{this.props.navigate(ROUTES.edit);}}>
                            编辑器
                        </Button>
                    } />
                </Affix>
                <div className="main-margin">
                    <div className="elective-instruction">
                        <img src={elective_instruction} className="elective-instruction-img" />
                        <p>请您在选课系统中……</p>
                        <ol>
                            <li>点击“查看选课结果”</li>
                            <li>复制整个选课结果表格，如右图</li>
                            <li>粘贴到下面</li>
                        </ol>
                    </div>
                    <br />
                    <p>
                        <Button type="danger" onClick={()=>{this.clear_paster();}}>
                            <Icon type="delete" /> 重置
                        </Button>
                        &nbsp;&nbsp;
                        {loaded ?
                            <b>识别成功！</b> :
                            <Button type="primary" onClick={()=>{window.open('http://elective.pku.edu.cn')}}>
                                <Icon type="block" /> 打开选课系统
                            </Button>
                        }
                    </p>
                    <div className="clearfix" />
                    <br />
                    <div className="elective-paster elective-paster-main" ref={this.paster_ref} onInput={this.do_load.bind(this)}
                         style={{display: loaded ? 'none' : 'block'}} contentEditable={!loaded}
                    />
                    {loaded ?
                        <div>
                            <div>
                                备注：
                                <Checkbox.Group
                                    options={this.DESC_DISP_NAMES}
                                    value={this.state.desc_checked}
                                    onChange={this.on_desc_change.bind(this)}
                                />
                            </div>
                            <br />
                            <CourseList
                                courses={this.state.courses}
                                skipped_courses={this.state.skipped_courses}
                                toggle_course={this.toggle_course.bind(this)}
                                do_import={this.do_import.bind(this)}
                            />
                        </div> :
                        <div className="not-imported-tip">正确粘贴后将自动识别</div>
                    }
                </div>
            </div>
        );
    }
}