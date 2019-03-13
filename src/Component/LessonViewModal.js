import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon,Spin,Table,Badge, Menu, Row, Col, Tabs, Button, Switch, DatePicker, Popconfirm, Select ,Avatar, Input, Checkbox,TreeSelect, Modal, List, Tag, Dropdown, InputNumber, Mention} from 'antd';
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
// renderNewHomework 摘取新建部分(){

class LessonViewModal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
          kp_tags: [],
          select_student: [],
          remark: [],
          task_type: 0,
          visible:false,
        };
        this.searchKpLabel = debounce(this.props.searchKpLabel, 500);
        this.searchCommentLabel = debounce(this.props.searchCommentLabel, 500);
        this.searchTaskSource = debounce(this.props.searchTaskSource, 500);
        this.searchTeacherTask = debounce(this.props.searchTeacherTask, 500);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.visible !== this.state.visible) {
        this.setState({ visible: nextProps.visible });
      }
    }

    renderContentItem(item, index){
      const {lesson_edit, search_teacher_task, search_result} = this.props;
      const {content_edit} = lesson_edit;
      let {kp_input_visible, kp_tags} = this.state;
      let item_title = ["课堂学习", "讲解知识", "课堂练习"];
      let edit_dom = [];
      let edit_icon_dom = 
        <Icon onClick={e => {
          this.props.editLessonContent(index, true);
          this.setState({
            content_type: item.content_type, 
            content: item.content, 
            resource: item.resource,
            kp_tags: item.kpids ? JSON.parse(item.kpids) : []
          });
        }} type="edit" theme="outlined" />;
      var tag_color = "";
      const {kp_label} = search_result; 
      const kp_options = kp_label ? kp_label.map(d => <Option key={d.kpid} group="kpid">{d.kpname}</Option>) : null;
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
                  <Tag key={tag.kpid} closable afterClose={(removedTag) => {
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
            edit_icon_dom = null;
            break;
        
      }
      return (
      content_edit[index] ?
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
            }}>{item_title[item.content_type]}</span> 
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
            }, index)}
            style={{marginRight: '0.5rem'}}>删除</a>
            <a onClick={e => this.props.editLessonContent(index, false)}>取消</a>
          </div>
          {edit_dom}
          </div>
        </Item>
        :
        <Item actions={[
            edit_icon_dom,
            <Icon onClick={e => this.props.deleteLessonContent({
              lesson_id: item.lesson_id,
              lesson_content_id: item.lesson_content_id,
            }, index)} type="delete" theme="outlined" />, 
          ]}>
          <span style={{
            width: "5rem", 
            fontWeight: "bold",
            textAlign: "right", 
            marginRight: "1rem", 
            paddingRight: "1rem", 
            borderRight: "2px solid #D3D3D3"
          }}>{item_title[item.content_type]}</span>
          <span style={{width: "25rem"}}>{item.content}</span>
        </Item>
      )
    }


    renderNewContent(){
      const {lesson, lesson_edit, test_option, search_result} = this.props;
      let {lesson_content} = lesson;
      let {new_content_edit} = lesson_edit;
      let {kp_input_visible, kp_tags} = this.state;
      let item_title = ["自定义", "讲解知识点", "课堂练习"];
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
          const {kp_label, comment_label} = search_result;
          const kp_options = kp_label ? kp_label.map(d => <Option key={d.kpid} group="kpid">{d.kpname}</Option>) : null;
          
          edit_dom = 
            <div>
              {kp_tags.map((tag, index) => 
                  <Tag key={tag.kpid} closable afterClose={(removedTag) => {
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
              value={this.state.resource}
              showSearch
              placeholder={"搜索任务"}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              optionLabelProp={"name"}
              autoFocus={true}
              onSearch={(input) => this.searchTeacherTask(teacher_id, input)}
              onSelect={(value, option) => this.setState({resource: value, content: option.props.name})}
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
            }}>{item_title[item.content_type]}</span> 
            <a onClick={e => this.props.addLessonContent({
                lesson_id: lesson.lesson_id,
                content: this.state.content,
                content_type: this.state.content_type,
                resource: this.state.resource,
                kpids: JSON.stringify(this.state.kp_tags),
            })} style={{marginRight: '0.5rem'}}>保存</a>
            <a onClick={e => this.props.editLesson('new_content_edit', false)}>取消</a>
          </div>
          {edit_dom}
          </div>
        </Item>
        :
        <Item>
          <Dropdown overlay={menu}>         
            <a className="ant-dropdown-link" href="#">
              <Icon style={{ fontSize: "1rem", marginRight: "0.5rem" }} type="plus" />
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
          <div style={{marginBottom: "1rem"}}>
            <Icon type="ordered-list" style={{color:"#D3D3D3"}}/>
            <span style={{fontSize: "1rem", color: "#D3D3D3", marginLeft: "0.5rem"}}>课堂</span>
          </div>
          <div style={{padding: "0.5rem 1rem 0px 1rem", border: "1px solid #D3D3D3", borderRadius: "5px"}}>
          <List split={false} size={"small"}>
            {content_list}
            {this.renderNewContent()}
          </List>
          </div>
          <div style={{marginTop: "1rem", marginBottom: "1rem"}}>
            <Icon type="ordered-list" style={{color:"#D3D3D3"}}/>
            <span style={{fontSize: "1rem", color: "#D3D3D3", marginLeft: "0.5rem"}}>作业</span>
          </div>
          <div style={{padding: "0px 1rem 0px 1rem", border: "1px solid #D3D3D3", borderRadius: "5px"}}>
            <List split={false} size={"small"}>
              {homework_list}
              {this.renderNewHomework()}
            </List>
          </div>
        </div>
      )
    }

    renderNewHomework(){
      const {lesson_edit, lesson, teacher_id, search_teacher_task, search_task_source} = this.props;
      const {new_homework_edit} = lesson_edit;
      const {lesson_student, lesson_id} = lesson;
      let edit_dom = [];
      const {task_type, task_count, source_id, source_type, remark} = this.state;

      const menu = (
        <Menu>
          <Menu.Item>
            <a onClick={e => {
              this.setState({homework_type: 0, content: "", resource: null});
              this.props.editLesson('new_homework_edit', true);
            }}>新建作业</a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={e => {
              this.setState({homework_type: 1, content: "", resource: null});
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
                  onSelect={(value, option) => this.setState({source_id: value, source_type: option.props.type, task_type: option.props.type})}
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
                <Switch style={{marginBottom: "0.2rem"}} checkedChildren="少量" unCheckedChildren="指定" 
                  onChange={checked => checked ? this.setState({task_type: 2, task_count: 0.5}) : this.setState({task_type: source_type, task_count: 0})} checked={this.state.task_type == 2} defaultChecked />
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
              <a onClick={e => this.props.addHomework(lesson_id, {
                  source_id: source_id,
                  create_user: teacher_id, 
                  task_type: task_type,
                  remark: task_type ? remark : JSON.stringify(remark),
                  task_count: task_count,
              }, lesson_student)} style={{marginRight: '0.5rem'}}>添加</a>
              <a onClick={e => this.props.editLesson('new_homework_edit', false)}>取消</a>
            </div>
            {edit_dom}
          </div>
        </Item>
        :
        <Item>
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" href="#">
              <Icon style={{ fontSize: "1rem", marginRight: "0.5rem" }} type="plus" />
              添加作业
            </a>
          </Dropdown>
        </Item>
      )
    }

    pageInputConfirm(){
      let {remark, page} = this.state;
      if (page && remark.indexOf(page) === -1) {
        remark = [...remark, page];
      }
      this.setState({
        task_count: remark.length,
        remark,
        page_input_visible: false,
        page: '',
      });
    }

    renderTaskSub(){
      let {remark, page_input_visible} = this.state;
      if(this.state.task_type){
        return (
          <div style={{width: 500}}>
            <Input placeholder="添加作业描述" value={this.state.remark} onChange={e => this.setState({remark: e.target.value})} />
          </div>
        ) 
      }else{
        return (
          <div>
            {
              remark.map((tag, index) => 
                  <Tag key={tag} closable afterClose={(removedTag) => {
                    const tags = this.state.remark.filter(tag => tag !== removedTag);
                    this.setState({ remark: tags });
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
          </div>
        )
      }      
    }

    renderHomeworkItem(item, index){
      const {lesson} = this.props;
      const {lesson_student, lesson_id} = lesson;
      const remark_dom = item.task_type ?
          <div>{item.remark}</div> 
          : 
          JSON.parse(item.remark).map((tag) => <Tag key={tag}>{'P ' + tag}</Tag>)
          // console.log("item.remark:",item.remark);
           
      return (
        <Item
          key={item.task_id}
          actions={[<Icon onClick = {e => this.props.deleteHomework(lesson_id, item.task_id, lesson_student)} type="delete" />]}
          
        >
          <Item.Meta
            title={<a style={{fontWeight: "bold"}}>{item.source_name}</a>}
            description={remark_dom}
          />
        </Item>        
      )
    }

    renderHomework(){
      const {lesson, lesson_edit} = this.props;
      let {homework} = lesson;
      const homework_list = homework.map((item, i) => this.renderHomeworkItem(item, i));
      return(
        <List itemLayout="horizontal" bordered>
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
          ava_color = '#f56a00';
          ava_background = '#fde3cf';
          text = '数';
          break;
        case '2':
          ava_color = '#f56a00';
          ava_background = '#fde3cf';
          text = '物';
          break;
        case '3':
          ava_color = '#f56a00';
          ava_background = '#fde3cf';
          text = '英';
          break;
        default:
          break;
      }
      return (
        <Avatar style={{ color: ava_color, backgroundColor: ava_background, marginRight: "0.8rem" }}>{text}</Avatar>
      );
    }

    onConfirm(e){

    }

    renderLessonBasic(){
      const {teacher_group, course_option, label_option, teacher_option, lesson, lesson_edit} = this.props;
      const {teacher_edit, assistant_edit} = lesson_edit;
      const {teacher_name, assistant_name} = lesson;
      const {select_teacher, select_assistant} = this.state;
      const group_option = teacher_group.map((item) => <Option value={item.stu_group_id}>{item.group_name}</Option>)
      const courseOption = course_option.map((item) => <Option value={item.course_label}>{item.course_label_name}</Option>)
      const labelOption = label_option.map((item) => <Option value={item.label_id}>{item.label_name}</Option>)
      const teacherOption = teacher_option.map((item) => <Option value={item.teacher_id.toString()}>{item.realname}</Option>)
      

      return(
        <div>
        <Row  gutter={2} type="flex" justify="space-between" align="middle">
          <Col span={18}>
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
            <div>        
              <div style={{fontWeight: 'bold', fontSize: '1.3rem', cursor: 'pointer',}} 
                  onClick={e => {
                    this.props.editLesson('group_edit', true);
                    this.setState({group_id: lesson.stu_group_id});
                  }}>
                {this.renderCourseAvatar(lesson.course_label)}
                {lesson.group_name}
                
              </div>
            </div>
            }
          </Col>
          <Col  span={4}>
            {/* <Popconfirm placement="bottomRight" onConfirm={(e) => this.onConfirm(e)} title="确定课程是否完成？" okText="确定" cancelText="取消">
              <Badge dot={true}><Button size={"small"}>未签到</Button></Badge>
            </Popconfirm> */}
            <Button type="primary" size={"small"}>已签到</Button>
          </Col>
        </Row>
        <Row style={{marginTop: 20}} gutter={2}>
          <Col style={{color: '#a6a6a6'}} span={6}>
            <div><Icon style={{color: '#a6a6a6', marginRight: 10}} type="tags" theme="outlined" />课程标签</div>
          </Col>
          <Col span={16}>
            {
              lesson_edit.label_edit ?
              <div>
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
                <div style={{marginTop: 5}}>
                  <a onClick={e => this.props.updateLessonRange(lesson.lesson_id, this.state.start_time.toDate(), this.state.end_time.toDate())}>确定</a>
                  <a onClick={e => this.props.editLesson('range_edit', false)} style={{marginLeft: 10}}>取消</a> 
                </div>
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

    // searchKpLabel(input){
    //   this.props.searchKp(input);
    //   if (this.timeout) {
    //     clearTimeout(this.timeout);
    //     this.timeout = null;
    //   }
    //   this.currentValue = input;
    //   this.timeout = setTimeout(this.props.searchKp(input), 300);
      
    // }

    renderTeacherComment(){
      const {lesson, search_result } = this.props;
      const {teacher_comment, lesson_student} = lesson;

      const {select_student} = this.state;
      const {comment_label, kp_label} = search_result;
      const kp_options = kp_label ? kp_label.map(d => <Option key={d.kpid} group="kpid">{d.kpname}</Option>) : null;
      const comment_options = comment_label ? comment_label.map(d => <Option group="comment" key={d.tweet_label_id}>{d.label_content}</Option>) : null;

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
            onSearch={(input) => this.searchCommentLabel(input)}
            onBlur={() => this.setState({editCommentLabel: false})}
            onSelect={(value, option) => this.setState({
              comment_label_id: value, 
              label_type: option.props.group, 
              comment_label: option.props.children, 
              editCommentLabel: false})}
            notFoundContent={null}
          >
            <OptGroup label="知识点问题">
              {kp_options}
            </OptGroup>
            <OptGroup label="课堂描述">
              {comment_options}
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

    render(){
      const {sub_view} = this.props.lesson_edit;
      return(
      <Modal title={null} onCancel={this.props.onCancel}        
        footer={null}
        visible={this.state.visible} width={700} >
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">{this.renderLessonBasic()}</TabPane>
            <TabPane tab="课程内容" key="2">{this.renderLessonContent()}</TabPane>
            <TabPane tab="课堂点评" key="3">{this.renderTeacherComment()}</TabPane>
          </Tabs> 
      </Modal>
      )
    }
    
    
}

export default connect(state => {
  const lesson_data = state.lessonData.toJS();
  const group_data = state.classGroupData.toJS();
  const personal_data = state.personalData.toJS();
  const {lesson, lesson_edit} = lesson_data;
  const {classgroup_data} = group_data;
  const {teacher_option, course_option, label_option, search_teacher_task, search_result, search_task_source } = personal_data;

  return { 
    isFetching: state.fetchTestsData.get('isFetching'), 
    teacher_id:state.AuthData.get('userid'),
    lesson: lesson,
    lesson_edit: lesson_edit,
    teacher_group: classgroup_data,
    teacher_option: teacher_option,
    course_option: course_option,
    label_option: label_option,
    search_teacher_task: search_teacher_task,
    search_result: search_result,
    search_task_source: search_task_source,
  }
}, action)(LessonViewModal);