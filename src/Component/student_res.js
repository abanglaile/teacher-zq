import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {  Icon, Row, Col,Table,Button,Input,Dropdown,Progress,Switch} from 'antd';
import Styles from '../styles/TestResult.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
import config from '../utils/Config';
import moment from 'moment';

var urlip = config.server_url;


class StudentRes extends React.Component {
	constructor(props) {
        super(props);
        this.state={filterDropdownVisible: false, searchText: '', filtered: false, checked : false};
    }

	componentDidMount(){
        const {testid} = this.props;
        // console.log('StudentRes testid',testid);
        if(testid){
            this.props.getTestResultInfo(testid);
        }
	}

	handleSearch = (selectedKeys, confirm) => () => {
		confirm();
		this.setState({ searchText: selectedKeys[0] });
	}

  handleReset = clearFilters => () => {
    clearFilters();
    this.setState({ searchText: '' });
  }

  onSwitchChange(checked){
	console.log("checked: ",checked);
	const {testid} = this.props;
	this.setState({checked : checked}, () => {
		var timer = setInterval(()=>{
			if(this.state.checked){
				this.props.getTestResultInfo(testid);
				console.log("+");
			}else{
				console.log("clearInterval");
				clearInterval(timer);
			}
		},1000);
	});

  }

	render(){
		this.columns = [{
            title: '姓名',
            dataIndex: 'studentname',
            width: '15%',
            key:'student_id',
            filterDropdown: ({
							setSelectedKeys, selectedKeys, confirm, clearFilters,
						}) => (
		        <div className="custom-filter-dropdown">
			          <Input
			            ref={ele => this.searchInput = ele}
			            placeholder="输入姓名"
			            value={selectedKeys[0]}
			            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            			onPressEnter={this.handleSearch(selectedKeys, confirm)}
			          />
		          <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>Search</Button>
          		<Button onClick={this.handleReset(clearFilters)}>Reset</Button>
		        </div>
	      	),
					filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
					onFilter: (value, record) => {
						var indexs = record.studentname.indexOf(value);
						return (indexs >= 0 ? true : false);
					},
	      	onFilterDropdownVisibleChange: (visible) => {
						if (visible) {
							setTimeout(() => {
								this.searchInput.focus();
							});
						}
					},
					render: (text) => {
						const { searchText } = this.state;
						return searchText ? (
							<span>
								{text.split(new RegExp(`(${searchText})`, 'gi')).map((fragment, i) => (
									fragment.toLowerCase() === searchText.toLowerCase()
										? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
								))}
							</span>
						) : text;
					},
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
            onFilter: (value, record) => {
							var res = record.completion? '已完成' : '未完成';
							return (res === value);
						},
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
						render: (text, record) => {
							if(text) return moment(text).format('YYYY-MM-DD HH:mm:ss'); //2014-09-24 23:36:09 
							else return '';
            },
			sorter: (a, b) => (moment(a.end_time)-moment(b.end_time)),
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
					<div>
						<Switch size="small" onChange={(e)=>this.onSwitchChange(e)} />
					</div>
					<div className="row_rate">
						<Row type="flex" justify="center" align="middle">
							<Col span={5}>
								<p style={{
									fontSize: '60px',
									color: '#0e77ca',
									marginLeft: '10px',
									marginBottom:'0',
								}}>{test_res.completion_num}</p>
							</Col>
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
								<p className="row_rate_time" style={{marginBottom:'0',}}>{test_res.timeconsuming_per? test_res.timeconsuming_per : ' '}</p>
							</Col>
						</Row>
						<Row type="flex" justify="center" align="middle">
						  	<Col span={5}><p className="row_rate_p">已提交（人）</p></Col>
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
		// console.log("test_res: ",JSON.stringify(test_res));
    return {
        test_res : test_res
    }
  }, action)(StudentRes);
  