import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon,Spin,Table,Badge, Menu, Row, Col, Tabs, Rate, Popover, Progress, Radio, Button, Alert, DatePicker, Popconfirm, Select ,Avatar, Input, Checkbox,TreeSelect, Modal, List, Tag, Dropdown, InputNumber} from 'antd';
import *as action from '../Action/';
import {connect} from 'react-redux';
// import {Link} from 'react-router';
import config from '../utils/Config';

import moment from 'moment';
import debounce from 'lodash/debounce';
import Immutable from 'immutable';

const { SubMenu } = Menu;
const {Option, OptGroup}  = Select;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const Item = List.Item;
const RadioGroup = Radio.Group;

const { TextArea } = Input;

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1198891_hl08ti6xmbi.js',
});

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

class LessonViewModal extends React.Component{
    constructor(props) {
        super(props);

        this.state={
          kp_tags: [],
          remark_page: [],
          task_type: 0,
          side : 0,
          reward_disable : false,
          visible:this.props.visible,
        };
    
        this.searchKpLabel = debounce(this.props.searchKpLabel, 500);
        this.searchPfLabel = debounce(this.props.searchPfLabel, 500);
        this.searchTaskSource = debounce(this.props.searchTaskSource, 500);
        this.searchTeacherTask = debounce(this.props.searchTeacherTask, 500);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.visible !== this.state.visible) {
        this.setState({ visible: nextProps.visible });
      }
    }

    // renderContentItem(item, index){
    //   const {lesson_edit, search_teacher_task, search_kp_label} = this.props;
    //   const {content_edit} = lesson_edit;
    //   let {kp_input_visible, kp_tags} = this.state;
    //   let item_title = ["课堂学习", "知识讲解", "课堂练习"];
    //   let edit_dom = [];
    //   let icon_dom = [
    //     <Icon onClick={e => {
    //       this.props.editLessonContent(index, true);
    //       this.setState({
    //         content_type: item.content_type, 
    //         content: item.content, 
    //         resource: item.resource,
    //         kp_tags: item.kpids ? JSON.parse(item.kpids) : []
    //       });
    //     }} type="edit" theme="outlined" />,
    //     <Icon onClick={e => this.props.deleteLessonContent({
    //             lesson_id: item.lesson_id,
    //             lesson_content_id: item.lesson_content_id,
    //           }, index)} type="delete" theme="outlined" />
    //   ] 
    //   const kp_options = search_kp_label ? search_kp_label.map(d => <Option key={d.kpid} group="kpid">{d.kpname}</Option>) : null;
    //   // switch(item.content_type){
    //   //   case 0:
    //   //     edit_dom = 
    //   //       <div style={{width: 500}}>
    //   //         <Input placeholder="新建课堂内容" value={this.state.content} onChange={e => this.setState({content: e.target.value})} />
    //   //       </div>
    //   //     break;
    //   //   case 1:
    //   //     edit_dom = 
    //   //       <div>
    //   //         {kp_tags.map((tag, index) => 
    //   //             <Tag key={tag.kpid} closable afterClose={(removedTag) => {
    //   //               kp_tags = this.state.kp_tags.filter(item => item.kpid !== removedTag);
    //   //               this.setState({ kp_tags, content: kp_tags.map(x => x.kpname).join("，")});
    //   //             }}>
    //   //               {tag.kpname}
    //   //             </Tag>
    //   //           )
    //   //         }
    //   //         {kp_input_visible ? 
    //   //           <Select
    //   //             style={{ width: 300 }}
    //   //             showSearch
    //   //             placeholder={"知识点"}
    //   //             defaultActiveFirstOption={false}
    //   //             showArrow={false}
    //   //             filterOption={false}
    //   //             onSearch={(input) => this.searchKpLabel(input)}
    //   //             onSelect={(value, option) => {
    //   //               let new_tag = {kpid: value, kpname: option.props.children};
    //   //               const kp_tags = this.state.kp_tags
    //   //               if(kp_tags.indexOf(value) === -1){
    //   //                 kp_tags.push(new_Tag);
    //   //                 this.setState({kp_tags, content: kp_tags.map(x => x.kpname).join("，")})
    //   //               }
    //   //               this.setState({kp_input_visible: false});
    //   //             }}
    //   //           >
    //   //             {kp_options}
    //   //           </Select>
    //   //           :
    //   //           <Tag
    //   //             onClick={e => this.setState({kp_input_visible: true})}
    //   //             style={{ background: '#fff', borderStyle: 'dashed' }}
    //   //           >
    //   //             <Icon type="plus" /> 添加知识点
    //   //           </Tag>
    //   //         }
    //   //       </div>

    //   //       break;
    //   //   case 2:
    //   //       icon_dom.splice(0, 1);
    //   //       break;
        
    //   // }
    //   //return (
    //   // content_edit[index] ?
    //   //   <Item>
    //   //     <div>
    //   //     <div style={{marginBottom: '0.5rem'}}>
    //   //       <span style={{
    //   //         width: "5rem", 
    //   //         fontWeight: "bold",
    //   //         textAlign: "right", 
    //   //         marginRight: "1rem", 
    //   //         paddingRight: "1rem", 
    //   //         borderRight: "2px solid #D3D3D3"
    //   //       }}>{item_title[item.content_type]}</span> 
    //   //       <a onClick={e => this.props.updateLessonContent({
    //   //           lesson_id: item.lesson_id,
    //   //           content: this.state.content,
    //   //           resource: this.state.resource,
    //   //           kpids: JSON.stringify(this.state.kp_tags),
    //   //           lesson_content_id: item.lesson_content_id,
    //   //       }, index)} style={{marginLeft: '0.5rem', marginRight: '0.5rem'}}>保存</a>
    //   //       <a onClick={e => this.props.editLessonContent(index, false)}>取消</a>
    //   //     </div>
    //   //     {edit_dom}
    //   //     </div>
    //   //   </Item>
    //   //   :
    //   return (
    //     <Item actions={[<Icon onClick={e => this.props.deleteLessonContent({
    //             lesson_id: item.lesson_id,
    //             lesson_content_id: item.lesson_content_id,
    //           }, index)} type="delete" theme="outlined" />]}>
    //       <span style={{
    //         width: "5rem", 
    //         fontWeight: "bold",
    //         textAlign: "right", 
    //         marginRight: "1rem", 
    //         paddingRight: "1rem", 
    //         borderRight: "2px solid #D3D3D3"
    //       }}>{item_title[item.content_type]}</span>
    //       <span style={{width: "25rem"}}>{item.content}</span>
    //     </Item>
    //   )
    // }

    contentIsEmpty(){
      const {content_type, content, resource, kp_tags} = this.state;
      switch(content_type){
        case 0:
          return content
        case 1:
          return kp_tags.length
        case 2:
          return resource
      }
    }


    renderNewContent(){
      const {teacher_lesson, lesson_index, lesson_edit, test_option, search_kp_label, teacher_id, search_teacher_task} = this.props;

      let {lesson_content, lesson_id} = teacher_lesson[lesson_index];
      let {new_content_edit} = lesson_edit;
      let {kp_input_visible, kp_tags, content_type} = this.state;
      let item_title = ["自定义", "知识讲解", "课堂练习"];
      let edit_dom = [];

      const menu = (
        <Menu>
          <Menu.Item>
            <a onClick={e => {
              this.setState({ content_type: 1, content: "", kp_tags: [], resource: null});
              this.props.editLesson("new_content_edit", true);
            }}>知识讲解</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={e => {
              this.setState({ content_type: 2, content: "", kp_tags: [], resource: null})
              this.props.editLesson("new_content_edit", true)
            }}>课堂练习</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={e => {
              this.setState({ content_type: 0, content: "", kp_tags: [], resource: null})
              this.props.editLesson("new_content_edit", true)
            }}>自定义</a>
          </Menu.Item>
        </Menu>
      );

      switch(this.state.content_type){
        case 0:
          edit_dom = 
            <div style={{width: 500}}>
              <Input placeholder="新建课堂内容" value={this.state.content} onChange={e => this.setState({content: e.target.value})} />
            </div>
          break;
        case 1:

          const kp_options = search_kp_label ? search_kp_label.map(d => <Option key={d.kpid} group="kpid">{d.kpname}</Option>) : null;
          
          edit_dom = 
            <div>
              {kp_tags.map((tag, index) => 
                  <Tag key={tag.kpid} closable afterClose={(removedTag) => {
                    kp_tags = this.state.kp_tags.filter(item => item.kpid !== removedTag);
                    this.setState({ kp_tags, content: kp_tags.map(x => x.kpname).join("，") });
                  }}>
                    {tag.kpname}
                  </Tag>
                )
              }
              {kp_input_visible ? 
                <Select
                  style={{ width: 300 }}
                  showSearch
                  placeholder={"知识点"}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  autoFocus={true}
                  size="small"
                  onSearch={(input) => this.searchKpLabel(input)}
                  onBlur={e => this.setState({kp_input_visible: false})}
                  onSelect={(value, option) => {
                    let new_tag = {kpid: value, kpname: option.props.children};
                    if(kp_tags.indexOf(value) === -1){
                      kp_tags.push(new_tag);
                      console.log(kp_tags);
                      this.setState({kp_tags, content: kp_tags.map(x => x.kpname).join("，")});
                    }
                    this.setState({kp_input_visible: false});
                  }}
                >
                  {kp_options}
                </Select>
                :
                <Tag
                  onClick={e => this.setState({kp_input_visible: true})}
                  style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                  <Icon type="plus" /> 添加知识点
                </Tag>
              }
            </div>
            break;
        case 2:
          const task_option = search_teacher_task.map((item) =>  
            <Option key={item.task_id} name={item.source_name} type={item.task_type} remark={item.remark}>
              <div style={{fontWeight: "bold"}}>{item.source_name}</div>
              {
                item.task_type ?
                <div>{item.remark}</div> : 
                JSON.parse(item.remark).map((tag) => <Tag key={tag}>{'P ' + tag}</Tag>)
              }
            </Option>
          )

          
          edit_dom = 
            <Select
              style={{ width: 300, marginRight: "1rem" }}
              value={this.state.resource}
              showSearch
              placeholder={"搜索任务"}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              optionLabelProp={"name"}
              autoFocus={true}
              onSearch={(input) => this.searchTeacherTask(teacher_id, input)}
              onSelect={(value, option) => {
                const {remark, type, name} = option.props;
                const remark_str = type ? remark : JSON.parse(remark).map(item => 'P' + item).join(', ')
                this.setState({resource: value, content: name + " " + remark_str})
              }}
              notFoundContent={null}
            >
              {task_option}
            </Select>
          break;
      }

      return (
       new_content_edit ?
        <Item>
          <div>
          <div style={{marginBottom: '0.5rem'}}>
            <span style={{
              width: "5rem", 
              fontWeight: "bold", 
              textAlign: "right", 
              marginRight: "1rem", 
              paddingRight: "1rem", 
              borderRight: "2px solid #D3D3D3"
            }}>{item_title[content_type]}</span> 
            <Button size={"small"} disabled={!this.contentIsEmpty()}
              onClick={e => this.props.addLessonContent({
                lesson_id: lesson_id,
                content: this.state.content,
                content_type: this.state.content_type,
                resource: this.state.resource,
                kpids: JSON.stringify(this.state.kp_tags),
            })} style={{marginRight: '0.5rem'}}>保存</Button>
            <Button size={"small"} onClick={e => this.props.editLesson('new_content_edit', false)}>取消</Button>
          </div>
          {edit_dom}
          </div>
        </Item>
        :
        <Item>
          <Dropdown overlay={menu} trigger={['click']}>         
            <a className="ant-dropdown-link" href="#">
              <Icon style={{ fontSize: "1rem", marginRight: "0.5rem" }} type="plus" />
              添加内容
            </a>
          </Dropdown>
        </Item>
      )
    }

    renderLessonContent(){
      const {teacher_lesson, lesson_index} = this.props;
      let {lesson_content, homework, is_sign} = teacher_lesson[lesson_index];
      //let content_list = lesson_content ? lesson_content.map((item, i) => this.renderContentItem(item, i)) : [];
      let item_title = ["课堂学习", "知识讲解", "课堂练习"];
      return(
        <div>
          <div style={{marginBottom: "1rem"}}>
            <Icon type="ordered-list" style={{color:"#D3D3D3"}}/>
            <span style={{fontSize: "1rem", color: "#D3D3D3", marginLeft: "0.5rem"}}>课堂</span>
          </div>
          <div style={{padding: "0 1rem 0 1rem", border: "1px solid #D3D3D3", borderRadius: "5px"}}>
            <List split={false} size={"small"}>
              {(lesson_content || []).map((item, i) => 
                <Item actions={[<Icon onClick={e => this.props.deleteLessonContent({
                      lesson_id: item.lesson_id,
                      lesson_content_id: item.lesson_content_id,
                    }, i)} type="delete" theme="outlined" />]}>
                  <List.Item.Meta
                    description={<div style={{color: "rgba(0, 0, 0, 0.65)"}}><span style={{
                      width: "5rem", 
                      fontWeight: "bold",
                      textAlign: "right", 
                      marginRight: "1rem", 
                      paddingRight: "1rem", 
                      borderRight: "2px solid #D3D3D3"
                    }}>{item_title[item.content_type]}</span>
                    <span>{item.content}</span></div>}
                  />
                  
                </Item>
              )}
              {this.renderNewContent()}
            </List>
          </div>
          <div style={{display: is_sign ? "inline" : "none"}}>
            <div style={{marginTop: "1rem", marginBottom: "1rem"}}>
              <Icon type="ordered-list" style={{color:"#D3D3D3"}}/>
              <span style={{fontSize: "1rem", color: "#D3D3D3", marginLeft: "0.5rem"}}>作业</span>
            </div>
            <div style={{padding: "0 1rem 0 1rem", border: "1px solid #D3D3D3", borderRadius: "5px"}}>
              {this.renderHomework()}
            </div>
          </div>
        </div>
      )
    }

    renderNewHomework(){
      const {lesson_edit, teacher_lesson, lesson_index, teacher_id, search_teacher_task, search_task_source} = this.props;
      const {new_homework_edit} = lesson_edit;
      const {lesson_student, lesson_id} = teacher_lesson[lesson_index];
      let edit_dom = [];
      const {task_type, task_count, source_id, source_type, remark, remark_page, task_id, homework_type} = this.state;

      const menu = (
        <Menu>
          <Menu.Item>
            <a onClick={e => {
              this.setState({
                homework_type: 0, 
                source_id: null, 
                task_count: 0,
                remark: null,
                remark_page: [],  
                source_type: 0, 
                task_type: 0
              });
              this.props.editLesson('new_homework_edit', true);
            }}>新建作业</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={e => {
              this.setState({homework_type: 1, remark: null});
              this.props.editLesson('new_homework_edit', true);
            }}>关联作业</a>
          </Menu.Item>
        </Menu>
      );
      switch(this.state.homework_type){
        case 0:
          const source_option = search_task_source.map((item) =>  
            <Option key={item.source_id} type={item.source_type}>{item.source_name}</Option>)
          edit_dom = 
            <div>
              <div style={{marginBottom: "0.5rem"}}>
                <Select
                  style={{ width: 300, marginRight: "1rem" }}
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
                    remark: null,
                    remark_page: [],  
                    source_type: option.props.type, 
                    task_type: option.props.type,
                  })}
                  notFoundContent={null}
                >
                  {source_option}  
                </Select>                
                <span style={{marginRight: "0.5rem"}}>数量：</span>
                <InputNumber
                  style={{marginRight: "1rem"}}
                  value={this.state.task_count} 
                  disabled={this.state.task_type != 1}
                  onChange={(value) => this.setState({task_count: value})}
                />
                </div>
              {this.renderTaskSub()}  
            </div>
          break;
        case 1:
          const task_option = search_teacher_task.map((item) =>  
            <Option key={item.task_id} name={item.source_name}>
              <div style={{fontWeight: "bold"}}>{item.source_name}</div>
              {
                item.task_type ?
                <div>{item.remark}</div> : 
                JSON.parse(item.remark).map((tag) => <Tag key={tag}>{'P ' + tag}</Tag>)
              }
            </Option>
          )

          edit_dom = 
            <Select
              style={{ width: 300, marginRight: "1rem" }}
              value={this.state.task_id}
              showSearch
              placeholder={"搜索任务"}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              optionLabelProp={"name"}
              autoFocus={true}
              onSearch={(input) => this.searchTeacherTask(teacher_id, input)}
              onSelect={(value) => this.setState({task_id: value})}
              notFoundContent={null}
            >
              {task_option}
            </Select>
          break;
      }
      return (
       new_homework_edit ?
        <Item>
          <div>
            <div style={{marginBottom: '0.5rem'}}>
              <a onClick={e => homework_type ?
                this.props.relateHomework(lesson_id, task_id, lesson_student)
                :
                this.props.addHomework(lesson_id, {
                  source_id: source_id,
                  create_user: teacher_id, 
                  task_type: task_type,
                  remark: task_type ? remark : JSON.stringify(remark_page),
                  task_count: task_count,
              }, lesson_student)} style={{marginRight: '0.5rem'}}>添加</a>
              <a onClick={e => this.props.editLesson('new_homework_edit', false)}>取消</a>
            </div>
            {edit_dom}
          </div>
        </Item>
        :
        <Item>
          <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" href="#">
              <Icon style={{ fontSize: "1rem", marginRight: "0.5rem" }} type="plus" />
              添加作业
            </a>
          </Dropdown>
        </Item>
      )
    }

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

    renderTaskSub(){
      let {source_type, task_type, remark, remark_page, page_input_visible} = this.state;
      //非教材类
      if(source_type){
        return (
          <div style={{width: 500}}>
            <Input placeholder="添加作业描述" value={this.state.remark} onChange={e => this.setState({remark: e.target.value})} />
          </div>
        ) 
      }else if(task_type){
        //自定义
        return(
          <Row type="flex" gutter={2} justify="space-between" align="middle">
            <Col span={20}>
              <Input placeholder="自定义内容" value={this.state.remark} onChange={e => this.setState({remark: e.target.value})} />
            </Col>
            <Col span={2}>
              <Icon type="snippets" onClick={e => this.setState({task_type: 0, task_count: remark_page.length})} />
            </Col>
          </Row>
        )
      }else{
        return (
          <div>
            <Row>
            <Col span={22}>
            {
              remark_page.map((tag, index) => 
                  <Tag key={tag} closable afterClose={(removedTag) => {
                    const tags = remark_page.filter(tag => tag !== removedTag);
                    this.setState({ remark_page: tags });
                  }}>
                    {'P ' + tag}
                  </Tag>
                )
            }
            {page_input_visible ? 
              <InputNumber
                size="small"
                onChange={(value) => this.setState({page: value})}
                onBlur={() => this.pageInputConfirm()}
              />              
              :
              <Tag
                onClick={e => this.setState({page_input_visible: true})}
                style={{ background: '#fff', borderStyle: 'dashed' }}
              >
                <Icon type="plus" /> 添加页码
              </Tag>
            }
            </Col>
            <Col span={2}>
              <Icon type="edit" onClick={e => this.setState({task_type: 2, task_count: 0.5})} />
            </Col>
            </Row>
          </div>
        )
      }      
    }


    renderHomework(){
      const {teacher_lesson, lesson_index} = this.props;
      let {homework, lesson_id, lesson_student} = teacher_lesson[lesson_index];
      const homework_list = homework ? homework.map((item, i) => {           
        return (
          <Item
            key={item.task_id}
            actions={[<Popconfirm title = "确定删除?" onConfirm ={() => this.props.deleteHomework(lesson_id, item.task_id, lesson_student)}>
                <Icon type="delete" />
              </Popconfirm>
              ]}
          >
            <Item.Meta
              title={<a style={{fontWeight: "bold"}}>{item.source_name}</a>}
              description={
                item.task_type ?
                <div>{item.remark}</div> 
                : 
                JSON.parse(item.remark).map((tag) => <Tag key={tag}>{'P ' + tag}</Tag>)}
            />
          </Item>        
        )
      }) : [];

      return(
        <List size={"small"}>
          {homework_list}
          {this.renderNewHomework()}
        </List>
      )
    }

    renderCourseAvatar(course_label){
      <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar>
      let ava_color = '';
      let ava_background = '';
      let text = '';
      switch (course_label){
        case '1':
          ava_color = '#28b6b6';
          ava_background = '#98ebe2';
          text = '数';
          break;
        case '2':
          ava_color = '#fef001';
          ava_background = '#fcffa1';
          text = '音';
          break;
        case '3':
          ava_color = '#f56a00';
          ava_background = '#fde3cf';
          text = '英';
          break;
        case '4':
          ava_color = '#0ebec4';
          ava_background = '#99fff5';
          text = '物';
          break;
        case '5':
          ava_color = '#3162e5';
          ava_background = '#b0cdff';
          text = '化';
          break;
        case '6':
          ava_color = '#eece2e';
          ava_background = '#fff9ab';
          text = '地';
          break;
        case '7':
          ava_color = '#ff9918';
          ava_background = '#ffda91';
          text = '语';
          break;
        case '8':
          ava_color = '#ff4640';
          ava_background = '#ffc3ba';
          text = '政';
          break;
        case '9':
          ava_color = '#d4b22a';
          ava_background = '#edde7b';
          text = '史';
          break;
        case '10':
          ava_color = '#28d900';
          ava_background = '#c8ffab';
          text = '生';
          break;
        default:
          break;
      }
      return (
        <Avatar style={{ color: ava_color, backgroundColor: ava_background, marginRight: "0.8rem" }}>{text}</Avatar>
      );
    }

    renderLessonBasic(){
      const {teacher_option, teacher_link_option, teacher_lesson, lesson_index, lesson_edit} = this.props;
      const {teacher_edit, assistant_edit} = lesson_edit;
      const {teacher_name, assistant_name, room_name, teacher_id, start_time, end_time, group_name, course_label, label_name, is_sign, lesson_id} = teacher_lesson[lesson_index];
      const {select_teacher, select_assistant} = this.state;
      const teacherOption = teacher_link_option.map((item) => <Option value={item.teacher_id.toString()}>{item.realname}</Option>)
      
      return(
        <div>
        <Row  gutter={2} type="flex" justify="space-between" align="middle">
          <Col span={16}>
            <div>        
              <div style={{fontWeight: 'bold', fontSize: '1.3rem'}} >
                {this.renderCourseAvatar(course_label)}
                {group_name}
              </div>
            </div>
          </Col>
          <Col span={6}>
            {is_sign ? 
              <div>
                <Button
                  style={{marginRight: "0.5rem"}} 
                  onClick={(e) => window.open('http://localhost:8000/teacher-zq/lesson_print/' + lesson_id)} 
                  size={"small"}>打印</Button>
                {this.renderLessonAward()}
              </div>
              :
              <Popconfirm placement="bottomRight" onConfirm={(e) => this.props.signLesson(lesson_id)} title="是否签到课程？" okText="确定" cancelText="取消">
                <Badge dot={true}><Button size={"small"}>未签到</Button></Badge>
              </Popconfirm>
            }
          </Col>
        </Row>
        <Row style={{marginTop: 20}} gutter={2} align="middle">
          <Col style={{color: '#a6a6a6'}} span={6}>
            <div><Icon style={{color: '#a6a6a6', marginRight: 10}} type="tags" theme="outlined" />课程标签</div>
          </Col>
          <Col span={16}>
            <div style={{fontSize: '1rem'}}>
              <Tag style={{marginRight: 10}} color="green">{label_name}</Tag>  
            </div>
          </Col>
        </Row>
        <Row style={{marginTop: 20}} gutter={2} align="middle">
          <Col span={6}>
            <div style={{color: '#a6a6a6'}}><Icon style={{color: '#a6a6a6', marginRight: 10}} type="calendar" theme="outlined" />上课时间</div>
          </Col>
          <Col span={16}>
            {
              lesson_edit.range_edit ?
              <div>
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  value={[moment(this.state.start_time), moment(this.state.end_time)]}
                  onChange={(value,dateString) => this.setState({start_time: dateString[0], end_time: dateString[1]})}
                  placeholder={['Start Time', 'End Time']}
                />
                <div style={{marginTop: 5}}>
                  <a onClick={e => this.props.updateLessonRange(lesson_id, this.state.start_time, this.state.end_time)}>确定</a>
                  <a onClick={e => this.props.editLesson('range_edit', false)} style={{marginLeft: 10}}>取消</a> 
                </div>
              </div>
              :
              <div style={{fontSize: '1rem', cursor: 'pointer'}} 
                  onClick={e => {
                    this.props.editLesson('range_edit', true);
                    // this.setState({start_time: start_time, end_time: end_time});
                  }}>
                {moment(start_time).format("YYYY-MM-DD HH:mm") + "  -  " + moment(end_time).format("HH:mm")}
              </div>
            }  
          </Col>
        </Row>
        <Row style={{marginTop: 20}} gutter={2} align="middle">
          <Col style={{color: '#a6a6a6'}} span={6}>
            <div><Icon style={{color: '#a6a6a6', marginRight: 10}} type="idcard" theme="outlined" />课室</div>
          </Col>
          <Col className="gutter-row" span={16}>
            <Tag style={{marginRight: 10}} color="#2db7f5">{room_name}</Tag>
          </Col>
        </Row>
        <Row style={{marginTop: 20}} gutter={2} align="middle">
          <Col span={6}>
            <div style={{color: '#a6a6a6'}}>
              <Icon style={{color: '#a6a6a6', marginRight: 10}} type="user-add" theme="outlined" />任课老师
            </div>
          </Col>
          <Col className="gutter-row" span={16}>
            {teacher_edit ?
              <div>
                <Select
                  placeholder={"选择任课老师"}
                  value={select_teacher}
                  onChange={(value) => this.setState({select_teacher: value})}
                  style={{ width: '12rem' }}
                >
                  {teacherOption}
                </Select>
                <a onClick={e => this.props.updateLessonTeacher(lesson_id, select_teacher)} style={{marginLeft: 10}}>确定</a>
                <a onClick={e => this.props.editLesson('teacher_edit', false)} style={{marginLeft: 10}}>取消</a>
              </div>
              :
              <div style={{cursor: 'pointer', }} onClick={e => {
                    this.props.editLesson('teacher_edit', true);
                    this.setState({select_teacher: teacher_id});
                  }}>
                {teacher_name}
              </div>
            }
          </Col>
        </Row>
        <Row style={{marginTop: 20}} gutter={2} align="middle">
          <Col span={6}>
            <div style={{color: '#a6a6a6'}}>
              <Icon style={{color: '#a6a6a6', marginRight: 10}} type="usergroup-add" theme="outlined" />助教
            </div>
          </Col>
          <Col className="gutter-row" span={16}>
            {assistant_edit ?
              <div>
                <Select
                  placeholder={"选择助教老师"}
                  allowClear={true}
                  value={select_assistant}
                  onChange={(value) => this.setState({select_assistant: value})}
                  style={{ width: '12rem' }}
                >
                  {teacherOption}
                </Select>
                <a onClick={e => this.props.updateLessonAssistant(lesson_id, select_assistant)} style={{marginLeft: 10}}>确定</a>
                <a onClick={e => this.props.editLesson('assistant_edit', false)} style={{marginLeft: 10}}>取消</a>
              </div>
              :
              <div style={{cursor: 'pointer', }} onClick={e => {
                    this.props.editLesson('assistant_edit', true);
                    this.setState({select_assistant: lesson.assistant_id});
                  }}>
                {assistant_name ? assistant_name : "NA"}
              </div>
            }
          </Col>
        </Row>

        </div>
      )
    }

    handleKpComment(lesson_id){
      const {select_student, kpid, kpname, kp_comment_content, side } = this.state;

      this.props.addLessonKpComment(lesson_id, select_student, {
          kpname: kpname,
          kpid: (kpid | 0) == kpid ? kpid : undefined, 
          kp_comment_content: this.state.kp_comment_content,
          comment_source: lesson_id,
          side: side,
          teacher_id: this.props.teacher_id,
        }, () => {
          this.props.selectLessonStudent({select_id: [], select_name: []})
          this.setState({
            kpid: undefined,
            side: 0,
            kp_comment_content: null,
          });
        }
      );
      
    }

    renderKpComment(){
      const {teacher_lesson, lesson_index, search_kp_label, lesson_edit, select_student } = this.props;
      let {kp_comment, lesson_student, lesson_id} = teacher_lesson[lesson_index];
      let {kp_comment_edit} = lesson_edit;
      let { kpid, kpname, kp_comment_content, side } = this.state;
      const kp_options = search_kp_label ? search_kp_label.map(d => <Option key={d.kpid}>{d.kpname}</Option>) : null;
      console.log(select_student);

      // if((lesson_student || []).length == 1){       
      //   select_student = {select_id: [lesson_student[0].student_id], select_name: [lesson_student[0].realname]};
      //   this.state.select_student = select_student;
      // }
      const [p_comment, n_comment] = (kp_comment || []).reduce(
        ([p_comment, n_comment], item, index) => {
          const itemDom = kp_comment_edit[index] ?
            <Item>
              <Item.Meta
                title={
                  <div>
                    <a onClick={e => this.props.updateKpComment({
                        kp_comment_content: this.state.edit_comment_content,
                    }, item.comment_id, () => {
                        this.props.getLessonKpComment(lesson_id);
                        this.props.editKpComment(index, false);
                    })} style={{marginRight: '0.5rem'}}>保存</a>
                    <a onClick={e => this.props.editKpComment(index, false)}>取消</a>
                  </div>
                }
                description={
                  <TextArea autosize={{ minRows: 2 }}
                    onChange={(e) => this.setState({edit_comment_content: e.target.value})} 
                    value={this.state.edit_comment_content}
                />
              }
              />
            </Item>
            :
            <List.Item actions={[<Icon type="edit" onClick={e => {
              this.props.editKpComment(index, true);
              this.setState({edit_comment_content: item.kp_comment_content});
            }} />,<Icon type="delete" onClick={e => this.props.deleteLessonKpComment(item.comment_id, lesson_id)}/>]}>
              <Item.Meta
                title={
                  <div>
                    <span style={{marginRight: "0.7rem", fontWeight: "bold"}}>#{item.kpname}#</span>
                    <a>{item.student_list}</a>
                  </div>
                }
                description={item.kp_comment_content}
              /> 
            </List.Item>

            return item.side ? [[...p_comment, itemDom], n_comment] : [p_comment, [...n_comment, itemDom]]
        }, [[], []])


      return(
        <div>
          <div>
            <Select
              mode="tags"
              style={{ width: 300 }}
              value={this.state.kpid}
              showSearch
              placeholder={"选择点评知识点"}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              autoFocus={true}
              onSearch={(input) => this.searchKpLabel(input)}
              onSelect={(value, option) => this.setState({kpid: value, kpname: option.props.children})}
              notFoundContent={null}
            >
              {kp_options}  
            </Select>
            <RadioGroup style={{marginLeft: "1rem"}} onChange={e => this.setState({side: e.target.value})} value={side}>
              <Radio value={1}><Icon style={{color: "#73d13d"}} type="like" /></Radio>
              <Radio value={0}><Icon style={{color: "#ffc53d"}} type="exclamation-circle" /></Radio>
            </RadioGroup>
          </div>
          <TextArea style={{marginTop: '0.5rem'}} placeholder="填写点评情况" autosize={{ minRows: 2 }}
            onChange={(e) => this.setState({kp_comment_content: e.target.value})} value={this.state.kp_comment_content}/>
          <div style={{textAlign: "right", marginTop: '1rem'}}>
            <Select
              mode="multiple"
              placeholder={"选择点评学生"}
              value={select_student.select_id}
              onChange={(value, option) => this.props.selectLessonStudent({
                select_id: value, 
                select_name: option.map(item => item.props.children)
              })}
              style={{ width: '12rem', marginRight: '1rem' }}
            >
              {
                (lesson_student || []).map(item => <Option key={item.student_id}>{item.realname}</Option>)
              }
            </Select>
            <Button 
              type="primary"
              disabled = {!(select_student.select_id && kp_comment_content && kpid)}
              onClick={() => this.handleKpComment(lesson_id, select_student)}>点评</Button>                
          </div>
          
            
          <Alert message="表扬进步" type="success" style={{background: "#FFF", marginTop: "1rem", marginBottom: "1rem"}} icon={<Icon type="like" />} 
            showIcon description={
            <List itemLayout="horizontal">
              {p_comment}
            </List>            
          } />

          <Alert message="存在问题" style={{background: "#FFF"}} type="warning" showIcon 
            description={
            <List
              itemLayout="horizontal"
            >
              {n_comment}
            </List>
          } />
            
        </div>
      )
    }

    handlePfComment(lesson_id){
      const {select_student, label_id, label_name, pf_comment_content} = this.state;
      this.props.addLessonPfComment(lesson_id, select_student, {
          label_name: label_name,
          label_id: (label_id | 0) == label_id ? label_id : undefined, 
          pf_comment_content: pf_comment_content,
          comment_source: lesson_id,
          teacher_id: this.props.teacher_id,
        }, () => {
          this.props.selectLessonStudent({select_id: [], select_name: []});
          this.setState({
            label_id : undefined,
            pf_comment_content : null,
          })
        }
      );      
    }

    renderPfComment(){
      const {teacher_lesson, lesson_index, search_pf_label, lesson_edit, select_student } = this.props;
      let {pf_comment, lesson_student, lesson_id} = teacher_lesson[lesson_index];
      let {pf_comment_edit} = lesson_edit;
      let { label_id, label_name, pf_comment_content} = this.state;
      const pf_options = search_pf_label ? search_pf_label.map(d => <Option key={d.label_id}>{d.label_name}</Option>) : null;
      pf_comment = pf_comment ? pf_comment : [];

      // if((lesson_student || []).length == 1){
      //   select_student = {select_id: [lesson_student[0].student_id], select_name: [lesson_student[0].realname]};
      //   this.state.select_student = select_student;
      // }

      const pf_comment_dom = (pf_comment || []).map((item, index) => (
          pf_comment_edit[index] ?
            <Item>
              <Item.Meta
                title={
                  <div>
                    <a onClick={e => this.props.updatePfComment({
                        pf_comment_content: this.state.edit_comment_content,
                    }, item.comment_id,
                    () => {
                        this.props.getLessonPfComment(lesson_id);
                        this.props.editPfComment(index, false);
                    })} style={{marginRight: '0.5rem'}}>保存</a>
                    <a onClick={e => this.props.editPfComment(index, false)}>取消</a>
                  </div>
                }
                description={
                  <TextArea autosize={{ minRows: 2 }}
                    onChange={(e) => this.setState({edit_comment_content: e.target.value})} 
                    value={this.state.edit_comment_content}
                />
              }
              />
            </Item>
            :
            <List.Item actions={[<Icon type="edit" onClick={e => {
              this.props.editPfComment(index, true);
              this.setState({edit_comment_content: item.pf_comment_content});
            }} />,<Icon type="delete" onClick={e => this.props.deleteLessonPfComment(item.comment_id, lesson_id)}/>]}>
              <Item.Meta
                title={
                  <div>
                    <span style={{marginRight: "0.7rem", fontWeight: "bold"}}>#{item.label_name}#</span>
                    <a>{item.student_list}</a>
                  </div>
                }
                description={item.pf_comment_content}
              /> 
            </List.Item>
          ))
      return(
        <div>
          <div>
            <Select
              mode="tags"
              style={{ width: 300 }}
              value={this.state.label_id}
              showSearch
              placeholder={"选择课堂表现标签"}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              autoFocus={true}
              onSearch={(input) => this.searchPfLabel(input)}
              onSelect={(value, option) => this.setState({label_id: value, label_name: option.props.children})}
              notFoundContent={null}
            >
              {pf_options}  
            </Select>
          </div>
          <TextArea style={{marginTop: '0.5rem'}} placeholder="填写点评情况" autosize={{ minRows: 2 }}
            onChange={(e) => this.setState({pf_comment_content: e.target.value})} value={this.state.pf_comment_content}/>
          <div style={{textAlign: "right", marginTop: '1rem'}}>
            <Select
              mode="multiple"
              placeholder={"选择点评学生"}
              value={select_student.select_id}
              onChange={(value, option) => this.props.selectLessonStudent({
                select_id: value, 
                select_name: option.map(item => item.props.children)
              })}
              style={{ width: '12rem', marginRight: '1rem' }}
            >
              {
                lesson_student ? 
                lesson_student.map(item => <Option key={item.student_id}>{item.realname}</Option>) : []
              }
            </Select>
            <Button 
              disabled={!(select_student && select_student.select_id && select_student.select_id.length)}
              type="primary"  
              onClick={() => this.handlePfComment(lesson_id)}>点评</Button>    
          </div>
          <div style={{display: (pf_comment || []).length ? 'block' :'none', 
              marginTop: "1rem", padding: "0 1rem 0 1rem", border: "1px solid #D3D3D3", borderRadius: "5px"}}>
            <List itemLayout="horizontal">
              {pf_comment_dom}  
            </List>             
          </div>
        </div>
      )
    }

    renderLessonAward(){
      let {teacher_lesson, lesson_index} = this.props;
      let {lesson_id, lesson_award, acc_award, lesson_student} = teacher_lesson[lesson_index];
      
      const isAward = lesson_award && lesson_award.length ? true : false;
      const content = ((isAward ? lesson_award : acc_award) || []).map(item => 
          <div style={{fontSize: "0.9rem"}}>
            <a style={{marginRight: "1rem"}}>{item.realname}</a>
            <IconFont type="icon-zuanshi1" />
            <span style={{marginLeft: "0.2rem"}}>x {item.award_count * 10}</span>
          </div>
      )

      const message = <div><span>每名学生均能获得基础奖励 </span><IconFont type="icon-zuanshi1" />
              <span style={{marginLeft: "0.2rem"}}>x 5</span></div>
      
      return(
        <Popover trigger="click" 
          content={
            <div>              
              {content}
              <Alert style={{marginTop: "1rem"}} message={message} type="info" showIcon />
            </div>
          } 
          title={
            <div style={{marginTop: "0.2rem", marginBottom: "0.2rem"}}>
              <span style={{fontWeight: "bold"}}>额外奖励</span>
              <Button type="primary" style={{marginLeft: "0.8rem", display: isAward ? "none" : "inline"}} 
                size="small" onClick={() => this.props.addLessonAward(lesson_id, acc_award, lesson_student)}>发布</Button>
            </div>}>
          <Button size="small" onClick={() => {
            if(!isAward){ 
              this.props.accLessonAward(lesson_id);
            }}}>奖励</Button>
        </Popover>
      )
    }

    render(){
      const {teacher_lesson, lesson_index } = this.props;
      let {is_sign} = teacher_lesson[lesson_index];
      return( 
      <Modal title={null} onCancel={()=>{
          this.props.editLesson("new_content_edit", false);
          this.props.editLesson('new_homework_edit', false);
          this.props.onhandleCancel(false);
          this.setState({
              kpid: undefined,
              side: 0,
              kp_comment_content: null,
          })
          this.props.selectLessonStudent({select_id: [], select_name: []});
        }}              
        footer={null}
        visible={this.state.visible} width={700} >
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">{this.renderLessonBasic()}</TabPane>
            <TabPane tab="课程内容" key="2">{this.renderLessonContent()}</TabPane>
            <TabPane tab="知识点点评" disabled={!is_sign} key="3">{this.renderKpComment()}</TabPane>
            <TabPane tab="课堂表现" disabled={!is_sign} key="4">{this.renderPfComment()}</TabPane>
          </Tabs> 
      </Modal>
      )
    }
    
    
}

export default connect(state => {
  const lesson_data = state.lessonData.toJS();
  const group_data = state.classGroupData.toJS();
  const personal_data = state.personalData.toJS();
  const {lesson_index, lesson_edit, teacher_lesson, select_student, reward} = lesson_data;
  const {classgroup_data} = group_data;
  const {teacher_option, search_teacher_task, teacher_link_option, search_kp_label, search_pf_label, search_task_source } = personal_data;
  const default_teacher_lesson = [{
    lesson_teacher: [],
    lesson_student: [],
    homework: [],
    lesson_content: [{content: "abc"}]
  }];
  

  return { 
    isFetching: state.fetchTestsData.get('isFetching'), 
    teacher_id:state.AuthData.get('userid'),
    teacher_lesson: teacher_lesson[0] ? teacher_lesson : default_teacher_lesson,
    lesson_index: lesson_index,
    lesson_edit: lesson_edit,
    select_student: select_student,
    teacher_option: teacher_option,
    teacher_link_option: teacher_link_option,
    search_teacher_task: search_teacher_task,
    search_kp_label: search_kp_label,
    search_pf_label: search_pf_label,
    search_task_source: search_task_source,
  }
}, action)(LessonViewModal);