import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon,Spin,Table,Input, Menu, Select, Button,Breadcrumb, Popconfirm ,Checkbox,TreeSelect,Modal,Tag} from 'antd';
import NetUtil from '../utils/NetUtil';
import Styles from '../styles/testCenter.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
// import {Link} from 'react-router';
import config from '../utils/Config';
import moment from 'moment';

const { SubMenu } = Menu;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

var urlip = config.server_url;

var treeData = [{
  label: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    label: 'Child Node1',
    value: '0-0-0',
    key: '0-0-0',
  }],
}, {
  label: 'Node2',
  value: '0-1',
  key: '0-1',
  children: [{
    label: 'Child Node3',
    value: '0-1-0',
    key: '0-1-0',
  }, {
    label: 'Child Node4',
    value: '0-1-1',
    key: '0-1-1',
  }, {
    label: 'Child Node5',
    value: '0-1-2',
    key: '0-1-2',
  }],
}];

class TaskManager extends React.Component{
    constructor(props) {
        super(props);
        this.state={visible:false,tree_value:[],treeData:[],
            filterDropdownVisible: false, searchText: '', filtered: false, checked : false
        };
    }
    
    componentDidMount(){
      const {teacher_id} = this.props;
      this.props.getTaskTable(teacher_id);
    }

    handleSearch = (selectedKeys, confirm) => () => {
		confirm();
		this.setState({ searchText: selectedKeys[0] });
	}

    handleReset = clearFilters => () => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    onTest(testid,index){
      const {treeData,tree_value} = this.state; 
      this.setState({visible : true, currentid:testid,currentindex:index},()=>{
            var data = []; 
            var url = urlip+'/getStudentGroup';
            NetUtil.get(url, {teacher_id : 1}, (results) => {
                data = results;
                console.log("treeData:"+JSON.stringify(data));
                this.setState({ treeData : data}); 
            })                         
      });
    }
    
    onCopy(index){
      // const {data} = this.state;

    }

    onChange(value,label,extra){
      console.log(extra);
      console.log("value,label:"+value+" "+label);
      this.setState({ tree_value : value , extra : extra});
    }

    onDelete(taskid,index){
      this.props.delOneTask(taskid,index);
    }

    handleOk(){
      const {extra,currentid,currentindex} =this.state;
      var keys = [];
      for(var j = 0;j<extra.allCheckedNodes.length;j++){
          if(extra.allCheckedNodes[j].children != null){
              for(var i=0;i<extra.allCheckedNodes[j].children.length;i++){
                  keys.push(extra.allCheckedNodes[j].children[i].node.key);
              }
          }else{
              keys.push(extra.allCheckedNodes[j].node.key);
          }
      }
      console.log("keys:",keys);
      this.props.distributeTest(keys,currentid,currentindex);
      this.setState({
          visible: false,
      });
    }

    handleCancel(){
      this.setState({
        visible: false,
      });
    }

    // handleAddTest(){
    // }

    render(){
        this.columns = [{
            title: '作业名',
            dataIndex: 'source_name',
            width: '30%',
            filterDropdown: ({
                setSelectedKeys, selectedKeys, confirm, clearFilters,
            }) => (
                <div className="custom-filter-dropdown">
                    <Input
                        ref={ele => this.searchInput = ele}
                        placeholder="输入关键字"
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
                var indexs = record.source_name.indexOf(value);
                return (indexs >= 0 ? true : false);
            },
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => {this.searchInput.focus();});
                }
            },
            render: (text,record) => {
                const { searchText } = this.state;
                const textDom = searchText ? (
                    <span>
                        {text.split(new RegExp(`(${searchText})`, 'gi')).map((fragment, i) => (
                            fragment.toLowerCase() === searchText.toLowerCase()
                                ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                        ))}
                    </span>
                ) : text;
                return(
                    <div onClick={() => this.props.router.push("/teacher-zq/task_result/"+record.task_id)}>
                      {textDom}
                    </div>
                  );
            },
        }, {
            title: '作业描述',
            dataIndex: 'remark',
            width: '30%',
            render: (text, record) => {
                var obj = null;
                if(record.task_type == '1'){
                    obj = JSON.parse(text);
                }
                return(
                    <div>
                        {obj ?
                        obj.map(item => {
                            return <Tag color={'green'} key={item}>第{item}页</Tag>;
                        })
                        :
                        text
                        }
                    </div>
                );
            },
        }, {
            title: '布置时间',
            dataIndex: 'create_time',
            width: '20%',
            sorter: (a, b) => (moment(a.create_time)-moment(b.create_time)),
            render: (text, record) => {
                if(text) return moment(text).format('YYYY-MM-DD HH:mm:ss'); //2014-09-24 23:36:09 
                else return '';
                return (text);
            },
        },{
            title: '操作',
            dataIndex: 'action',
            render: (text, record,index) => {
                return(
                <span>
                    <Popconfirm title = "确定删除?" onConfirm = {() => this.onDelete(record.task_id,index)} >
                        <Icon type="delete"/>
                    </Popconfirm >
                </span>
                );
            },
        }];
        const {visible,treeData,tree_value} = this.state;
        const {tasks,isFetching} = this.props;
        // console.log('tasks:'+ JSON.stringify(tasks));
        
        const tProps = {
            treeData : treeData,
            value: tree_value,
            onChange: (value,label,extra)=>this.onChange(value,label,extra),
            multiple: true,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '请选择发布班组',
            style: {
            width: 300,
            },
        };
        return(
            <div>
                <Spin spinning={isFetching} />
                <div style={{marginBottom:"10px"}}>
                <Button 
                    type="primary"  
                    onClick={() => this.props.router.push("/teacher-zq/exerview")}
                >
                    <Icon type="plus" />添加作业
                </Button>
                </div>
                <Modal title="试题分发" visible={visible} width={500} style={{height:400}} onOk={()=>this.handleOk()} onCancel={()=>this.handleCancel()} okText="确定">
                    <TreeSelect {...tProps}/>
                </Modal>
                < Table 
                columns = { this.columns } 
                dataSource = { tasks }
                /> 
            </div>   
        );
    }
}

export default connect(state => {
  console.log('TasksData:',JSON.stringify(state.TasksData));
  return {
    tasks: state.TasksData.get('task_data').toJS(), 
    isFetching: state.TasksData.get('isFetching'), 
    teacher_id:state.AuthData.get('userid'),
  }
}, action)(TaskManager);