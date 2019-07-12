import React, {Component, PureComponent} from 'react';
import {Layout} from 'antd';
import {ROUTES, PAGE, RouteNotFound} from './routes';

import {HeaderComp} from './shared/Header';
import {FooterComp} from './shared/Footer';
import {SidebarComp} from './shared/Sidebar';

import './App.css';

const {Header, Content, Sider}=Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            route: ROUTES.homepage,
            courses: [],
        };
        this.navigate_bound=this.navigate.bind(this);
        this.set_courses_bound=this.set_courses.bind(this);
    }

    componentDidMount() {
        window.addEventListener('beforeunload', (e)=>{
            if(this.state.courses.length>0 && this.state.route!==ROUTES.export_ics) {
                e.preventDefault();
                e.returnValue='确定要退出吗？';
            }
        });
    }

    navigate(route) {
        this.setState({
            route: route,
        });
        window.scrollTo(0,0);
    }

    set_courses(co) {
        this.setState({
            courses: co,
        });
    }

    render() {
        let CurrentNode=PAGE[this.state.route]||RouteNotFound;

        return (
            <div>
                <HeaderComp />
                <Layout style={{background: 'transparent'}}>
                    <SidebarComp current_route={this.state.route} navigate={this.navigate_bound} courses={this.state.courses} />
                    <Content className="next-to-sider">
                        <CurrentNode navigate={this.navigate_bound} courses={this.state.courses} setCourses={this.set_courses_bound} />
                        <FooterComp />
                    </Content>
                </Layout>
            </div>
        )
    }
}

export default App;
