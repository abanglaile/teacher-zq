import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Row, Col,Progress} from 'antd';
import Styles from '../styles/stu_capacity.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
import config from '../utils/Config';

var urlip = config.server_url;

class RecentKp extends React.Component {
	constructor(props) {
		super(props);
    }
    componentDidMount(){
        const {student_id} = this.props;
        if(student_id){
            this.props.getStuRecentKp(student_id);
        }
    }
    render(){
    	const {recent_data} = this.props;
        var recentDom = [];
        if(recent_data){
            for(var j=0;j<recent_data.length;j++){
                recentDom.push(
                    <div key={j}>
                        <Row type="flex" justify="start">
                            <Col span={9}><p>{recent_data[j].kpname}</p></Col>
                            <Col span={10}>
                                <Progress 
                                    percent={(recent_data[j].kp_rating/2000)*100} 
                                    format={() => ''}
                                />
                            </Col>
                            <Col span={2}><p>{recent_data[j].kp_rating+'分'}</p></Col>
                        </Row>
                    </div>
                );
            }
        }
    	return(
    		<div>
	    		<div className="d_ladder">
	    			<p className="p_d_kp">最近练习的知识点</p>
	    			<div className="kp_dom">{recentDom}</div>
	    		</div>
    		</div>
    	);
    }
}

export default connect(state => {
  const student_data = state.studentData.toJS();
  const {recent_data} = student_data;	
  return {
    recent_data : recent_data,
  }
}, action)(RecentKp);