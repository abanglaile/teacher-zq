import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon,Spin,Tabs,Table,Input, Row, Col, Steps, Menu, Select, message, Button,Breadcrumb, Popconfirm ,TreeSelect,Modal,Tag,InputNumber,Switch} from 'antd';
import *as action from '../Action/';
import {connect} from 'react-redux';
import config from '../utils/Config';
import moment from 'moment';
import debounce from 'lodash/debounce';

const { SubMenu } = Menu;
const Option = Select.Option;
const Step = Steps.Step;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const TabPane = Tabs.TabPane;

var urlip = config.server_url;

class TaskManager extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            visible:false,tree_value:[],remark: [],task_type: 0, 
            remark_page: [],activeKey : '1', 
            filterDropdownVisible: false, searchText: '', 
            filtered: false, checked : false
        };
        this.searchTaskSource = debounce(this.props.searchTaskSource, 500);
    }
    
    componentDidMount(){
      const {teacher_id} = this.props;
      this.props.getTaskTable(teacher_id);
      this.props.getTeacherGroup(teacher_id);
    }

    onTabChange(key){
		const {teacher_id} = this.props;
		this.setState({activeKey : key});
		if(key == 2){
            // this.props.getTaskLogTable(teacher_id);
            this.props.getTaskLogTable('1');
		}else if(key == 1){
			this.props.getTaskTable(teacher_id);
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

    onTreeChange(value,label,extra){
      console.log(extra);
      console.log("value,label:"+value+" "+label);
      this.setState({ tree_value : value , extra : extra});
    }

    onDelete(taskid,index){
      this.props.delOneTask(taskid,index);
    }

    addTask(){
        const { teacher_id } = this.props;
        const { task_type, task_count, source_id, content } = this.state;
        this.props.addTask({
            source_id: source_id,
            create_user: teacher_id, 
            task_type: task_type,
            content: content,
            task_count: task_count,
        });
        this.setState({
            new_task_visible: false,
            source_id: null,
            task_count : null,
            content: null,
            task_type: 1,
        });
    }

    closeNewTask(){
        this.setState({ new_task_visible: false })
    }

    onAddTaskLog(){
        const { teacher_id } = this.props;
        const {extra,currentid} = this.state;
        var keys = [];
        if(extra){
            for(var j = 0;j<extra.allCheckedNodes.length;j++){
                if(extra.allCheckedNodes[j].children != null){
                    for(var i=0;i<extra.allCheckedNodes[j].children.length;i++){
                        keys.push({student_id :extra.allCheckedNodes[j].children[i].node.key});
                    }
                }else{
                    keys.push({student_id : extra.allCheckedNodes[j].node.key});
                }
            }
        }
        // console.log("keys:",keys);
        if(keys.length){
            this.props.distributeTaskLog(keys,{
                verify_user: teacher_id,
                task_id: currentid,
            });
        }else{
            message.warning('信息未填写完整！');
        }
        this.setState({
            add_tasklog_visible: false,
            currentid: null,
            currentname: null,
        });
    }

    closeAddTaskLogModual(){
        this.setState({
            add_tasklog_visible: false,
            currentid: null,
            currentname: null,
        });
    }

    handleOk(){
        const { teacher_id, search_task_source} = this.props;
        const {task_type, task_count, source_id, remark, extra, remark_page} = this.state;
        var keys = [];
        if(extra){
            for(var j = 0;j<extra.allCheckedNodes.length;j++){
                if(extra.allCheckedNodes[j].children != null){
                    for(var i=0;i<extra.allCheckedNodes[j].children.length;i++){
                        keys.push({student_id :extra.allCheckedNodes[j].children[i].node.key});
                    }
                }else{
                    keys.push({student_id : extra.allCheckedNodes[j].node.key});
                }
            }
        }
        // console.log("keys:",keys);
        var remark_res = task_type ? remark : JSON.stringify(remark_page);
        if(keys.length > 0 && source_id && remark_res){
            this.props.distributeNewHW(keys,{
                source_id: source_id,
                create_user: teacher_id, 
                task_type: task_type,//0：页码（教材），1：数量（试卷），2：自定义，3：知秋测试
                remark: remark_res,
                task_count: task_count,
            });
        }else{
            message.warning('信息未填写完整！');
        }
        
        this.setState({
            visible: false,
            source_id: null,
            source_type: null,
            task_count : null,
            remark : [],
            remark_page : [],
            task_type : 0,
            tree_value : [],
        });
    }

    handleCancel(){
        this.setState({
            visible: false,
            source_id: null,
            source_type: null,
            task_count : null,
            remark : [],
            remark_page : [],
            task_type : 0,
            tree_value : [],
        });
    }

    renderNewTaskModal(){
        const { teacher_id, search_task_source } = this.props;
        const { new_task_visible, task_type, task_count, source_id } = this.state;
  
        const source_name_option = search_task_source.map((item) =>  
            <Option key={item.source_id} type={item.source_type}>{item.source_name}</Option>
        )

        return (
        <Modal title="新建任务" visible={new_task_visible} width={600} onOk={()=>this.addTask()} onCancel={()=>this.closeNewTask()}>
            <div style={{marginBottom: "0.5rem"}}>
                <span style={{marginRight: "0.5rem"}}>教材：</span>
                <Select
                    style={{ width: 350, marginRight: "1rem" }}
                    value={this.state.source_id}
                    showSearch
                    placeholder={"选择教材"}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    autoFocus={true}
                    onSearch={(input) => this.searchTaskSource(input)}
                    onSelect={(value, option) => this.setState({
                        source_id: value,
                        task_count: 0, 
                        source_type: option.props.type, 
                        task_type: option.props.type,
                    })}
                    notFoundContent={null}
                >
                    {source_name_option}  
                </Select>
                            
                <div style={{padding: "1rem 0"}}>
                    <span style={{marginRight: "0.5rem"}}>数量：</span>
                    <InputNumber
                        style={{marginRight: "1rem"}}
                        value={this.state.task_count} 
                        onChange={(value) => this.setState({task_count: value})}
                    />
                    <span style={{marginRight: "0.5rem"}}>批改审核方式：</span>
                    <Select defaultValue="1" style={{ width: 150 }} value={this.state.task_type} onChange={v => this.setState({task_type: v})}>
                        <Option value={0}>无需审核</Option>
                        <Option value={1}>自主批改,需提交审核</Option>
                        <Option value={2}>需提交批改</Option>  
                    </Select>
                </div>
                <Input placeholder="任务描述" value={this.state.content} onChange={e => this.setState({content: e.target.value})} />                
            </div>
        </Modal>
        )

    }

    // renderNewHomework(){
    //     const { teacher_id, search_task_source} = this.props;
    //     let edit_dom = [];
    //     const {task_type, task_count, source_id, remark} = this.state;

    //     edit_dom = (
    //         <div>
    //             {this.renderSelectSource()}
    //             {this.renderTaskSub()}
    //             {this.renderTreeSelect()}
    //         </div>
    //     )
        
    //     return (
    //         <div>
    //             {/* <div style={{marginBottom: '0.5rem'}}>
    //             <a onClick={e => this.props.addHomework(lesson_id, {
    //                 source_id: source_id,
    //                 create_user: teacher_id, 
    //                 task_type: task_type,
    //                 remark: task_type ? remark : JSON.stringify(remark),
    //                 task_count: task_count,
    //             }, lesson_student)} style={{marginRight: '0.5rem'}}>发布</a>
    //             <a onClick={e => this.props.editLesson('new_homework_edit', false)}>取消</a>
    //             </div> */}
    //             {edit_dom}
    //         </div>
    //        )
    // }

    pageInputConfirm(){
        let {remark_page, page} = this.state;
        if (page && remark_page.indexOf(page) === -1) {
          remark_page = [...remark_page, page];
        }
        this.setState({
          task_count: remark_page.length,
          remark_page,
          page_input_visible: false,
          page: '',
        });
    }

    // renderSelectSource(){
    //     const { teacher_id, search_task_source, search_source_sub } = this.props;
    //     const {task_type, task_count, source_id, remark} = this.state;
  
    //     const source_name_option = search_task_source.map((item) =>  
    //         <Option key={item.source_name} type={item.source_type}>{item.source_name}</Option>
    //     )
    //     // const source_sub_option = search_source_sub.map((item) =>  
    //     //     <Option key={item.source_id} type={item.source_type}>{item.source_name}</Option>
    //     // )
    //     return (
    //         <div style={{marginBottom: "0.5rem"}}>
    //             <Select
    //                 style={{ width: 300, marginRight: "1rem" }}
    //                 value={this.state.source_id}
    //                 showSearch
    //                 placeholder={"选择教材"}
    //                 defaultActiveFirstOption={false}
    //                 showArrow={false}
    //                 filterOption={false}
    //                 autoFocus={true}
    //                 onSearch={(input) => this.searchTaskSource(input)}
    //                 onSelect={(value, option) => this.setState({
    //                     source_id: value,
    //                     task_count: 0,
    //                     remark: null,
    //                     remark_page: [],  
    //                     source_type: option.props.type, 
    //                     task_type: option.props.type,
    //                 })}
    //                 notFoundContent={null}
    //             >
    //                 {source_name_option}  
    //             </Select>                
    //             <span style={{marginRight: "0.5rem"}}>数量：</span>
    //             <InputNumber
    //                 style={{marginRight: "1rem"}}
    //                 value={this.state.task_count} 
    //                 onChange={(value) => this.setState({task_count: value})}
    //             />
    //         </div>
    //        )
    // }

    // renderTaskSub(){
    //     // let {remark, page_input_visible} = this.state;
    //     let {source_type, task_type, remark, remark_page, page_input_visible} = this.state;

    //     if(source_type){//非教材类
    //         return (
    //           <div style={{width: 500}}>
    //             <Input placeholder="添加作业描述" value={this.state.remark} onChange={e => this.setState({remark: e.target.value})} />
    //           </div>
    //         ) 
    //     }else if(task_type){
    //       //自定义
    //         return(
    //             <Row type="flex" gutter={2} justify="space-between" align="middle">
    //             <Col span={20}>
    //                 <Input placeholder="自定义内容" value={this.state.remark} onChange={e => this.setState({remark: e.target.value})} />
    //             </Col>
    //             <Col span={2}>
    //                 <Icon type="snippets" onClick={e => this.setState({task_type: 0, task_count: remark_page.length})} />
    //             </Col>
    //             </Row>
    //         )
    //     }else{
    //       return (
    //         <div>
    //             <Row>
    //                 <Col span={22}>
    //                     {
    //                         remark_page.map((tag, index) => 
    //                             <Tag key={tag} closable afterClose={(removedTag) => {
    //                                 const tags = remark_page.filter(tag => tag !== removedTag);
    //                                 this.setState({ remark_page: tags });
    //                             }}>
    //                                 {'P ' + tag}
    //                             </Tag>
    //                         )
    //                     }
    //                     {page_input_visible ? 
    //                         <InputNumber
    //                         size="small"
    //                         onChange={(value) => this.setState({page: value})}
    //                         onBlur={() => this.pageInputConfirm()}
    //                         />              
    //                         :
    //                         <Tag
    //                         onClick={e => this.setState({page_input_visible: true})}
    //                         style={{ background: '#fff', borderStyle: 'dashed' }}
    //                         >
    //                         <Icon type="plus" /> 添加页码
    //                         </Tag>
    //                     }
    //                 </Col>
    //                 <Col span={2}>
    //                     <Icon type="edit" onClick={e => this.setState({task_type: 2, task_count: 0.5})} />
    //                 </Col>
    //             </Row>
    //         </div>
    //       )
    //     }      
    // }
    
    // renderTreeSelect(){
    //     const {tree_value} = this.state;
    //     const { stugroups } = this.props;
    //     console.log('stugroups:'+ JSON.stringify(stugroups));

    //     const tProps = {
    //         treeData: stugroups,
    //         value: tree_value,
    //         onChange: (value,label,extra)=>this.onTreeChange(value,label,extra),
    //         multiple: true,
    //         treeCheckable: true,
    //         showCheckedStrategy: SHOW_PARENT,
    //         searchPlaceholder: '请选择发布班组',
    //         style: {
    //         width: 300,
    //         },
    //     };
    //     return(
    //         <div style={{marginTop: "1rem"}}>
    //             <TreeSelect {...tProps}/>
    //         </div>
    //     );
    // }
    onTask(task_id,source_name){
        this.setState({add_tasklog_visible : true, currentid:task_id, currentname:source_name});
    }

    renderAddTaskLogModal(){
        const {tree_value,add_tasklog_visible,currentname} = this.state;
        const { stugroups } = this.props;
        console.log('stugroups:'+ JSON.stringify(stugroups));

        const tProps = {
            treeData: stugroups,
            value: tree_value,
            onChange: (value,label,extra)=>this.onTreeChange(value,label,extra),
            multiple: true,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '请选择发布班组',
            style: {
            width: 300,
            },
        };
        return(
            <Modal title={currentname}
                visible={add_tasklog_visible} 
                width={500} 
                style={{height:400}} 
                onOk={()=>this.onAddTaskLog()} 
                onCancel={()=>this.closeAddTaskLogModual()} 
            >
                <div style={{marginTop: "1rem",marginBottom: '1rem'}}>
                    <TreeSelect {...tProps}/>
                </div>
            </Modal>
        );
    }

    render(){
        this.task_log_columns = [{
            title: '任务名',
            dataIndex: 'source_id',
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
                var name = record.sub_name ? record.source_name + ' ' + record.sub_name : record.source_name;
                var indexs = name.indexOf(value);
                return (indexs >= 0 ? true : false);
            },
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => {this.searchInput.focus();});
                }
            },
            render: (text,record) => {
                const { searchText } = this.state;
                var name = record.sub_name ? record.source_name + ' ' + record.sub_name : record.source_name;
                const textDom = searchText ? (
                    <span>
                        {name.split(new RegExp(`(${searchText})`, 'gi')).map((fragment, i) => (
                            fragment.toLowerCase() === searchText.toLowerCase()
                                ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                        ))}
                    </span>
                ) : name;
                return(
                    <div onClick={() => this.props.router.push("/teacher-zq/task_result/"+record.task_id)}>
                      <a>{textDom}</a>
                    </div>
                  );
            },
        }, {
            title: '任务描述',
            dataIndex: 'content',
            width: '25%',
            render: (text, record) => {
                return(
                    <div>
                        {text}
                    </div>
                );
            },
        }, {
            title: '布置时间',
            dataIndex: 'update_time',
            width: '16%',
            sorter: (a, b) => (moment(a.update_time)-moment(b.update_time)),
            render: (text, record) => {
                if(text) return moment(text).format('YYYY-MM-DD HH:mm:ss'); //2014-09-24 23:36:09 
                else return '';
                return (text);
            },
        },
        {
            title: '作业状态',
            dataIndex: 'taskState',
            width: '10%',
            render: (text, record) => {
              return(
                text == 'uncheck' ? 
                <span><font color={"#69c0ff"}>待审核</font></span>
                :
                (
                    text == 'focus'?
                    <span><font color={"#ffa940"}>待督办</font></span>
                    :
                    <span><font color={"#389e0d"}>已审核</font></span>
                )
              );
            },
            filters: [{
                        text: '待审核',
                        value: '待审核',
                    },{
                        text: '待督办',
                        value: '待督办',
                    },{
                        text: '已审核',
                        value: '已审核',
                    }],
            onFilter: (value, record) => {
                console.log("value:",value);
                // var res = record.submit_time? (record.verify_time ? '已审核' : '待审核') : '空';
                var res = record.taskState == 'uncheck'? '待审核' : (record.taskState == 'focus' ? '待督办' : '已审核');
                return (res === value);
            },
        },];
        this.task_columns = [
            {
                title: '任务名',
                dataIndex: 'source_id',
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
                    var name = record.sub_name ? record.source_name + ' ' + record.sub_name : record.source_name;
                    var indexs = name.indexOf(value);
                    return (indexs >= 0 ? true : false);
                },
                onFilterDropdownVisibleChange: (visible) => {
                    if (visible) {
                        setTimeout(() => {this.searchInput.focus();});
                    }
                },
                render: (text,record) => {
                    const { searchText } = this.state;
                    var name = record.sub_name ? record.source_name + ' ' + record.sub_name : record.source_name;
                    const textDom = searchText ? (
                        <span>
                            {name.split(new RegExp(`(${searchText})`, 'gi')).map((fragment, i) => (
                                fragment.toLowerCase() === searchText.toLowerCase()
                                    ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                            ))}
                        </span>
                    ) : name;
                    return(
                        <div>
                          {textDom}
                        </div>
                      );
                },
            }, {
                title: '任务描述',
                dataIndex: 'content',
                width: '40%',
                render: (text, record) => {
                    return(
                        <div>
                            {text}
                        </div>
                    );
                },
            }, {
                title: '新建时间',
                dataIndex: 'create_time',
                width: '16%',
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
                        <span className="ant-divider" />
                        <span onClick={()=>this.onTask(record.task_id,record.source_name)}>
                            <Icon type="snippets"/>
                        </span>
                    </span>
                    );
                },
            }
        ];
        const {visible,activeKey} = this.state;
        const {tasks,task_logs,isFetching} = this.props;
        console.log('tasks:',JSON.stringify(tasks));
        return(
            <div>
                <div>
                    <Tabs onChange={(key)=>this.onTabChange(key)} activeKey={activeKey}>
                        <TabPane tab="任务库" key="1">
                            <Spin spinning={isFetching} />
                            <div style={{marginBottom:"10px"}}>
                                <Button 
                                    type="primary"  
                                    onClick={() => this.setState({new_task_visible: true})}
                                >
                                    <Icon type="plus" />添加任务
                                </Button>
                            </div>
                            {this.renderNewTaskModal()}
                            {this.renderAddTaskLogModal()}
                            {/* <Modal title="新建作业并发布" visible={visible} width={600} 
                                onOk={()=>this.handleOk()} onCancel={()=>this.handleCancel()}>
                                {this.renderNewHomework()}
                            </Modal> */}
                            < Table 
                                columns = { this.task_columns } 
                                dataSource = { tasks }
                            />     
                        </TabPane>
                        <TabPane tab="任务审批" key="2">
                            < Table 
                                columns = { this.task_log_columns } 
                                dataSource = { task_logs }
                            /> 
                        </TabPane>
                    </Tabs>
                </div>
               
            </div>   
        );
    }
}

export default connect(state => {
  console.log('TasksData:',JSON.stringify(state.TasksData));
  const { search_task_source } = state.personalData.toJS();;
  return {
    tasks: state.TasksData.get('task_data').toJS(), 
    task_logs : state.TasksData.get('tasklog_data').toJS(), 
    isFetching: state.TasksData.get('isFetching'), 
    teacher_id:state.AuthData.get('userid'),
    search_task_source: search_task_source,
    stugroups : state.classGroupData.get('stugroups_data').toJS(),
  }
}, action)(TaskManager);