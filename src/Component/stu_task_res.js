import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon, Row, Col,Table,Button,Input,Dropdown,Progress,Modal,Radio } from 'antd';
import Styles from '../styles/TestResult.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
import config from '../utils/Config';
import moment from 'moment';

var urlip = config.server_url;


class StuTaskRes extends React.Component {
	constructor(props) {
        super(props);
        this.state={
            filterDropdownVisible: false, 
            searchText: '', 
            filtered: false, 
            checked : false,
            visible : false,
        };
    }

	componentDidMount(){
        const {taskid} = this.props;
        if(taskid){
            this.props.getTaskResultInfo(taskid);
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

    showModal(student_id){
        this.setState({visible: true, student_id : student_id});
    }

    handleOk(){
        this.setState({visible: false});
    }

    handleCancel(){
        this.setState({visible: false});
    }

	render(){
		this.columns = [{
            title: '姓名',
            dataIndex: 'realname',
            width: '10%',
            key:'student_id',
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters,}) => (
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
                var indexs = record.realname.indexOf(value);
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
            title: '审核状态',
            dataIndex: 'submit_time',
            width: '10%',
            key:'submit_time',
            render: (text, record, index) => {
              return(
                record.verify_time ? 
                <span>已审核</span>
                :
                (
                    text ?
                    <span onClick={() => this.showModal(record.student_id)}>
                        <a><font color={"#69c0ff"}>待审核</font></a>
                    </span>
                    :
                    ""
                )
              );
            },
            filters: [{
                        text: '已审核',
                        value: '已审核',
                    },{
                        text: '待审核',
                        value: '待审核',
                    },{
                        text: '',
                        value: '空',
                    }],
            onFilter: (value, record) => {
                console.log("value:",value);
                var res = record.submit_time? (record.verify_time ? '已审核' : '待审核') : '空';
                return (res === value);
            },
        }, {
            title: '审核状态',
            dataIndex: 'verify_state',
            width: '8%',
            key:'verify_state',
            render: (text, record) => {
              return(
                <span >
                  <font color={text ? "#00a854" : "red"}>{text ? "通过" : (text == null ? "":"未通过")}</font>
                </span>
              );
            },
            filters: [{
                        text: '通过',
                        value: '通过',
                    },{
                        text: '未通过',
                        value: '未通过',
                    },{
                        text: '',
                        value: '空',
                    }],
            onFilter: (value, record) => {
                var res = record.verify_state ? "通过" : (record.verify_state == null ? "空":"未通过");
                return (res === value);
            },
        }, {
            title: '评语',
            dataIndex: 'comment',
            width: '15%',
            key:'comment',
        },];
		const {task_res} = this.props;
		if(task_res){
			return(
				<div>
					<div>
						<Table columns={this.columns} dataSource={task_res} />
					</div>
                    <Modal
                        title="审核"
                        visible={this.state.visible}
                        onOk={() => this.handleOk()}
                        onCancel={() => this.handleCancel()}
                    >
                        <div>
                            <Radio.Group defaultValue="a" buttonStyle="solid">
                                <Radio.Button value="a">通过</Radio.Button>
                                <Radio.Button value="b">不通过</Radio.Button>
                            </Radio.Group>
                        </div>
                    </Modal>
				</div>
			);
		}
	}
}

export default connect(state => {
    const {task_res}  = state.TasksData.toJS();
    console.log("task_res: ",JSON.stringify(task_res));
    return {
        task_res : task_res,
    }
  }, action)(StuTaskRes);
  