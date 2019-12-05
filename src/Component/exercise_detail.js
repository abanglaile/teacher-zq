import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col,Button,Checkbox,Progress,Popover,Tooltip} from 'antd';
import Styles from '../styles/TestResult.css';
import Tex from './renderer.js';
import *as action from '../Action/';
import {connect} from 'react-redux';
import config from '../utils/Config';

var urlip = config.server_url;

class ExerciseDetail extends React.Component{
	constructor(props) {
		super(props);
	}
	componentDidMount(){
        const {testid} = this.props;
        if(testid){
            this.props.getTestDetail(testid);
        }
	}
	render(){
		const {test_data, isdeliverd} = this.props;
		console.log("test_data???:"+ JSON.stringify(test_data));
		var tests = [];
		if(test_data){
			if(isdeliverd){
				for(var j = 0; j < test_data.length; j++) {
					tests.push(
						<div key={j}>
							<OneExerciseView exer_data={test_data[j]}/>
						</div>
					);
				}
			}else{
				for(var j = 0; j < test_data.length; j++) {
					tests.push(
						<div key={j}>
							<OneExercise exer_data={test_data[j]}/>
						</div>
					);
				}
			}
		}
		return(
			<div>
				{tests}
			</div>
		);
		
	}
}

class OneExerciseView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
        	title_img_width: "auto",
	        title_img_height: "3rem",
	    };
	}
	titleImageLoaded(){
		console.log(this.title_img.width, window.innerWidth);
		if(this.title_img.width > window.innerWidth){
			this.setState({title_img_width: "90%", title_img_height: "auto"})
		}
	}
	render(){
		const {title_img_width, title_img_height} = this.state;
		if(this.props.exer_data){
			var {exercise,exercise_sample} = this.props.exer_data;
			const {correct_rate,kp_rate,stu_false} = this.props.exer_data;
			var {title, exercise_type, answer, breakdown, title_img_url, title_audio_url, exercise_id, answer_assist_url} = exercise;
			var sample;

			if(exercise_sample){
        		answer = exercise_sample.answer ? exercise_sample.answer : answer;
        		sample = exercise_sample.sample;
        		title_img_url = exercise_sample.title_img_url ? exercise_sample.title_img_url : title_img_url;
        		title_audio_url = exercise_sample.title_audio_url ? exercise_sample.title_audio_url : title_audio_url;
			}
			var answerDom = [];
        	switch(exercise_type){
        		case 0:  
        			answerDom = (  //填空题答案
						<div className="step_answer">
							<p className="step_index">答案：&nbsp;</p>
							{answer.map((item, i) => {
		        				return(
		            				<div>
										<Tex className="step_content" content={item.value} sample={sample}/>
		            				</div>
		            			);
							})}
						</div>
        			);
        			break;
        		case 1:
        			answerDom = (  //选择题选项和答案
						answer.map((item, i) => {
	        				return(
	            				<Row className="row_answer" type="flex" justify="start" align="middle">
	            					<Col span={1}>
										<p><Checkbox checked={item.correct} disabled ></Checkbox></p>
									</Col>
	            					<Col span={18}>
										<Tex content={item.value} sample={sample}/>
									</Col>
	            				</Row>
	            			);
						})
        			);
        			break;
        		case 2:
					answerDom = (  //选择题 图片选项和答案
						answer.map((item, i) => {
	        				return(
	            				<Row className="row_answer" type="flex" justify="start" align="middle">
	            					<Col span={1}>
										<p><Checkbox checked={item.correct} disabled ></Checkbox></p>
									</Col>
	            					<Col span={18}>
										<div style={{width:130,height:60}}>
											<img className="answer_img" src={item.value}/>
										</div>
									</Col>
	            				</Row>
	            			);
						})
					);
					break;
				case 3:  
        			answerDom = (  //解答题答案
						<div className="step_answer">
							<p className="step_index">答案：&nbsp;</p>
							{answer.map((item, i) => {
		        				return(
		            				<div>
										<Tex className="step_content" content={item.value} sample={sample}/>
		            				</div>
		            			);
							})}
						</div>
        			);
        			break;
        	}

			var steps = [];
			if(answer_assist_url && answer_assist_url.indexOf('cdn') > 0){
				steps.push(
					<div className="step_frame">
						<img src={answer_assist_url}/>
					</div>
				);
			}
			for(var j = 0; j < breakdown.length; j++) {
				console.log('breakdown[j].content:'+breakdown[j].content);
            	steps.push(
            		<div key={j} className="step_frame">
            			<Row type="flex" justify="start">
	    					<Col span={1}>
	    						<p>{(j+1).toString()}.</p>
							</Col>
							<Col span={23}>
								<Tex content={breakdown[j].content} sample={sample}/>
	            				<div><a>{breakdown[j].kpname}</a></div>
							</Col>
						</Row>
            		</div>
            	);
        	}

			var kprateDom = (
				kp_rate.map((item, i) => {
					return(
						<div key={i}>
						    <Row type="flex" justify="start">
		    					<Col span={1}>
		    						<p>{(i+1).toString()}.</p>
								</Col>
								<Col span={12}>
									<Progress 
									    percent={item.rate} 
									    format={(percent) => `${percent}%`} 
								    />
								</Col>
		    				</Row>
						</div>
        			);
				})
			);

			var false_content = (
				stu_false.map((item,i) => {
					return(
						<p>{item.student_name}</p>
					);
				})
			);
			var stufalseDom = (
				stu_false.length > 0 ? 
				<Popover placement="rightTop" content={false_content} trigger="click">
			      <Progress type="circle" percent={correct_rate} format={(percent) => `${percent}%`}  width={85} />
			    </Popover>
				:
				<Progress type="circle" percent={correct_rate} format={(percent) => `${percent}%`}  width={85} />
			);
        	return(
				<div className="exercise_frame">
					<div className="exercise_id_div">
						{exercise_id}
					</div>
					<div className="exercise_body_frame">
						<Tex content={title} sample={sample}/>
						<div>
							{
								title_img_url? 
								<div style={{width:680,height:60}}>
									<img src={title_img_url} height="100px"
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
								<div style={{width:680,height:60}}>
									<audio src={title_audio_url} controls="controls">
					                    Your browser does not support the audio element.
					                </audio>
								</div> 
								:
								null
							}
						</div>
						{answerDom}
					</div>
					<div className="kp_step">
						<p className="step_annouce">步骤：</p>
						<div>
							{steps}
						</div>
					</div>
					<div className="pro_result">
						<div className="result_cir">
							{stufalseDom}
						</div>
						<Tooltip placement="topLeft" title="知识点完成率" arrowPointAtCenter>
							<div className="result_progress">
								{kprateDom}
							</div>
						</Tooltip>
					</div>
				</div>
			);
		}
	}
}

