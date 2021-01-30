import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Col, Row, Layout, Breadcrumb, Icon, Divider, Button, Steps } from 'antd';
import { Link } from 'react-router';
import *as action from '../Action/';
import { connect } from 'react-redux';
import Zq_Header from './ZQ_Header';
const { Header, Footer, Content } = Layout;
const { Step } = Steps;

const path_ch = [{	
					chapater_index : 0,
					path_chapater_id : 0,
					path_chapter_name : '二次根式',
				},{	
					chapater_index : 1,
					path_chapater_id : 1,
					path_chapter_name : '勾股定理',	
				},{
					chapater_index : 2,
					path_chapater_id : 2,
					path_chapter_name : '平行四边形',	
				},{
					chapater_index : 3,
					path_chapater_id : 3,
					path_chapter_name : '一次函数',	
				},{
					chapater_index : 4,
					path_chapater_id : 4,
					path_chapter_name : '数据分析',	
				}];
const currnet_chapter_index = 2;

class StuPath extends React.Component {
	constructor(props) {
		super(props);
        this.state={
            current_ch_id : 0,
        };
    }

	componentWillMount() {
		let { query } = this.props.location;
		// this.props.getMyTestData(query.student_id,query.path_id);
	}

	onChapterChange(current){
		this.setState({current_ch_id : current});
	}

	renderPath(){
		const { current_ch_id } = this.state;
		const step_option = path_ch.map((item) =>  
			<Step title={item.path_chapter_name} 
				// status={
				// 	item.chapater_index < currnet_chapter_index ? 'finish' :
				// 	item.chapater_index === currnet_chapter_index ?
				// 	'process' : 'wait'
				// } 
			/>
        )
		return (
			<div>
			  <Steps current={current_ch_id} 
				  labelPlacement="vertical"
				//   progressDot 
			  	onChange={current => this.onChapterChange(current)}>
				{step_option}
			  </Steps>
			  <Divider />
			</div>
		  );
	}


	render() {
		const { survey_data, isFetching } = this.props;
		const { test_log } = survey_data;
		return (
			<Layout className="layout">
				<Header className='noprint' style={{ background: '#fff', height: '80px' }}>
					<Zq_Header />
				</Header>
				{/* <div className="header">冠名机构</div> */}
				<Content style={{ padding: '0 120px' }}>
					<div className="print">
						<Breadcrumb style={{ margin: '12px 0' }} separator=">">
							{/* <Breadcrumb.Item><Link to="/teacher-zq/root/testcenter">路径管理</Link></Breadcrumb.Item> */}
							<Breadcrumb.Item>路径管理</Breadcrumb.Item>
							{/* <Breadcrumb.Item><Link to={"/teacher-zq/testresult/" + this.props.location.query.test_id}>{test_log.test_name}</Link></Breadcrumb.Item> */}
							<Breadcrumb.Item>数学八年级下册</Breadcrumb.Item>
							{/* <Breadcrumb.Item>{survey_data.student_name}</Breadcrumb.Item> */}
							<Breadcrumb.Item>李承耀</Breadcrumb.Item>
						</Breadcrumb>
						<div style={{ background: '#fff', padding: 24, minHeight: 560 }}>
							<div style={{ padding: 24 }}>
								{this.renderPath()}
							</div>
						</div>
					</div>
				</Content>
				<Footer className='noprint' style={{ textAlign: 'center' }}>
					Ant Design ©2017 Created by Bourne
				</Footer>
			</Layout>
		)
	}
}
export default connect(state => {
	// const stuMyTestData = state.fetchTestsData.toJS();
	const { isFetching, eval_data, survey_data } = state.stuEvaluationData.toJS();
	return {
		isFetching: isFetching,
		eval_data: eval_data,
		survey_data: survey_data,

	}
}, action)(StuPath)