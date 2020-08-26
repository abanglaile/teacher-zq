import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon,Spin,Table, Menu, Select, Button,Breadcrumb, Badge, Popconfirm,Radio,Checkbox,message,TreeSelect,Modal, Input} from 'antd';
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
        this.state={visible:false, copy_visible:false, xcxCode_visible:false,
          tree_value:undefined, copy_name:null,
          test_type:1,
        };
        this.columns = [{
            title: '测试名称',
            dataIndex: 'testname',
            width: '28%',
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
            width: '16%',
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
          width: '20%',
          render: (text, record) => {
            if(text) return moment(text).format('YYYY-MM-DD HH:mm:ss'); //2014-09-24 23:36:09 
            else return '';
          },
      },{
            title: '操作',
            dataIndex: 'action',
            width: '24%',
            render: (text,record,index) => {
              return(
                <span>
                  {
                    !record.teststate?
                    <a onClick={()=>this.onTest(record.key,index)}>发布</a>
                    :
                    <span style={{color:'#d9d9d9'}}>发布</span>
                  }
                  <span className="ant-divider" />
                  {
                    !record.teststate?
                    < Popconfirm title = "确定删除?" onConfirm = {() => this.onDelete(record.key,index)} >
                      <a href = "#">删除</a> 
                    </Popconfirm >
                    :
                    <span style={{color:'#d9d9d9'}}>删除</span>
                  }
                  <span className="ant-divider" />
                  <a onClick={()=>this.onCopy(record.key)}>复制</a>
                  <span className="ant-divider" />
                  {
                    record.is_check? //是否存在需要批改的题目
                    <Badge count={record.uncheck_num} offset={[10, 5]} showZero>
                      <a  onClick={() => this.props.router.push("/teacher-zq/test_correct/"+record.key)}>批改</a>
                    </Badge>
                    :
                    <span style={{color:'#d9d9d9'}}>批改</span>
                    /* <a  onClick={() => this.props.router.push("/teacher-zq/test_correct/"+310)}>批改</a> */
                  }
                </span>
              );
            },
        },{
          title: '小程序码',
          dataIndex: 'test_type',
          render: (text, record) => {
            if(text == 3){
              return (
                <a onClick={()=>this.getXcxCode(record.key)}>
                  <Icon type="link" />
                </a>
              );
            }
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

    getXcxCode(testid){
      this.setState({xcxCode_visible : true});
      this.props.getXcxCode(testid);
    }

    onTreeDataChange(value,label,extra){
      console.log(extra);
      console.log("value,label:"+value+" "+label);
      this.setState({ tree_value : value , extra : extra});
    }

    onDelete(testid,index){
      this.props.delOneTest(testid,index);
    }

    onDistributeTest(){
      const {extra,currentid,currentindex,test_type} =this.state;
      var keys = [];
      console.log("extra:",extra);
      if(test_type == 1){//为班组测试
        if(extra){//有分发对象
          for(var j = 0;j<extra.allCheckedNodes.length;j++){
            if(extra.allCheckedNodes[j].children != null){
                for(var i=0;i<extra.allCheckedNodes[j].children.length;i++){
                    keys.push((extra.allCheckedNodes[j].children[i].node.key).split('-')[0]);
                }
            }else{
                keys.push((extra.allCheckedNodes[j].node.key).split('-')[0]);
            }
          }
          this.props.distributeTest(keys,currentid,test_type,currentindex);
          this.setState({
            test_type:1,
            visible: false,
          });
        }else{
          message.warning ('请先选择发布对象！');
        }
      }else{//为公开测试
        this.props.distributeTest(keys,currentid,test_type,currentindex);
        this.setState({
          test_type:1,
          visible: false,
        });
      }
    }

    handleCancel(){
      this.setState({
        visible: false,
        test_type:1,
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

    onChangeTestType(e){
      console.log('radio checked', e.target.value);
      this.setState({
        test_type: e.target.value,
      });
    }

    render(){
      const {visible, tree_value, copy_visible, xcxCode_visible, copy_name} = this.state;
      const {tests, stugroups, isFetching, xcx_code, isXcxcodeFetching} = this.props;
      console.log('tests:'+ JSON.stringify(tests));
      console.log('xcx_code:'+ xcx_code);

      const tProps = {
        treeData: stugroups,
        value: tree_value,
        onChange: (value,label,extra)=>this.onTreeDataChange(value,label,extra),
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
            <Modal title="试题发布" 
              visible={visible} 
              width={500} 
              style={{height:400}} 
              onOk={()=>this.onDistributeTest()} 
              onCancel={()=>this.handleCancel()} 
              okText="确定">
                <Radio.Group onChange={(e) => this.onChangeTestType(e)} value={this.state.test_type}>
                  <Radio value={1}>班组发布</Radio>
                  <Radio value={3}>公开发布</Radio>
                </Radio.Group>
                {
                  this.state.test_type == 1 ?
                  <div style={{marginTop:'1rem'}}>
                    <TreeSelect {...tProps}/>
                  </div>
                  :
                  null
                }
            </Modal>
            <Modal title="复制试题" visible={copy_visible} width={500} style={{height:400}} onOk={()=>this.handleCopyOk()} onCancel={()=>this.handleCopyCancel()} okText="确定">
                <Input placeholder="请输入新的试题名称"  onChange={(e) => {this.setState({copy_name:e.target.value})}}/>
            </Modal>
            <Modal title="小程序码" visible={xcxCode_visible} width={350} style={{height:350}} footer={null} onCancel={()=>this.setState({xcxCode_visible:false})}>
                {
                  isXcxcodeFetching ? 
                  <Spin />
                  :
                  <img src={"data:image/png;base64,"+xcx_code}/>
                }
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
  console.log("state.fetchTestsData:",JSON.stringify(state.fetchTestsData));
  return {
    tests : state.fetchTestsData.get('test_data').toJS(), 
    xcx_code : state.fetchTestsData.get('xcx_code'), 
    isFetching : state.fetchTestsData.get('isFetching'), 
    isXcxcodeFetching : state.fetchTestsData.get('isXcxcodeFetching'), 
    teacher_id : state.AuthData.get('userid'),
    stugroups : state.classGroupData.get('stugroups_data').toJS(),
  }
}, action)(TestCenter);