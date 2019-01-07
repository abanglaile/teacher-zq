import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon,Spin,Table, Menu, Row, Col, Tabs, Button,Breadcrumb, Radio, DatePicker, Popconfirm, Select ,Avatar, Input, Checkbox,TreeSelect,Modal, List, Tag, Dropdown, Mention} from 'antd';
import *as action from '../Action/';
import {connect} from 'react-redux';
// import {Link} from 'react-router';
import config from '../utils/Config';

import moment from 'moment';
import debounce from 'lodash/debounce';

const { SubMenu } = Menu;
const {Option, OptGroup}  = Select;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const Item = List.Item;

const { TextArea } = Input;

const { toString, toContentState } = Mention;

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


          sub_view: false,
          new_view: false,
          select_teacher: [[], []],
          select_student: [],
          select_assistant: [],
          visible:false,
          teacher_id : 1,
        };
        this.searchKpLabel = debounce(this.searchKpLabel, 500);
    }

    componentDidMount(){
      this.props.getClassGroup(10001);
      this.props.getOptionData(10001, 1);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.visible !== this.state.visible) {
        this.setState({ visible: nextProps.visible });
      }
    }

    editTeacher(e){
      const {lesson_teacher} = this.props.lesson;
      this.props.editLesson('teacher_edit', true);
      let select_teacher = [[],[]];
      for(var i = 0; i < lesson_teacher.length; i++){
        select_teacher[lesson_teacher[i].role].push(lesson_teacher[i].teacher_id.toString());
      }
      this.setState({select_teacher: select_teacher});
    }

    renderTeacherView(role){
      const {teacher_option, lesson, lesson_edit} = this.props;
      const {lesson_teacher} = lesson;
      const {select_teacher} = this.state;
      const teacherOption = teacher_option.map((item) => <Option value={item.teacher_id.toString()}>{item.realname}</Option>)
      if(lesson_edit.teacher_edit){
        return(
          <div>
            <Select
              mode="multiple"
              placeholder={role ? "选择助教" : "选择任课老师"}
              value={select_teacher[role]}
              onChange={(value) => this.selectTeacher(value, role)}
              style={{ width: '100%' }}
            >
              {teacherOption}
            </Select>
            {
              role ?
              <span>
                <a onClick={e => this.updateLessonTeacher(lesson.lesson_id, select_teacher)} style={{marginLeft: 10}}>确定</a>
                <a onClick={e => this.props.editLesson('teacher_edit', false)} style={{marginLeft: 10}}>取消</a>
              </span>
              : null
            }
          </div>
        )
      }else{
        let main_teacher = [], vice_teacher = [];
        for(var i = 0; i < lesson_teacher.length; i++){
          if(lesson_teacher[i].role == "0"){
            main_teacher.push(<span>{lesson_teacher[i].realname}</span>)
          }else{
            vice_teacher.push(<span>{lesson_teacher[i].realname}</span>)
          }
        }

        if(main_teacher.length == 0){
          main_teacher.push(<span>NA</span>);
        }
        else if(vice_teacher.length == 0){
          vice_teacher.push(<span>NA</span>);
        }
        return(
          <div style={{cursor: 'pointer', }} onClick={e => this.editTeacher(e)}>
            <div>{ role ? vice_teacher : main_teacher}</div>
          </div>
        )  
      }
      
    }

    updateLessonTeacher(lesson_id, select_teacher){
      let lesson_teacher = [];
      for(var i = 0; i < select_teacher[0].length; i++){
        lesson_teacher.push({lesson_id: lesson_id, teacher_id: parseInt(select_teacher[0][i]), role: "0"});
      }
      for(var i = 0; i < select_teacher[1].length; i++){
        lesson_teacher.push({lesson_id: lesson_id, teacher_id: parseInt(select_teacher[1][i]), role: "1"});
      }
      this.props.updateLessonTeacher(lesson_id, lesson_teacher);
    }

    switchNewContent(type){
      this.setState({content_type: type, content: "", kp_tags: [], resource: null});
      this.props.editLesson('new_content_edit', true);
    }

    renderContentItem(item, index){
      const {lesson_edit, test_option, search_result} = this.props;
      const {content_edit} = lesson_edit;
      let {kp_input_visible, kp_tags} = this.state;
      let item_title = ["自定义", "讲解知识点", "讲解课件", "课堂小测"];
      let edit_dom = [];
      
      switch(this.state.content_type){
        case 0:
          edit_dom = 
            <div style={{width: 500}}>
              <Input placeholder="新建课堂内容" value={this.state.content} onChange={e => this.setState({content: e.target.value})} />
            </div>
          break;
        case 1:
          const search_options = search_result.map(d => <Option key={d.kpid}>{d.kpname}</Option>);
          edit_dom = 
            <div>
              {kp_tags.map((tag, index) => 
                  <Tag key={tag.kpid} closable={true} afterClose={(removedTag) => {
                    kp_tags = this.state.kp_tags.filter(tag => tag !== removedTag);
                    this.setState({ kp_tags, content: kp_tags.map(x => x.kpname).join("，")});
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
                  onSearch={(input) => this.searchKpLabel(input)}
                  onSelect={(value, option) => {
                    let new_tag = {kpid: value, kpname: option.props.children};
                    const kp_tags = this.state.kp_tags
                    if(kp_tags.indexOf(value) === -1){
                      kp_tags.push(new_Tag);
                      this.setState({kp_tags, content: kp_tags.map(x => x.kpname).join("，")})
                    }
                    this.setState({kp_input_visible: false});
                  }}
                >
                  {search_options}
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
        case 3:
          const test_options = test_option.map((item) =>  
            <Option value={item.test_id.toString()} name={item.test_name}>
              <div>{item.test_name}</div>
              <div>{item.enable_time ? "已发布" : "未发布"} | {item.group_time}</div>
            </Option>)
          edit_dom = 
            <Select
              showSearch
              showArrow={false}
              style={{ width: 500 }}
              placeholder="关联测试"
              optionFilterProp="children"
              onSelect={(value, option) => this.setState({resource: value, content: option.props.name})}
              optionLabelProp={"name"}
              value={this.state.resource}
              filterOption={false}
            >
              {test_options}
            </Select>
          break;
      }
      return (
      content_edit[index] ?
        <Item>
          <div>
          <div style={{marginBottom: '0.5rem'}}>
            {item_title[item.content_type]} | 
            <a onClick={e => this.props.updateLessonContent({
                lesson_id: item.lesson_id,
                content: this.state.content,
                resource: this.state.resource,
                kpids: JSON.stringify(this.state.kp_tags),
                lesson_content_id: item.lesson_content_id,
            }, index)} style={{marginLeft: '0.5rem', marginRight: '0.5rem'}}>保存</a>
            <a onClick={e => this.props.deleteLessonContent({
              lesson_id: item.lesson_id,
              lesson_content_id: item.lesson_content_id,
            }, index)}>删除</a>
            <a onClick={e => this.props.editLessonContent(index, false)}>取消</a>
          </div>
          {edit_dom}
          </div>
        </Item>
        :
        <Item onClick={e => {
            this.props.editLessonContent(index, true);
            this.setState({
              content_type: item.content_type, 
              content: item.content, 
              resource: item.resource,
              kp_tags: item.kpids ? JSON.parse(item.kpids) : []
            });
          }} actions={[<Icon type="right" theme="outlined" />]}>
          <div>{item_title[item.content_type]} | {item.content}</div>
        </Item>
      )
    }


    renderNewContent(){
      const {lesson, lesson_edit, test_option, search_result} = this.props;
      let {lesson_content} = lesson;
      let {new_content_edit} = lesson_edit;
      let {kp_input_visible, kp_tags} = this.state;
      let item_title = ["自定义", "讲解知识点", "讲解课件", "课堂小测"];
      let edit_dom = [];
      const menu = (
        <Menu>
          <Menu.Item>
            <a onClick={e => this.switchNewContent(1)}>知识点讲解</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={e => this.switchNewContent(2)}>测试</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={e => this.switchNewContent(3)}>评讲</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={e => this.switchNewContent(0)}>自定义</a>
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
          const search_options = search_result.map(d => <Option key={d.kpid}>{d.kpname}</Option>);
          edit_dom = 
            <div>
              {kp_tags.map((tag, index) => 
                  <Tag key={tag.kpid} closable={index !== 0} afterClose={(removedTag) => {
                    const tags = this.state.kp_tags.filter(tag => tag !== removedTag);
                    this.setState({ kp_tags: tags, content: kp_tags.map(x => x.kpname).join("，") });
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
                  {search_options}
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
        case 3:
          const test_options = test_option.map((item) =>  
            <Option value={item.test_id.toString()} name={item.test_name}>
              <div>{item.test_name}</div>
              <div>{item.enable_time ? "已发布" : "未发布"} | {item.group_time}</div>
            </Option>)
          edit_dom = 
            <Select
              showSearch
              showArrow={false}
              style={{ width: 500 }}
              placeholder="关联测试"
              optionFilterProp="children"
              onChange={(value) => this.setState({resource: value, content: option.props.name})}
              optionLabelProp={"name"}
              value={this.state.resource}
              filterOption={false}
            >
              {test_options}
            </Select>
          break;
      }

      return (
       new_content_edit ?
        <Item>
          <div>
          <div style={{marginBottom: '0.5rem'}}>
            {item_title[this.state.content_type]} | 
            <a onClick={e => this.props.addLessonContent({
                lesson_id: lesson.lesson_id,
                content: this.state.content,
                content_type: this.state.content_type,
                resource: this.state.resource,
                kpids: JSON.stringify(this.state.kp_tags),
            })} style={{marginLeft: '0.5rem', marginRight: '0.5rem'}}>保存</a>
            <a onClick={e => this.props.editLesson('new_content_edit', false)}>取消</a>
          </div>
          {edit_dom}
          </div>
        </Item>
        :
        <Item>
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" href="#">
              添加内容
            </a>
          </Dropdown>
        </Item>
      )
    }

    renderLessonContent(){
      let {lesson_content, homework} = this.props.lesson;
      let content_list = lesson_content.map((item, i) => this.renderContentItem(item, i));
      const homework_list = homework.map((item, i) => this.renderHomeworkItem(item, i));
      return(
        <div>
          <List header={<div>内容</div>}>
            {content_list}
            {this.renderNewContent()}
          </List>
          <List header={<div>作业</div>}>
            {homework_list}
            {this.renderNewHomework()}
          </List>
        </div>
      )
    }

    renderNewHomework(){
      const {lesson_edit, lesson, test_option} = this.props;
      const {new_homework_edit} = lesson_edit;
      let edit_dom = [];

      const menu = (
        <Menu>
          <Menu.Item>
            <a onClick={e => {
              this.setState({homework_type: 1, content: "", resource: null});
              this.props.editLesson('new_homework_edit', true);
            }}>测试</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={e => {
              this.setState({homework_type: 0, content: "", resource: null});
              this.props.editLesson('new_homework_edit', true);
            }}>自定义</a>
          </Menu.Item>
        </Menu>
      );
      switch(this.state.homework_type){
        case 0:
          edit_dom = 
            <div style={{width: 500}}>
              <Input placeholder="课后作业" value={this.state.content} onChange={e => this.setState({content: e.target.value})} />
            </div>
          break;
        case 1:
          const test_options = test_option.map((item) =>  
            <Option value={item.test_id.toString()} name={item.test_name}>
              <div>{item.test_name}</div>
              <div>{item.enable_time ? "已发布" : "未发布"} | {item.group_time}</div>
            </Option>)
          edit_dom = 
            <Select
              showSearch
              showArrow={false}
              style={{ width: 500 }}
              placeholder="关联测试"
              optionFilterProp="children"
              onSelect={(value, option) => this.setState({resource: value, content: option.props.name})}
              optionLabelProp={"name"}
              value={this.state.resource}
              filterOption={false}
            >
              {test_options}
            </Select>
          break;
      }
      return (
       new_homework_edit ?
        <Item>
          <div>
          <div style={{marginBottom: '0.5rem'}}>
            <a onClick={e => this.props.addHomework({
                lesson_id: lesson.lesson_id,
                content: this.state.content,
                homework_type: this.state.homework_type,
                resource: this.state.resource,
            })} style={{marginLeft: '0.5rem', marginRight: '0.5rem'}}>保存</a>
            <a onClick={e => this.props.editLesson('new_homework_edit', false)}>取消</a>
          </div>
          {edit_dom}
          </div>
        </Item>
        :
        <Item>
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" href="#">
              添加内容
            </a>
          </Dropdown>
        </Item>
      )
    }

    renderHomeworkItem(item, index){
      const {lesson_edit, test_option} = this.props;
      const {homework_edit} = lesson_edit;
      let edit_dom = [];
      
      switch(this.state.homework_type){
        case 0:
          edit_dom = 
            <div style={{width: 500}}>
              <Input placeholder="自定义作业内容" value={this.state.content} onChange={e => this.setState({content: e.target.value})} />
            </div>
          break;
        case 1:
          const test_options = test_option.map((item) =>  
            <Option value={item.test_id.toString()} name={item.test_name}>
              <div>{item.test_name}</div>
              <div>{item.enable_time ? "已发布" : "未发布"} | {item.group_time}</div>
            </Option>)
          edit_dom = 
            <Select
              showSearch
              showArrow={false}
              style={{ width: 500 }}
              placeholder="关联测试"
              optionFilterProp="children"
              onSelect={(value, option) => this.setState({resource: value, content: option.props.name})}
              optionLabelProp={"name"}
              value={this.state.resource}
              filterOption={false}
            >
              {test_options}
            </Select>
          break;
      }
      return (
       homework_edit[index] ?
        <Item>
          <div>
          <div style={{marginBottom: '0.5rem'}}>
            {item_title[item.content_type]} | 
            <a onClick={e => this.props.updateHomework({
                lesson_id: item.lesson_id,
                content: this.state.content,
                resource: this.state.resource,
                homework_id: item.homework_id,
            }, index)} style={{marginLeft: '0.5rem', marginRight: '0.5rem'}}>保存</a>
            <a onClick={e => this.props.deleteHomework({
              lesson_id: item.lesson_id,
              homework_id: item.homework_id,
            }, index)}>删除</a>
            <a onClick={e => this.props.editLessonHomework(index, false)}>取消</a>
          </div>
          {edit_dom}
          </div>
        </Item>
        :
        <Item onClick={e => {
            this.props.editLessonHomework(index, true);
            this.setState({
              homework_type: item.content_type, 
              content: item.content, 
              resource: item.resource,
            });
          }} actions={[<Icon type="right" theme="outlined" />]}>
          <div>{item.content}<Icon type="link"></Icon></div>
        </Item>
      )
    }

    renderHomework(){
      const {lesson, lesson_edit} = this.props;
      let {homework} = lesson;
      const homework_list = homework.map((item, i) => this.renderHomeworkItem(item, i));
      return(
        <List>
          {homework_list}
          {this.renderNewHomework()}
        </List>
      )
    }
    

    

    renderLessonBasic(){
      const {teacher_group, course_option, label_option, teacher_option, lesson, lesson_edit} = this.props;
      const {teacher_edit, assistant_edit} = lesson_edit;
      const {teacher_name, assistant_name} = lesson;
      const {select_teacher, select_assistant} = this.state;
      const group_option = teacher_group.map((item) => <Option value={item.stu_group_id}>{item.group_name}</Option>)
      const courseOption = course_option.map((item) => <Option value={item.course_id}>{item.course_name}</Option>)
      const labelOption = label_option.map((item) => <Option value={item.label_id}>{item.label_name}</Option>)
      const teacherOption = teacher_option.map((item) => <Option value={item.teacher_id.toString()}>{item.realname}</Option>)
      

      return(
        <div>
        
        {lesson_edit.group_edit ? 
        <div>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="选择学生分组"
            optionFilterProp="children"
            onChange={(value) => this.setState({group_id: value})}
            value={this.state.group_id}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {group_option}
          </Select>
          <a onClick={e => this.props.updateLessonGroup(lesson.lesson_id, this.state.group_id)} style={{marginLeft: 10}}>确定</a>
          <a onClick={e => this.props.editLesson('group_edit', false)} style={{marginLeft: 10}}>取消</a> 
        </div>
        :
        <div style={{fontWeight: 'bold', fontSize: '1.5rem', cursor: 'pointer',}} 
            onClick={e => {
              this.props.editLesson('group_edit', true);
              this.setState({group_id: lesson.stu_group_id});
            }}>
          {lesson.group_name}
          
        </div>
        }
        <Row style={{marginTop: 20}} gutter={2}>
          <Col style={{color: '#a6a6a6'}} span={6}>
            <div><Icon style={{color: '#a6a6a6', marginRight: 10}} type="tags" theme="outlined" />课程标签</div>
          </Col>
          <Col span={16}>
            {
              lesson_edit.label_edit ?
              <div>
                <Select
                  disabled
                  style={{ marginRight: 10, width: 120 }}
                  placeholder="选择学科"
                  optionFilterProp="children"
                  onChange={(value) => this.setState({course_label: value})}
                  value={this.state.course_label}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {courseOption}
                </Select>
                <Select
                  showSearch
                  style={{ width: 120 }}
                  placeholder="选择标签"
                  optionFilterProp="children"
                  onChange={(value) => this.setState({label_id: value})}
                  value={this.state.label_id}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {labelOption}
                </Select>
                <a onClick={e => this.props.updateLessonLabel(lesson.lesson_id, this.state.label_id)} style={{marginLeft: 10}}>确定</a>
                <a onClick={e => this.props.editLesson('label_edit', false)} style={{marginLeft: 10}}>取消</a> 
              </div>
              :
              <div style={{fontSize: '1rem', cursor: 'pointer'}} 
                  onClick={e => {
                    this.props.editLesson('label_edit', true);
                    this.setState({course_label: lesson.course_label, label_id: lesson.label_id});
                  }}>
                <Tag style={{marginRight: 10}} color="green">{lesson.course_label_name}</Tag>
                <Tag style={{marginRight: 10}} color="green">{lesson.label_name}</Tag>  
              </div>
            }
          </Col>
        </Row>
        <Row style={{marginTop: 20}} gutter={2}>
          <Col span={6}>
            <div style={{color: '#a6a6a6'}}><Icon style={{color: '#a6a6a6', marginRight: 10}} type="calendar" theme="outlined" />上课时间</div>
          </Col>
          <Col className="gutter-row" span={16}>
            {
              lesson_edit.range_edit ?
              <div>
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  value={[this.state.start_time, this.state.end_time]}
                  onChange={(dates) => this.setState({start_time: dates[0], end_time: dates[1]})}
                  placeholder={['Start Time', 'End Time']}
                />
                <a onClick={e => this.props.updateLessonRange(lesson.lesson_id, this.state.start_time.toDate(), this.state.end_time.toDate())} style={{marginLeft: 10}}>确定</a>
                <a onClick={e => this.props.editLesson('range_edit', false)} style={{marginLeft: 10}}>取消</a> 
              </div>
              :
              <div style={{fontSize: '1rem', cursor: 'pointer'}} 
                  onClick={e => {
                    this.props.editLesson('range_edit', true);
                    this.setState({start_time: moment(lesson.start_time), end_time: moment(lesson.end_time)});
                  }}>
                {moment(lesson.start_time).format("YYYY-MM-DD HH:mm") + "  -  " + moment(lesson.end_time).format("YYYY-MM-DD HH:mm")}
              </div>
            }  
          </Col>
        </Row>
        <Row style={{marginTop: 20}} gutter={2}>
          <Col style={{color: '#a6a6a6'}} span={6}>
            <div><Icon style={{color: '#a6a6a6', marginRight: 10}} type="idcard" theme="outlined" />课室</div>
          </Col>
          <Col className="gutter-row" span={16}>
            <Tag style={{marginRight: 10}} color="#2db7f5">{lesson.room_name}</Tag>
          </Col>
        </Row>
        <Row style={{marginTop: 20}} gutter={2}>
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
                <a onClick={e => this.props.updateLessonTeacher(lesson.lesson_id, select_teacher)} style={{marginLeft: 10}}>确定</a>
                <a onClick={e => this.props.editLesson('teacher_edit', false)} style={{marginLeft: 10}}>取消</a>
              </div>
              :
              <div style={{cursor: 'pointer', }} onClick={e => {
                    this.props.editLesson('teacher_edit', true);
                    this.setState({select_teacher: lesson.teacher_id});
                  }}>
                {teacher_name}
              </div>
            }
          </Col>
        </Row>
        <Row style={{marginTop: 20}} gutter={2}>
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
                  value={select_assistant}
                  onChange={(value) => this.setState({select_assistant: value})}
                  style={{ width: '12rem' }}
                >
                  {teacherOption}
                </Select>
                <a onClick={e => this.props.updateLessonAssistant(lesson.lesson_id, select_assistant)} style={{marginLeft: 10}}>确定</a>
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

    render(){
      const {sub_view} = this.props.lesson_edit;
      return(
      <Modal title={null} onCancel={e => this.setState({visible: false})}
        visible={this.state.visible} width={700} >
          <Tabs defaultActiveKey="1" >
            <TabPane tab="基本信息" key="1">{this.renderLessonBasic()}</TabPane>
            <TabPane tab="课程内容" key="2">{this.renderLessonContent()}</TabPane>
            <TabPane tab="课堂点评" key="3">{this.renderTeacherComment()}</TabPane>
          </Tabs> 
      </Modal>
      )
    }

    selectTeacher(teacher_arr, role){
      const {select_teacher} = this.state;
      select_teacher[role] = teacher_arr;
      let un_select = role ? 0 : 1;
      let other_teacher = select_teacher[un_select];
      for(var j = 0; j < teacher_arr.length; j++){
        for(var i = 0; i < other_teacher.length; i++){
          if(other_teacher[i] == teacher_arr[j])
            other_teacher.splice(i, 1);
        }
      }
      this.setState({select_teacher: select_teacher});
    }


    searchKpLabel(input){
      this.props.searchKp(input);
      // if (this.timeout) {
      //   clearTimeout(this.timeout);
      //   this.timeout = null;
      // }
      // this.currentValue = input;
      // this.timeout = setTimeout(this.props.searchKp(input), 300);
      
    }

    renderTeacherComment(){
      const {lesson, search_result, } = this.props;
      const {teacher_comment, lesson_student} = lesson;

      const {select_student} = this.state;

      const options = search_result.map(d => <Option key={d.kpid}>{d.kpname}</Option>);
      return(
        <div>
          <div>
        {
          this.state.editCommentLabel || !this.state.comment_label_id ?
          <Select
            style={{ width: 300 }}
            value={this.state.comment_label_id}
            showSearch
            placeholder={"课堂描述/知识点"}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            autoFocus={true}
            onSearch={(input) => this.searchKpLabel(input)}
            onBlur={() => this.setState({editCommentLabel: false})}
            onSelect={(value, option) => this.setState({
              comment_label_id: value, 
              label_type: option.props.group, 
              comment_label: option.props.children, 
              editCommentLabel: false})}
            notFoundContent={null}
          >
            <OptGroup label="知识点问题">
              {options}
            </OptGroup>
            <OptGroup label="课堂描述">
              <Option value="Are you kidding" group="label">Mika最可爱</Option>
            </OptGroup>  
          </Select>
          :
          <Tag style={{height: '1.5rem'}} onClick={e => this.setState({editCommentLabel: true})}>{this.state.comment_label}</Tag>
        }
          </div>
          <TextArea style={{marginTop: '1rem'}} placeholder="Basic usage" autosize={{ minRows: 3 }}
            onChange={(e) => this.setState({comment_content: e.target.value})} value={this.state.comment_content}/>
          <div style={{textAlign: "right", marginTop: '1rem'}}>
              <Select
                mode="multiple"
                placeholder={"选择可见范围"}
                value={select_student}
                onChange={(value) => this.setState({select_student: value})}
                style={{ width: '12rem', marginRight: '1rem' }}
              >
                {
                  lesson_student.map(item => <Option key={item.student_id}>{item.realname}</Option>)
                }
              </Select>
              <Button 
              type="primary"  
              onClick={() => this.props.addTeacherComment(this.state.comment_label_id, 
                this.state.label_type,
                this.state.select_student, 
                {
                  comment_content: this.state.comment_content,
                  lesson_id: lesson.lesson_id,
                  comment_label: this.state.comment_label,
                  teacher_id: this.props.teacher_id,
                }
              )}
            >点评</Button>
          </div>
          <List
            itemLayout="horizontal"
            dataSource={teacher_comment}
            renderItem={item => (
              <List.Item>
                <div>
                  <div style={{marginBottom: '0.5rem'}}>
                    <Tag>{item.comment_label}</Tag>
                    <a onClick={e => this.props.deleteTeacherComment(item.comment_id)}>删除</a></div>
                  <div>{item.comment_content}</div>
                </div>
              </List.Item>
            )}
          />

        </div>
      )
    }
    
    
}

export default connect(state => {
  const lesson_data = state.lessonData.toJS();
  const group_data = state.classGroupData.toJS();
  const personal_data = state.personalData.toJS();
  const {lesson, lesson_edit} = lesson_data;
  const {classgroup_data} = group_data;
  const {teacher_option, course_option, label_option, test_option, search_result } = personal_data;

  return { 
    isFetching: state.fetchTestsData.get('isFetching'), 
    teacher_id:state.AuthData.get('userid'),
    lesson: lesson,
    lesson_edit: lesson_edit,
    teacher_group: classgroup_data,
    teacher_option: teacher_option,
    course_option: course_option,
    label_option: label_option,
    test_option: test_option,
    search_result: search_result,
  }
}, action)(LessonViewModal);