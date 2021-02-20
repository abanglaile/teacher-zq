import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon, Row, Col,Table,Button,Input,Dropdown,Progress,Modal,Radio,Form,message,Carousel } from 'antd';
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
            submit_url:null,
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

    showModal(student_id,submit_url){
        this.setState({visible: true, student_id : student_id, submit_url : submit_url});
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
	    },{
            title: '提交时间',
            dataIndex: 'submit_time',
            width: '12%',
            sorter: (a, b) => (moment(a.submit_time)-moment(b.submit_time)),
            render: (text, record) => {
                if(text) return moment(text).format('YYYY-MM-DD HH:mm:ss'); 
                else return '';
                return (text);
            },
        },{
            title: '审核时间',
            dataIndex: 'verify_time',
            width: '12%',
            sorter: (a, b) => (moment(a.verify_time)-moment(b.verify_time)),
            render: (text, record) => {
                if(text) return moment(text).format('YYYY-MM-DD HH:mm:ss'); 
                else return '';
                return (text);
            },
        },{
            title: '任务状态',
            dataIndex: 'verify_state',
            width: '8%',
            key:'verify_state',
            render: (text, record) => {
                return(
                  //2:审核通过 3:已领取(通过后积分) 
                  text == 2 || text == 3 ? 
                  <span><font color={"#389e0d"}>已通过</font></span>
                  :
                  (
                      //0:未提交 1:已提交(待审核) 2:审核通过 3:已领取(通过后积分) 4：审核未通过
                      text == 0 ?
                      <span><font color={"grey"}>未提交</font></span>
                      :
                      (
                        text == 1 ?
                        <span onClick={() => this.showModal(record.student_id,record.submit_url)}>
                          <a><font color={"#69c0ff"}>待审核</font></a>
                        </span>
                        :
                        <span onClick={() => this.showModal(record.student_id,record.submit_url)}>
                          <a><font color={"red"}>未通过</font></a>
                        </span>
                      )
                      
                  )
                );
            },
            filters: [{
                        text: '已通过',
                        value: '已通过',
                    },{
                        text: '未通过',
                        value: '未通过',
                    },{
                        text: '未提交',
                        value: '未提交',
                    },{
                        text: '待审核',
                        value: '待审核',
                    }],
            onFilter: (value, record) => {
                const sta = record.verify_state;
                var res = sta == 2 ||  sta == 3 ? "已通过" : (
                    sta == 0 ? "未提交": (
                        sta == 1 ? "待审核" : "未通过"
                    )
                );
                return (res === value);
            },
        }, {
            title: '评语',
            dataIndex: 'comment',
            width: '15%',
            key:'comment',
        },];
        const {task_res} = this.props;
        const {submit_url} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        };
        if(submit_url){
            var url_list = submit_url.split(',');
        }
		if(task_res){
			return(
				<div>
					<div>
						<Table columns={this.columns} dataSource={task_res} />
					</div>
                    <Modal
                        title="审核"
                        visible={this.state.visible}
                        width={800}
                        onOk={(e) => this.handleOk(e)}
                        onCancel={() => this.handleCancel()}
                    >
                        <div>
                            {submit_url ?
                                <div style={{marginBottom:'1rem'}}>
                                    <Carousel dotPosition={'top'}>
                                        {url_list.map((item) => 
                                            <div>
                                                <img src={item} 
                                                    style={{width: "752px", height: "auto"}}
                                                />
                                            </div>)}
                                    </Carousel>
                                </div>
                                :''
                            }
                            <Form layout="horizontal">
                                <Form.Item
                                    label="审核情况"
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator ('verifyState', {})(
                                        <Radio.Group defaultValue="horizontal">
                                            <Radio.Button value="2">通过</Radio.Button>
                                            <Radio.Button value="4">不通过</Radio.Button>
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
  