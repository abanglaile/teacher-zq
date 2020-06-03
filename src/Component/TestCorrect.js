import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout,Tabs,Breadcrumb,Checkbox,Row,Col,Button,Modal} from 'antd';
import Styles from '../styles/TestResult.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Zq_Header from './ZQ_Header.js';
import config from '../utils/Config';
import KpResult from './kp_result.js'
import ExerciseDetail from './exercise_detail.js'
import Tex from './renderer.js';

const { Header, Footer, Sider, Content } = Layout;
var urlip = config.server_url;
const TabPane = Tabs.TabPane;

class OneUncheckedExer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
        	title_img_width: "auto",
			title_img_height: "auto",
			checked_kp : [],
			answer_img_width: "auto",
			answer_img_height: "8rem",
			isShow : false,
	    };
	}
	titleImageLoaded(){
		console.log("title_img.width,window.innerWidth:",this.title_img.width, window.innerWidth);
		if(this.title_img.width > window.innerWidth){
			this.setState({title_img_width: "90%", title_img_height: "auto"})
		}
	}
	isChecked(kpid){
		const { checked_kp } = this.state;
		if(checked_kp.indexOf(kpid) >= 0){
			return true;
		}else{
			return false;
		}
	}
	handleSubmit(){
		var {logid,student_id,testid,exercise_id,breakdown,old_exercise_rating} = this.props.exer_data;
		const { checked_kp } = this.state;
		var exercise_state = 0;
		console.log("checked_kp:",checked_kp);
		if(checked_kp.length == breakdown.length){
			exercise_state = 1;
		}
		var exercise_log = {
			logid: logid,
			student_id: student_id,
			test_id: testid,
			exercise_id: exercise_id,
			old_exercise_rating: old_exercise_rating,
			exercise_state: exercise_state,
		};
		var breakdown_log = [];
		for(let i=0; i<breakdown.length;i++){
			breakdown_log.push({
				logid: logid,
				student_id: student_id,
				test_id: testid,
				exercise_id: exercise_id,
				sn: breakdown[i].sn,
				sn_state: this.isChecked(breakdown[i].kpid)? 1 : 0,
				kpid: breakdown[i].kpid,
				kpname: breakdown[i].kpname,
				sn_old_rating: breakdown[i].sn_old_rating,
			});
		}
		console.log("exercise_log:",JSON.stringify(exercise_log));
		console.log("breakdown_log:",JSON.stringify(breakdown_log));
		this.props.onSubmitAnswer(testid,exercise_log,breakdown_log);
		this.setState({checked_kp : []});
	}

	onbreakdownSelectChange(checkedValues){
		console.log('checked = ', checkedValues);
		this.setState({checked_kp : checkedValues});
	}

	showBigImage(){
		this.setState({isShow : true});
	}

	handleCancel(){
		this.setState({isShow : false});
	}

	render(){
		const {title_img_width, title_img_height,answer_img_width,answer_img_height,checked_kp, isShow} = this.state;
		if(this.props.exer_data){
			var {realname,exercise_id,exercise_type,submit_time,submit_answer,title,answer,title_img_url,title_audio_url,answer_assist_url,breakdown} = this.props.exer_data;
			// console.log("title_audio_url:",title_audio_url);
			console.log("submit_answer:",JSON.stringify(submit_answer));
			var answerDom = [];
			if(answer){
				answerDom = (  //解答题答案
					<div>
						<p style={{marginBottom:'0.5rem',marginTop:'0.5rem'}}>参考答案：&nbsp;</p>
						<div style={{margin:'0 0 10px 0',borderRadius:'5px',border: '1.5px solid #95de64',padding:'8px'}}>
							{answer.map((item, i) => {
								return(
									<div>
										<Tex className="step_content" content={item.value}/>
									</div>
								);
							})}
							<div>
								{answer_assist_url && answer_assist_url.indexOf('cdn') > 0 ?
									<div className="step_frame">
										<img src={answer_assist_url} style={{height:"8rem"}}/>
									</div>:
									null
								}
							</div>
						</div>
					</div>
				);
			}

			var submitAnswerDom = [];
			if(submit_answer){
				submitAnswerDom = (
					<div>
						<p style={{marginBottom:'0.5rem',marginTop:'0.5rem'}}>{realname}的解答：</p>
						<div style={{margin:'0 0 10px 0',borderRadius:'5px',border: '1.5px solid #ffc069',padding:'10px'}}>
							{ exercise_type == 3 ?
								<div>
									<div onClick={()=>this.showBigImage()}>
										<img src={submit_answer.url}
											style={{width: answer_img_width, height: answer_img_height}}
										/>
									</div>
									<div>
										<Modal
											onCancel={() => this.handleCancel()}
											visible={isShow}
											width="700px"
											footer={null}
											bodyStyle={{textAlign:'center'}}
										>
											<img src={submit_answer.url} style={{maxWidth:"100%"}} alt="" />
										</Modal>
									</div>
								</div>
								:
								<div>
									<audio src={submit_answer.url} type="audio/mpeg" controls="controls">
									{/* <audio src={"http://cdn.zhiqiu.pro/FoJn2OL0q9oiq2qZRfLItVm-zCDK"}  controls="controls"> */}
										Your browser does not support the audio element.
									</audio>
								</div>
							}
						</div>
					</div>
				);
			}
			var stepsDom = (
				<div style={{margin:'0 10px 10px 10px',paddingBottom:'5px'}}>
					<Checkbox.Group style={{ width: '100%' }} 
						onChange={(e) => this.onbreakdownSelectChange(e)}
						value={checked_kp}
					>
						{breakdown.map((item, i) => {
							return(
								<Row type="flex" justify="start" >
									<Col span={1}>
										<p><Checkbox value={item.kpid}></Checkbox></p>
									</Col>
									<Col span={18}>
										<Tex content={item.content}/>
										<div><a>{item.kpname}</a></div> 
									</Col>
								</Row>
							);
						})}
					</Checkbox.Group>
				</div>
			);
        	return(
				<div className="exercise_frame">
					<div className="exercise_id_div">{exercise_id}</div>
					<div style={{margin: '10px'}} >
						<Tex content={title}/>
						<div>
							{
								title_img_url? 
								<div>
									<img src={title_img_url}
										ref={element => {this.title_img = element;}}
										onLoad = {() => this.titleImageLoaded()} 
										style={{width: title_img_width, height: title_img_height}}
									/>
								</div> 
								:
								null
							}
						</div>
						<div>
							{
								title_audio_url? 
								<div>
									<audio src={title_audio_url} controls="controls">
					                    Your browser does not support the audio element.
					                </audio>
								</div> 
								:
								null
							}
						</div>
						{answerDom}
						{submitAnswerDom}
					</div>
					<div className="kp_step">
						<p style={{margin:'5px 0 3px 10px',paddingTop:'5px',fontSize:'14px'}}>分解：</p>
						<div>
							{stepsDom}
						</div>
					</div>
					<div style={{margin:'10px',float:'right',fontSize:'16px'}}>
						<Button type="primary" onClick={()=>this.handleSubmit()}>提交批改</Button>
					</div>
				</div>
			);
		}
	}
}

