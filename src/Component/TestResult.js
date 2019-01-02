import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout,Tabs,Breadcrumb} from 'antd';
import Styles from '../styles/TestResult.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Zq_Header from './ZQ_Header.js';
import config from '../utils/Config';
import StudentRes from './student_res.js'
import KpResult from './kp_result.js'
import ExerciseDetail from './exercise_detail.js'

const { Header, Footer, Sider, Content } = Layout;
var urlip = config.server_url;
const TabPane = Tabs.TabPane;

class TestResult extends React.Component {
	constructor(props){
		super(props);
		// console.log("testid 0",this.props.params.id);
		this.state = { 
			activeKey : '1', 
			testid : this.props.params.id,
		};
		// console.log("testid 1",this.state.testid);
	}

	componentDidMount(){
	  const {testid} = this.state;
	  console.log("testid 2",testid);
	  if(testid){
	  	this.props.getTestInfoById(testid);
	  }
    }
	
	onTabChange(key){
		this.setState({activeKey : key});
	}
	
	render(){
		const {activeKey, testid} = this.state;
		const {teststate, testname} = this.props;
		console.log("testname",teststate);
		console.log("testid 3",testid);
		if(testname){
			var tabDom = (
				teststate ?
				<Tabs onChange={(key)=>this.onTabChange(key)} activeKey={activeKey}>
					<TabPane tab="测试结果" key="1"><StudentRes testid={testid}/></TabPane>
					<TabPane tab="知识点" key="2">
						<div>
							<h2 className="tab2_title">知识点正确率</h2>
							<KpResult testid={testid}/>
						</div>	
					</TabPane>
					<TabPane tab="试题详情" key="3"><ExerciseDetail isdeliverd={teststate} testid={testid}/></TabPane>
				</Tabs>
				:
				<Tabs onChange={(key)=>this.onTabChange(key)} activeKey={activeKey}>
					<TabPane tab="试题详情" key="1"><ExerciseDetail isdeliverd={teststate} testid={testid}/></TabPane>
				</Tabs>
			)
			return(
				<Layout className="layout">
					<Header style={{background: '#fff',height:'80px'}}>
					<Zq_Header/>
					</Header>
					<Content style={{ padding: '0 120px' }}>
					<Breadcrumb style={{ margin: '12px 0' }} separator=">">
						<Breadcrumb.Item> 
							<Link to="/teacher-zq/root">测试中心</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>{testname}</Breadcrumb.Item>
					</Breadcrumb>
					<div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
						{tabDom}
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
  const tests_data = state.fetchTestsData.toJS();
//   console.log("tests_data",tests_data);
  const {test_info} = tests_data;	
  return {
	  teststate : test_info ? test_info.teststate : 0,
	  testname : test_info ? test_info.testname : null,
  }
}, action)(TestResult);


