import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon,Spin,Table, Menu, Select, Button,Breadcrumb, Popconfirm ,Checkbox,message,TreeSelect,Modal, Input} from 'antd';
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

class TestCenter extends React.Component{
    constructor(props) {
        super(props);
        this.state={visible:false, copy_visible:false, tree_value:undefined, copy_name:null};
        this.columns = [{
            title: '测试名称',
            dataIndex: 'testname',
            width: '30%',
            render: (text, record,index) => {
              // let urlstr = "/AuthJWT/testresult/"+record.key;
              return(
                <div>
                  <a  onClick={() => this.props.router.push("/teacher-zq/testresult/"+record.key)}>{text}</a>
                </div>
              );
            },
        }, {
            title: '状态',
            dataIndex: 'teststate',
            width: '20%',
            render: (text, record) => {
              return(
                <span >
                  <font color={record.teststate? "00a854" : "red"}>{record.teststate? "已发布" : "未发布"}</font>
                </span>
              );
            },
        }, {
          title: '测试时间',
          dataIndex: 'time',
          width: '25%',
          render: (text, record) => {
            if(text) return moment(text).format('YYYY-MM-DD HH:mm:ss'); //2014-09-24 23:36:09 
            else return '';
          },
      },{
            title: '操作',
            dataIndex: 'action',
            render: (text,record,index) => {
              return(
                <span>
                  {
                    !record.teststate?
                    <a onClick={()=>this.onTest(record.key,index)}>发布</a>
                    :
                    <a className="a_action">发布</a>
                  }
                  <span className="ant-divider" />
                  {
                    !record.teststate?
                    < Popconfirm title = "确定删除?" onConfirm = {() => this.onDelete(record.key,index)} >
                      <a href = "#">删除</a> 
                    </Popconfirm >
                    :
                    <a className="a_action">删除</a>
                  }
                  <span className="ant-divider" />
                  <a onClick={()=>this.onCopy(record.key)}>复制</a>
                  <span className="ant-divider" />
                  <a  onClick={() => this.props.router.push("/teacher-zq/test_correct/"+"310")}>批改</a>
                </span>
              );
            },
        }];
    }

    componentDidMount(){
      const {teacher_id} = this.props;
      this.props.getTestTable(teacher_id);
      this.props.getTeacherGroup(teacher_id);
    }

    onTest(testid,index){
      this.setState({visible : true, currentid:testid,currentindex:index});
    }
    
    onCopy(testid){
      this.setState({copy_visible : true, currentid:testid});
    }

    onChange(value,label,extra){
      console.log(extra);
      console.log("value,label:"+value+" "+label);
      this.setState({ tree_value : value , extra : extra});
    }

    onDelete(testid,index){
      this.props.delOneTest(testid,index);
    }

    handleOk(){
      const {extra,currentid,currentindex} =this.state;
      var keys = [];
      for(var j = 0;j<extra.allCheckedNodes.length;j++){
          if(extra.allCheckedNodes[j].children != null){
              for(var i=0;i<extra.allCheckedNodes[j].children.length;i++){
                  keys.push((extra.allCheckedNodes[j].children[i].node.key).split('-')[0]);
              }
          }else{
              keys.push((extra.allCheckedNodes[j].node.key).split('-')[0]);
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

    handleCopyOk(){
      const {currentid, copy_name} =this.state;
      const {teacher_id} = this.props;
      if(copy_name){
        this.props.copyTest(teacher_id, currentid, copy_name);
        this.setState({
            copy_visible: false,
        });
      }else{
        message.error('试题名称不能为空!!!');
      }
    }

    handleCopyCancel(){
      this.setState({
        copy_visible: false,
      });
    }

    render(){
      const {visible, tree_value, copy_visible, copy_name} = this.state;
      const {tests, stugroups, isFetching} = this.props;
      console.log('stugroups:'+ JSON.stringify(stugroups));

      const tProps = {
        treeData: stugroups,
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
                <Icon type="plus" />添加测试
              </Button>
            </div>
            <Modal title="试题分发" visible={visible} width={500} style={{height:400}} onOk={()=>this.handleOk()} onCancel={()=>this.handleCancel()} okText="确定">
                <TreeSelect {...tProps}/>
            </Modal>
            <Modal title="复制试题" visible={copy_visible} width={500} style={{height:400}} onOk={()=>this.handleCopyOk()} onCancel={()=>this.handleCopyCancel()} okText="确定">
                <Input placeholder="请输入新的试题名称"  onChange={(e) => {this.setState({copy_name:e.target.value})}}/>
            </Modal>
            < Table 
              columns = { this.columns } 
              dataSource = { tests }
            /> 
        </div> 
      );
    }
}

export default connect(state => {
  console.log(state);
  return {
    tests : state.fetchTestsData.get('test_data').toJS(), 
    isFetching : state.fetchTestsData.get('isFetching'), 
    teacher_id : state.AuthData.get('userid'),
    stugroups : state.classGroupData.get('stugroups_data').toJS(),
  }
}, action)(TestCenter);