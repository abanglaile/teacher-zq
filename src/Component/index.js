import React from 'react';
import ReactDOM from 'react-dom';
import {Row, Col} from 'antd';
import { Layout, Icon, Menu, Button ,Checkbox} from 'antd';
import Styles from '../styles/testCenter.css';
import {connect} from 'react-redux';
import *as action from '../Action/';
import Zq_Header from './ZQ_Header.js';
import { relative } from 'path';

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
        <div>
            <Layout>
                <Header style={{background: '#fff',height:'80px'}}>
                  <Zq_Header/>  
                </Header>
                {/* <Content style={{ padding: '0 5px' }}> */}
                <Content>
                  <div style={{ margin: '5px 0'}}></div>
                  <Layout style={{ padding: '24px 0', background: '#fff'}}>
                    <Sider width={200} style={{ background: '#fff' }}>
                      <Menu
                        mode="inline"
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%' }}
                      >
                        <Menu.Item key="sub1"><span><Icon type="bell" />动态</span></Menu.Item>
                        <Menu.Item key="sub2">
                          <div onClick={() => this.props.router.push("/teacher-zq/root/stu_manager")}
                          >
                            学生管理
                          </div>
                        </Menu.Item>
                        <Menu.Item key="sub3">
                          <div onClick={() => this.props.router.push("/teacher-zq/root/testcenter")}
                          >
                            测试中心
                          </div>
                        </Menu.Item>
                        <Menu.Item key="sub4">
                          <div onClick={() => this.props.router.push("/teacher-zq/root/lesson-manager")}
                          >
                            课堂管理
                          </div>
                        </Menu.Item>
                        <Menu.Item key="sub5">
                          <div onClick={() => this.props.router.push("/teacher-zq/root/task-manager")}
                          >
                            作业管理
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
      );
    }
} 

export default connect(state => {
  return {
    statusText: state.AuthData.get('statusText'),
    username: state.AuthData.get('username')
  }
}, action)(App);