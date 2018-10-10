import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon,Tabs,Breadcrumb} from 'antd';
import Styles from '../styles/stu_capacity.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Zq_Header from './ZQ_Header.js';
import config from '../utils/Config';
import OverallAbility from './overall_ability.js';
import RecentKp from './recent_kp.js';
import KpAbility from './kp_ability.js';

const { Header, Footer, Sider, Content } = Layout;
var urlip = config.server_url;

const TabPane = Tabs.TabPane;

class StuCapacity extends React.Component {
	constructor(props){
		super(props);
		this.state = { activeKey : '1',
			student_id : this.props.params.id,
		};
	}

	componentDidMount(){
      const {student_id} = this.state;
			if(student_id){
				this.props.getStuInfoById(student_id);
			}
			
    }

	onTabChange(key){
		this.setState({activeKey : key});
	}

	render(){
		const {activeKey,student_id} =this.state;
		const {student_name,group_name} = this.props;
		console.log("student_name",student_name);
		if(student_name){
			return(
				<Layout className="layout">
						<Header style={{background: '#fff',height:'80px'}}>
						<Zq_Header/>
						</Header>
						<Content style={{ padding: '0 250px' }}>
							<Breadcrumb style={{ margin: '12px 0' }} separator=">">
								<Breadcrumb.Item><Link to="/teacher-zq/stu_manager">{group_name}</Link></Breadcrumb.Item>
								<Breadcrumb.Item>{student_name}</Breadcrumb.Item>
							</Breadcrumb>
							<div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
						<Tabs onChange={(key)=>this.onTabChange(key)} activeKey={activeKey}>
								<TabPane tab="综合能力" key="1"><OverallAbility student_id={student_id}/></TabPane>
								<TabPane tab="近期表现" key="2"><RecentKp student_id={student_id}/></TabPane>
								<TabPane tab="知识点能力" key="3"><KpAbility student_id={student_id}/></TabPane>
							</Tabs>
							</div>
						</Content>
						<Footer style={{ textAlign: 'center' }}>
							Ant Design ©2017 Created by Bourne
						</Footer>
				</Layout>
			);
		}else{
			return null;
		}
	}
}

export default connect(state => {
	const student_data = state.studentData.toJS();
  const {student_info} = student_data;	
  return {
	  student_name : student_info ? student_info.realname : null,
	  group_name : student_info ? student_info.group_name : null,
  }
}, action)(StuCapacity);