class OneCheckedExer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
        	title_img_width: "auto",
			title_img_height: "auto",
			checked_kp : [],
			answer_img_width: "auto",
			answer_img_height: "8rem",
			isShow : false,
	    };
	}
	titleImageLoaded(){
		console.log(this.title_img.width, window.innerWidth);
		if(this.title_img.width > window.innerWidth){
			this.setState({title_img_width: "90%", title_img_height: "auto"})
		}
	}

	showBigImage(){
		this.setState({isShow : true});
	}

	handleCancel(){
		this.setState({isShow : false});
	}
	render(){
		const {title_img_width, title_img_height, isShow, answer_img_width, answer_img_height} = this.state;
		if(this.props.exer_data){
			var {realname,exercise_id,exercise_type,exercise_state,submit_time,submit_answer,title,answer,title_img_url,title_audio_url,answer_assist_url,breakdown} = this.props.exer_data;
			var answerDom = [];
			if(answer){
				// console.log('answer = ', answer);
				answerDom = (  //解答题答案
					<div>
						<p style={{marginBottom:'0.5rem',marginTop:'0.5rem'}}>参考答案：&nbsp;</p>
						<div style={{margin:'0 0 10px 0',borderRadius:'5px',border: '1.5px solid #95de64',padding:'8px'}}>
							{answer.map((item, i) => {
								return(
									<div>
										<Tex className="step_content" content={item.value}/>
									</div>
								);
							})}
							<div>
								{answer_assist_url && answer_assist_url.indexOf('cdn') > 0 ?
									<div className="step_frame">
										<img src={answer_assist_url} style={{height:"8rem"}} />
									</div>:
									null
								}
							</div>
						</div>
					</div>
				);
			}

			var submitAnswerDom = [];
			if(submit_answer){
				submitAnswerDom = (
					<div>
						<p style={{marginBottom:'0.5rem',marginTop:'0.5rem'}}>{realname}的解答：</p>
						<div style={{margin:'0 0 10px 0',borderRadius:'5px',border:exercise_state? '1.5px solid #95de64' : '1.5px solid #ff4d4f',padding:'10px'}}>
							{ exercise_type == 3 ?
								<div>
									<div onClick={()=>this.showBigImage()}>
										<img src={submit_answer.url}
											style={{width: answer_img_width, height: answer_img_height}}
										/>
									</div>
									<div>
										<Modal
											onCancel={() => this.handleCancel()}
											visible={isShow}
											width="700px"
											footer={null}
											bodyStyle={{textAlign:'center'}}
										>
											<img src={submit_answer.url} style={{maxWidth:"100%"}} alt="" />
										</Modal>
									</div>
								</div>
								:
								<div>
									<audio src={submit_answer.url} controls="controls">
										Your browser does not support the audio element.
									</audio>
								</div>
							}
						</div>
					</div>
				);
			}
			var defaultValue = [];
			for(var m=0;m<breakdown.length;m++){
				if(breakdown[m].sn_state){
					defaultValue.push(breakdown[m].kpid);
				}
			}
			var stepsDom = (
				<div style={{margin:'0 10px 10px 10px',paddingBottom:'5px'}}>
					<Checkbox.Group disabled style={{ width: '100%' }} defaultValue={defaultValue}>
						{breakdown.map((item, i) => {
							return(
								<Row type="flex" justify="start" >
									<Col span={1}>
										<p><Checkbox value={item.kpid}></Checkbox></p>
									</Col>
									<Col span={18}>
										<Tex content={item.content}/>
										<div><a>{item.kpname}</a></div> 
									</Col>
								</Row>
							);
						})}
					</Checkbox.Group>
				</div>
			);

        	return(
				<div className="exercise_frame">
					<div className="exercise_id_div">{exercise_id}</div>
					<div style={{margin: '10px'}} >
						<Tex content={title}/>
						<div>
							{
								title_img_url? 
								<div>
									<img src={title_img_url} 
										ref={element => {this.title_img = element;}}
										onLoad = {() => this.titleImageLoaded()} 
										style={{width: title_img_width, height: title_img_height}}
									/>
								</div> 
								:
								null
							}
						</div>
						<div>
							{
								title_audio_url? 
								<div>
									<audio src={title_audio_url} controls="controls">
					                    Your browser does not support the audio element.
					                </audio>
								</div> 
								:
								null
							}
						</div>
						{answerDom}
						{submitAnswerDom}
					</div>
					<div className="kp_step">
						<p style={{margin:'5px 0 3px 10px',paddingTop:'5px',fontSize:'14px'}}>分解：</p>
						<div>
							{stepsDom}
						</div>
					</div>
				</div>
			);
		}
	}
}


