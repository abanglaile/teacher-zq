import React from 'react';
import ReactDOM from 'react-dom';
import {Row, Col} from 'antd';
import { Layout, Icon, Menu, Button ,Checkbox, ConfigProvider} from 'antd';
import Styles from '../styles/testCenter.css';
import {connect} from 'react-redux';
import *as action from '../Action/';
import Zq_Header from './ZQ_Header.js';
import { relative } from 'path';
import zhTW from 'antd/es/locale/zh_TW';
import enUS from 'antd/es/locale/en_US';
// import {ConfigProvider} from 'antd'

const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

class App extends React.Component{
    
    componentDidMount () {
        // this.fetchData();
        console.log("statusText:"+this.props.statusText);
        console.log("username:"+this.props.username);
    }

    handleclick(e){
      console.log(e);
      console.log("i am sub2");
      
    }

    render(){
      return(
        // <ConfigProvider locale={zhTW}>
        <div>
            <Layout>
                <Header style={{background: '#fff',height:'80px'}}>
                  <Zq_Header/>  
                </Header>
                {/* <Content style={{ padding: '0 5px' }}> */}
                <Content>
                  <div style={{ margin: '5px 0'}}></div>
                  <Layout style={{ padding: '24px 0', background: '#fff'}}>
                    <Sider 
                      width={200} 
                      style={{ background: '#fff' }}
                      breakpoint="lg"
                      collapsedWidth="0"
                      onBreakpoint={(broken) => { console.log("broken:",broken); }}
                      onCollapse={(collapsed, type) => { console.log("collapsed, type:",collapsed, type); }}
                    >
                      <Menu
                        mode="inline"
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%' }}
                      >
                        <Menu.Item key="sub1">
                          <div onClick={() => this.props.router.push("/teacher-zq/root/stu_manager")}
                          >
                            学生管理
                          </div>
                        </Menu.Item>
                        <Menu.Item key="sub2">
                          <div onClick={() => this.props.router.push("/teacher-zq/root/classhour_manager")}
                          >
                            课时管理
                          </div>
                        </Menu.Item>
                        <Menu.Item key="sub3">
                          <div onClick={() => this.props.router.push("/teacher-zq/root/class_manager")}
                          >
                            班组管理
                          </div>
                        </Menu.Item>
                        <Menu.Item key="sub4">
                          <div onClick={() => this.props.router.push("/teacher-zq/root/testcenter")}
                          >
                            测试中心
                          </div>
                        </Menu.Item>
                        <Menu.Item key="sub5">
                          <div onClick={() => this.props.router.push("/teacher-zq/root/lesson-manager")}
                          >
                            课堂管理
                          </div>
                        </Menu.Item>
                        <Menu.Item key="sub6">
                          <div onClick={() => this.props.router.push("/teacher-zq/root/task-manager")}
                          >
                            任务管理
                          </div>
                        </Menu.Item>
                        <Menu.Item key="sub7">
                          <div onClick={() => this.props.router.push("/teacher-zq/root/path-manager")}
                          >
                            路径管理
                          </div>
                        </Menu.Item>
                      </Menu>
                    </Sider>
                    <Content style={{ padding: '0 24px', minHeight: 350 }}>
                      {this.props.children}
                    </Content>
                  </Layout>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                  Ant Design ©2017 Created by Bourne
                </Footer>
            </Layout>
        </div> 
        // </ConfigProvider>
      );
    }
} 

export default connect(state => {
  return {
    statusText: state.AuthData.get('statusText'),
    username: state.AuthData.get('username')
  }
}, action)(App);