import React, {Component, PureComponent} from 'react';
import {ROUTES} from '../routes';
import {Affix, PageHeader, Button, Upload, Icon} from 'antd';
import {CourseList} from './CourseList';
import {DATA_VER, SEMESTER} from '../config';

const {Dragger}=Upload;

export class ImportConfig extends Component {
    constructor(props) {
        super(props);
        this.state={
            courses: [],
            skipped_courses: [],
        }
    }

    _do_load(e) {
        return new Promise((resolve,reject)=>{
            let fr=new FileReader();
            fr.onload=()=>{
                let lines=[''];
                fr.result.replace(/\r/g,'').split('\n').forEach((l)=>{
                    if(l.charAt(0)===' ') // continue last line
                        lines[lines.length-1]+=l.substr(1);
                    else // new line
                        lines.push(l);
                });
                for(let l of lines)
                    if(l.startsWith('X-WR-CALDESC:')) {
                        console.log('matched line',l);
                        let json=JSON.parse(l.substr(13));

                        if(json.data_ver!==DATA_VER) {
                            alert(`数据版本不匹配：文件版本 ${json.data_ver}，程序支持的版本 ${DATA_VER}`);
                            reject();
                            return;
                        }

                        if(json.semester_id!==SEMESTER.id) {
                            alert(`学期名称不匹配：文件学期 ${json.semester_id}，当前学期 ${SEMESTER.id}`);
                            reject();
                            return;
                        }

                        resolve(json.courses);
                        return;
                    }

                alert('找不到配置信息');
                console.log('no matched lines',lines);
                reject();
            };
            fr.onerror=reject;
            fr.onabort=reject;
            fr.readAsText(e.file);
        });
    }

    do_load(e) {
        this.setState({
            courses: [],
            skipped_courses: [],
        },()=>{
            this._do_load(e)
                .then((res)=>{
                    this.setState({
                        courses: res.map((co,idx)=>Object.assign({},co,{
                            _skip_idx: idx,
                        })),
                        skipped_courses: [],
                    });
                    e.onSuccess();
                })
                .catch((error)=>{
                    console.trace(error);
                    e.onError(error);
                });
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
        return (
            <div>
                <Affix offsetTop={0}>
                    <PageHeader title="加载日历文件" onBack={()=>{this.props.navigate(ROUTES.homepage);}} extra={
                        this.props.courses.length>0 && <Button size="small" onClick={()=>{this.props.navigate(ROUTES.edit);}}>
                            编辑器
                        </Button>
                    } />
                </Affix>
                <div className="main-margin">
                    <Dragger
                            accept=".ics"
                            customRequest={this.do_load.bind(this)}
                            showUploadList={false}
                    >
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">点击加载或拖拽到这里</p>
                        <p className="ant-upload-hint">
                            选择之前生成的日历文件以导入数据
                        </p>
                    </Dragger>
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
        )
    }
}