class TestCorrect extends React.Component {
	constructor(props){
		super(props);
		this.state = { 
			activeKey : '1', 
			testid : this.props.params.id,
		};
	}

	componentDidMount(){
	  //test_id 310
	  const {testid} = this.state;
	  if(testid){
		this.props.getTestInfoById(testid);
		this.props.getUncheckedExers(testid);
		this.props.getCheckedExers(testid);
	  }
    }
	
	onTabChange(key){
		const {testid} = this.state;
		this.setState({activeKey : key});
		if(key == 2){
			this.props.getCheckedExers(testid);
		}else if(key == 1){
			this.props.getUncheckedExers(testid);
		}
	}

	handleSubmitAnswer(testid,exercise_log,breakdown_log){
		this.props.submitCheckAnswer(testid,exercise_log,breakdown_log);
	}
	
	render(){
		const {activeKey, testid} = this.state;
		const {testname, unchecked_exers, checked_exers} = this.props;
		var unCheckedDom = [];
		var CheckedDom = [];
		if(testname){
			for(var j = 0; j < unchecked_exers.length; j++){
				unCheckedDom.push(
					<div key={j}>
						<OneUncheckedExer exer_data={unchecked_exers[j]}
							onSubmitAnswer={(testid,exercise_log,breakdown_log)=>this.handleSubmitAnswer(testid,exercise_log,breakdown_log)}
						/>
					</div>
				);
			}
			for(var m = 0; m < checked_exers.length; m++){
				CheckedDom.push(
					<div key={m}>
						<OneCheckedExer exer_data={checked_exers[m]}/>
					</div>
				);
			}
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
						<Tabs onChange={(key)=>this.onTabChange(key)} activeKey={activeKey}>
							<TabPane tab="待批改" key="1">{unCheckedDom}</TabPane>
							<TabPane tab="已批改" key="2">{CheckedDom}</TabPane>
						</Tabs>
					</div>
					</Content>
					<Footer style={{ textAlign: 'center' }}>
						Ant Design ©2020 Created by Bourne
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
  const {test_info, unchecked_exers, checked_exers} = tests_data;	
  return {
	  testname : test_info.testname,
	  unchecked_exers : unchecked_exers,
	  checked_exers : checked_exers,
  }
}, action)(TestCorrect);


