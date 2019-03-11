import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon, Row, Col,Table,Button,Input,Dropdown,Progress,Modal,Radio,Form,message } from 'antd';
import Styles from '../styles/TestResult.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
import { createForm } from 'rc-form';
import config from '../utils/Config';
import moment from 'moment';

var urlip = config.server_url;
const RadioGroup = Radio.Group;


class StuTaskRes extends React.Component {
	constructor(props) {
        super(props);
        this.state={
            filterDropdownVisible: false, 
            searchText: '', 
            student_id:'',
            filtered: false, 
            checked : false,
            visible : false,
            value : 1,
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

    handleOk(e){
        // this.setState({visible: false});
        const {teacher_id, taskid} = this.props;
        const {student_id} = this.state; 
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', JSON.stringify(values));
                console.log('values.verifyState:'+values.verifyState);
                console.log('values.comment:'+values.comment);
                if(!values.verifyState){
                    message.warning("请选择审核结果！");
                }else{
                    this.setState({visible: false},()=>{
                        this.props.setVerifyRes(values.verifyState,values.comment,taskid,teacher_id,student_id);
                    });
                }
            }
        });
    }

    handleCancel(){
        this.setState({visible: false});
    }

    onRadioChange(e){
        this.setState({
            value: e.target.value,
        });
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
            render: (text, record) => {
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
            title: '审核结果',
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
            render: (text, record) => {
                return(
                  text ? 
                  <span><font color={"#00a854"}>通过</font></span>
                  :
                  (
                      text == 0 ?
                      <span onClick={() => this.showModal(record.student_id)}>
                          <a><font color={"red"}>未通过</font></a>
                      </span>
                      :
                      ""
                  )
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
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        };
		if(task_res){
			return(
				<div>
					<div>
						<Table columns={this.columns} dataSource={task_res} />
					</div>
                    <Modal
                        title="审核"
                        visible={this.state.visible}
                        onOk={(e) => this.handleOk(e)}
                        onCancel={() => this.handleCancel()}
                    >
                        <div>
                            <Form layout="horizontal">
                                <Form.Item
                                    label="审核情况"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator ('verifyState', {})(
                                        <Radio.Group defaultValue="horizontal">
                                            <Radio.Button value="1">通过</Radio.Button>
                                            <Radio.Button value="0">不通过</Radio.Button>
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                                <Form.Item
                                    label="评语"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator ('comment', {})(
                                        <Input placeholder="点评作业完成情况" />
                                    )}
                                </Form.Item>
                            </Form>
                        </div>
                    </Modal>
				</div>
			);
		}
	}
}

const TaskResWapper = createForm()(StuTaskRes);
export default connect(state => {
    const {task_res}  = state.TasksData.toJS();
    console.log("task_res: ",JSON.stringify(task_res));
    return {
        task_res : task_res,
        teacher_id:state.AuthData.get('userid'),
    }
  }, action)(TaskResWapper);
  