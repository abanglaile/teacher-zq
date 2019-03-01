import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout,Breadcrumb} from 'antd';
import *as action from '../Action/';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Zq_Header from './ZQ_Header.js';
import config from '../utils/Config';
import StuTaskRes from './stu_task_res.js'

const { Header, Footer, Sider, Content } = Layout;
var urlip = config.server_url;

class TaskResult extends React.Component {
	constructor(props){
		super(props);
		this.state = { 
			taskid : this.props.params.id,
		};
	}

	componentDidMount(){
	  const {taskid} = this.state;
	  if(taskid){
	  	this.props.getTaskInfoById(taskid);
	  }
    }
	
	render(){
		const {taskid} = this.state;
		const {sourcename} = this.props;
		console.log("sourcename",sourcename);
		if(sourcename){
			return(
				<Layout className="layout">
					<Header style={{background: '#fff',height:'80px'}}>
					<Zq_Header/>
					</Header>
					<Content style={{ padding: '0 120px' }}>
					<Breadcrumb style={{ margin: '12px 0' }} separator=">">
						<Breadcrumb.Item> 
							<Link to="/teacher-zq/root/task-manager">作业管理</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>{sourcename}</Breadcrumb.Item>
					</Breadcrumb>
					<div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <StuTaskRes taskid={taskid}/>
					</div>
					</Content>
					<Footer style={{ textAlign: 'center' }}>
					Ant Design ©2019 Created by Bourne
					</Footer>
				</Layout>
			);
		}else{
			return null;
		}
	}
}

export default connect(state => {
  const {task_info} = state.TasksData.toJS();	
//   console.log('TasksData:',JSON.stringify(state.TasksData));
  return {
	  sourcename : task_info.source_name,
  }
}, action)(TaskResult);


