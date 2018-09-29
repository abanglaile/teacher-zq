import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {  Icon, Row, Col,Table,Button,Input,Dropdown,Progress} from 'antd';
import Styles from '../styles/TestResult.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
import config from '../utils/Config';

var urlip = config.server_url;


class StudentRes extends React.Component {
	constructor(props) {
        super(props);
        this.state={filterDropdownVisible: false, searchText: '', filtered: false};
    }

	componentDidMount(){
        const {testid} = this.props;
        console.log('StudentRes testid',testid);
        if(testid){
            this.props.getTestResultInfo(testid);
        }
	}

    onInputChange(e){
    	this.setState({ searchText: e.target.value });
  	}

    onSearch(){
	    const { searchText } = this.state;
	    const reg = new RegExp(searchText, 'gi');
	    this.setState({
	      filterDropdownVisible: false,
	      filtered: !!searchText,
	      test_data: test_data.map((record) => {
	        const match = record.studentname.match(reg);
	        if (!match) {
	          return null;
	        }
	        return {
	          ...record,
	          studentname: (
	            <span>
	              {record.studentname.split(reg).map((text, i) => (
	                i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
	              ))}
	            </span>
	          ),
	        };
	      }).filter(record => !!record),
	    });
	}

	render(){
		this.columns = [{
            title: '学生姓名',
            dataIndex: 'studentname',
            width: '20%',
            key:'student_id',
            filterDropdown: (
		        <div className="custom-filter-dropdown">
			          <Input
			            ref={ele => this.searchInput = ele}
			            placeholder="输入学生姓名"
			            value={this.state.searchText}
			            onChange={(e)=>this.onInputChange(e)}
			            onPressEnter={()=>this.onSearch()}
			          />
		          <Button type="primary" onClick={()=>this.onSearch()}>查找</Button>
		        </div>
	      	),
	      	filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
	      	filterDropdownVisible: this.state.filterDropdownVisible,
	      	onFilterDropdownVisibleChange: visible => this.setState({ filterDropdownVisible: visible }, () => this.searchInput.focus()),
	    }, {
            title: '完成情况',
            dataIndex: 'completion',
            width: '15%',
            key:'completion',
            render: (text, record) => {
              return(
                <span >
                  <font color={record.completion? "#00a854" : "red"}>{record.completion? "已完成" : "未完成"}</font>
                </span>
              );
            },
            filters: [{
	        	text: '已完成',
	       	 	value: '已完成',
	      	}, {
		        text: '未完成',
		        value: '未完成',
	      	}],
            onFilter: (value, record) => record.completion.indexOf(value) === 0,
        }, {
            title: '正确率(%)',
            dataIndex: 'score',
            width: '15%',
            key:'score',
            sorter: (a, b) => a.score - b.score,
        }, {
            title: '完成时间',
            dataIndex: 'end_time',
            width: '15%',
            key:'end_time',
            sorter: (a, b) => a.end_time - b.end_time,
        },{
            title: '作业耗时(分钟)',
            dataIndex: 'time_consuming',
            width: '15%',
            key:'time_consuming',
            sorter: (a, b) => a.time_consuming - b.time_consuming,
        },];
		const {test_res} = this.props;
		if(test_res){
			return(
				<div>
					<div className="row_rate">
						<Row type="flex" justify="center" align="middle">
							<Col span={5}>
								<Progress 
									type="circle"
									width={80}
									percent={test_res.completion_per} 
									format={(percent) => `${percent}%`} 
								/>
							</Col>
							<Col span={5}>
								<Progress 
									type="circle"
									width={80}
									percent={test_res.correct_rate} 
									format={(percent) => `${percent}%`} 
								/>
							</Col>
							<Col span={5}>
								<p className="row_rate_time">{test_res.timeconsuming_per}</p>
							</Col>
						</Row>
						<Row type="flex" justify="center" align="middle">
							<Col span={5}><p className="row_rate_p">作业提交率</p></Col>
							<Col span={5}><p className="row_rate_p">平均正确率</p></Col>
							<Col span={5}><p className="row_rate_p">平均耗时（分钟）</p></Col>
						</Row>
					</div>
					<div>
						<Table columns={this.columns} dataSource={test_res.test_data} />
					</div>
				</div>
			);
		}
	}
}

export default connect(state => {
    const {test_res}  = state.fetchTestsData.toJS();
    return {
        test_res : test_res
    }
  }, action)(StudentRes);
  