class OneExercise extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
        	title_img_width: "auto",
	        title_img_height: "3rem",
			expand:false,
			display:'none',
	    };
	}
	handleShow(){
		this.setState({expand:!this.state.expand});
		if(this.state.display === 'none'){
			this.setState({display:'block'});
		}
		else{
			this.setState({display:'none'});
		}
	}
	titleImageLoaded(){
		console.log(this.title_img.width, window.innerWidth);
		if(this.title_img.width > window.innerWidth){
			this.setState({title_img_width: "90%", title_img_height: "auto"})
		}
	}
	render(){
		const {expand,display,title_img_width, title_img_height} = this.state;
		if(this.props.exer_data){
			var {exercise,exercise_sample} = this.props.exer_data;
			var {title, exercise_type, answer, breakdown, title_img_url, title_audio_url, exercise_id, answer_assist_url} = exercise;
			var sample;

			if(exercise_sample){
        		answer = exercise_sample.answer ? exercise_sample.answer : answer;
        		sample = exercise_sample.sample;
        		title_img_url = exercise_sample.title_img_url ? exercise_sample.title_img_url : title_img_url;
        		title_audio_url = exercise_sample.title_audio_url ? exercise_sample.title_audio_url : title_audio_url;
			}
			var answerDom = [];

			switch(exercise_type){
        		case 0:  
        			answerDom = (  //填空题答案
						<div className="step_answer">
							<p className="step_index">答案：&nbsp;</p>
							{answer.map((item, i) => {
		        				return(
		            				<div>
										<Tex className="step_content" content={item.value} sample={sample}/>
		            				</div>
		            			);
							})}
						</div>
        			);
        			break;
        		case 1:
        			answerDom = (  //选择题选项和答案
						answer.map((item, i) => {
	        				return(
	            				<Row className="row_answer" type="flex" justify="start" align="middle">
	            					<Col span={1}>
										<p><Checkbox checked={expand? item.correct:0} disabled ></Checkbox></p>
									</Col>
	            					<Col span={18}>
										<Tex content={item.value} sample={sample}/>
									</Col>
	            				</Row>
	            			);
						})
        			);
        			break;
        		case 2:
					answerDom = (  //选择题 图片选项和答案
						answer.map((item, i) => {
	        				return(
	            				<Row className="row_answer" type="flex" justify="start" align="middle">
	            					<Col span={1}>
										<p><Checkbox checked={expand? item.correct:0} disabled ></Checkbox></p>
									</Col>
	            					<Col span={18}>
										<div style={{width:130,height:60}}>
											<img className="answer_img" src={item.value}/>
										</div>
									</Col>
	            				</Row>
	            			);
						})
					);
					break;
				case 3:  
        			answerDom = (  //解答题答案
						<div className="step_answer">
							<p className="step_index">答案：&nbsp;</p>
							{answer.map((item, i) => {
		        				return(
		            				<div>
										<Tex className="step_content" content={item.value} sample={sample}/>
		            				</div>
		            			);
							})}
						</div>
        			);
        			break;
			}
			var steps = [];
			if(answer_assist_url && answer_assist_url.indexOf('cdn') > 0){
				steps.push(
					<div className="step_frame">
						<img src={answer_assist_url}/>
					</div>
				);
			}
			for(var j = 0; j < breakdown.length; j++) {
            	steps.push(
            	<div key={j} className="step_frame">
            		<Row type="flex" justify="start">
    					<Col span={1}>
    						<p>{(j+1).toString()}.</p>
						</Col>
						<Col span={23}>
							<Tex content={breakdown[j].content} sample={sample}/>
            				<div><a>{breakdown[j].kpname}</a></div>
						</Col>
					</Row>
            	</div>
            	);
        	}

        	return(
				<div className="exercise_frame">
					<div className="exercise_id_div">
						{exercise_id}
					</div>
					<div className="exercise_body_frame">
						<Tex content={title} sample={sample}/>
						<div>
							{
								title_img_url? 
								<div style={{width:680,height:60}}>
									<img src={title_img_url} height="100px"
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
								<div style={{width:680,height:60}}>
									<audio src={title_audio_url} controls="controls">
					                    Your browser does not support the audio element.
					                </audio>
								</div> 
								:
								null
							}
						</div>
						{answerDom}
					</div>
					<div style={{display}} className="kp_step">
						<p className="step_annouce">步骤：</p>
						<div>
							{steps}
						</div>
					</div>
					<div className="button_frame">
						<Button onClick={()=>this.handleShow()}>{!expand? "解题详情" : "收起详情"}</Button>
					</div>
				</div>
			);
		}
	}
}

export default connect(state => {
    const {testlog} = state.fetchTestsData.toJS();
    return {
        test_data : testlog ,
    }
  }, action)(ExerciseDetail);
