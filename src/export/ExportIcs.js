import React, {Component, PureComponent} from 'react';
import {PageHeader, Button, Input, Icon, Affix, Alert} from 'antd';
import ical from 'ical-generator';
import {SEMESTER, DATA_VER} from '../config';
import {ROUTES} from '../routes';

import './ExportIcs.css';

const MIN=60*1000; // ms
const HOUR=60*MIN;
const DAY=24*HOUR;
const WEEK=7*DAY;

const CO_BEGIN_TIME=[
    0,

    8*HOUR + 0*MIN,
    9*HOUR + 0*MIN,
    10*HOUR + 10*MIN,
    11*HOUR + 10*MIN,

    13*HOUR + 0*MIN,
    14*HOUR + 0*MIN,
    15*HOUR + 10*MIN,
    16*HOUR + 10*MIN,
    17*HOUR + 10*MIN,

    18*HOUR + 40*MIN,
    19*HOUR + 40*MIN,
    20*HOUR + 40*MIN,
];

const CO_END_TIME=[
    0,

    8*HOUR + 50*MIN,
    9*HOUR + 50*MIN,
    11*HOUR + 0*MIN,
    12*HOUR + 0*MIN,

    13*HOUR + 50*MIN,
    14*HOUR + 50*MIN,
    16*HOUR + 0*MIN,
    17*HOUR + 0*MIN,
    18*HOUR + 0*MIN,

    19*HOUR + 30*MIN,
    20*HOUR + 30*MIN,
    21*HOUR + 30*MIN,
];

const ICAL_WEEKDAY=['','MO','TU','WE','TH','FR','SA','SU'];

function then(date,delta_ms) {
    return new Date(+date+delta_ms);
}

function get_week_start(wk) {
    let t=SEMESTER.begin_date;
    t=then(t,WEEK*(wk-1));
    return t;
}

function get_first_date(co) {
    let t=get_week_start(co.begin_week);
    t=then(t,DAY*(co.weekday-1));
    if(
        (co.every==='odd' && co.begin_week%2===0) ||
        (co.every==='even' && co.begin_week%2===1)
    ) // start since next week
        t=then(t,WEEK);
    return t;
}

export class ExportIcs extends Component {
    constructor(props) {
        super(props);
        this.state={
            alarm: 30,
        };
    }

    on_change_alarm(e) {
        let v=parseInt(e.target.value);
        if(v<=0) v=0;
        this.setState({
            alarm: v,
        });
    }

    gen_cal() {
        const cal = ical({
            domain: 'pkuhelper.pku.edu.cn',
            prodId: {company: 'superman-industries.com', product: 'ical-generator'},
            name: '课表',
            timezone: 'Asia/Shanghai',
            description: JSON.stringify({
                data_ver: DATA_VER,
                semester_id: SEMESTER.id,
                courses: this.props.courses,
            }),
        });

        this.props.courses.forEach((co)=>{
            let first_date=get_first_date(co);

            let evt=cal.createEvent({
                start: then(first_date,CO_BEGIN_TIME[co.begin_time]),
                end: then(first_date,CO_END_TIME[co.end_time]),
                summary: co.course_name,
                location: co.classroom,
                description: co.desc,
            });
            if(this.state.alarm) {
                evt.createAlarm({
                    type: 'display',
                    trigger: this.state.alarm*60,
                })
            }
            evt.repeating({
                freq: 'WEEKLY',
                interval: co.every==='all' ? 1 : 2,
                until: then(get_week_start(co.end_week+1),-1),
                byDay: ICAL_WEEKDAY[co.weekday],
                exclude: SEMESTER.exclude_dates.map((d)=>new Date(+d+8*HOUR)),
                excludeTimezone: 'Asia/Shanghai' // timezone of exclude
            });
        });

        return cal.toURL();
    }

    render() {
        function format_date(d) {
            return `${d.getMonth()+1}月${d.getDate()}日`
        }

        return (
            <div>
                <Affix offsetTop={0}>
                    <PageHeader title="生成 iCalendar 日历" onBack={()=>{this.props.navigate(ROUTES.edit);}} />
                </Affix>
                <div className="main-margin">
                    <Alert
                        type="info"
                        message={"当前学期："+SEMESTER.name}
                        description={"第一周开始于 "+format_date(SEMESTER.begin_date)}
                    />
                    <br />
                    <p><Input type="number" addonBefore="提醒：上课前" placeholder="（不提醒）" addonAfter="分钟"
                           allowClear value={this.state.alarm||''} onChange={this.on_change_alarm.bind(this)}
                    /></p>
                    <br />
                    <Button block type="primary" size="large" href={this.gen_cal()} disabled={this.props.courses.length===0}>
                        <Icon type="download" /> 保存日历
                    </Button>
                    <br /><br />
                    <div className="hint-text">
                        <p>
                            生成的 iCalendar (.ICS) 文件属于通用日历格式，
                            可直接导入到 Windows 10 日历 / macOS 日历 / iOS 日历 / Outlook / Google Calendar 等程序中。
                        </p>
                        <p>
                            部分 Android 系统支持该格式，请自行搜索你的系统如何导入日历。
                        </p>
                        <p>
                            若无法保存，建议使用最新版（Windows、Android 系统的）<b>Chrome</b> 或（macOS、iOS 系统的）<b>Safari</b> 浏览器访问。
                            不要使用微信等软件的内嵌浏览器。
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}