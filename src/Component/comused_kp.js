import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Progress,Table} from 'antd';
import Styles from '../styles/stu_capacity.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
import config from '../utils/Config';


var urlip = config.server_url;

class ComUsedKp extends React.Component {
	constructor(props) {
		super(props);
		this.columns = [{
            title: '知识点',
            dataIndex: 'kpname',
            width: '40%',
        }, {
            title: '练习次数',
            dataIndex: 'usedcount',
            width: '30%',
            render: (text, record, index) => {
              return(
				<div>
					<p>{text}</p>
					<Progress 
						strokeWidth={5}
						percent={(text/this.props.bigcount)*100} 
						format={() => ''}
	    			/>
				</div>
              );
            },
        }, {
            title: '正确率',
            dataIndex: 'rate',
            width: '30%',
            render: (text, record, index) => {
              return(
				<div>
					<p>{text}%</p>
					<Progress 
						strokeWidth={5}
						percent={text} 
						format={() => ''}
	    			/>
				</div>
              );
            },
        }];
    }
    componentDidMount(){
        const {student_id} = this.props;
        if(student_id){
            this.props.getStuComUsedKp(student_id);
        }
    }
    render(){
    	const {used_data} = this.props;
    	if(used_data){
            return(
                <div>
                    <Table
                    className="usedkp_table"
                    columns={this.columns}
                    dataSource={used_data}
                    />
                </div>
            );
        }
    }
}

export default connect(state => {
  const student_data = state.studentData.toJS();
  const { used_data} = student_data;	
  return {
    used_data : used_data ? used_data : null,
    bigcount : used_data[0] ? used_data[0].usedcount : 1,
  }
}, action)(ComUsedKp);