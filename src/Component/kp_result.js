import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col,Table,Progress,Popover} from 'antd';
import Styles from '../styles/TestResult.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
import config from '../utils/Config';

var urlip = config.server_url;

class KpResult extends React.Component {
	constructor(props) {
		super(props);
		this.state={kp_data : []};
        this.columns = [{
            title: '学生',
            dataIndex: 'student_name',
            width: '30%',
        }, {
            title: '正确率',
            dataIndex: 'stu_rate',
            width: '30%',
            render: (text, record, index) => {
              return(
	          	  <div>
					  <p>{text}%</p>
				  </div>
              );
            },
        },{
            title: '错误次数',
            dataIndex: 'stu_count',
            width: '40%',
        }];
		 
    }
    componentDidMount(){
        const {testid} = this.props;
        if(testid){
            this.props.getTestKpResult(testid);
        }
    }
    render(){
		const {kp_data} = this.props;
		if(kp_data){
			var progressDom = (
				kp_data.map((item, i) => {
					var content = [];
					var data = [];
					data = item.stu_mistake;
					content.push(
						<div>
							< Table columns = {this.columns} dataSource = {data} bordered size='small' /> 
						</div>
					)
					return(
						<Row className="kp_progress" key={item.kpid} type="flex" justify="space-around" align="middle">
							<Col span={4}>
								<span>{item.kpname}</span>
							</Col>
							<Col span={14}>
								<Popover placement="right" content={item.kp_correct_rate==100? null : content} trigger="hover">
									<Progress 
										percent={item.kp_correct_rate} 
										format={(percent) => `${percent}%`}  
									/>
								</Popover>
							</Col>
							<Col span={2}>
								<span className="row_kp_count">{item.kp_count}/</span>
								<span className="row_kp_count">{item.kp_count_all}</span>
							</Col>
						</Row>
					);
				})
			)
			return(
				<div>
					{progressDom}
				</div>
			);
		}
    }
}

export default connect(state => {
    const {kp_data}  = state.fetchTestsData.toJS();
    return {
        kp_data : kp_data
    }
  }, action)(KpResult);