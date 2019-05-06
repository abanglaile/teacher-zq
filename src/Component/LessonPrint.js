import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon,Spin,Table,Badge, Menu, Row, Col, Tabs, Popover, Progress, Radio, Button, Alert, DatePicker, Popconfirm, Select ,Avatar, Input, Checkbox,TreeSelect, Modal, List, Tag, Dropdown, InputNumber} from 'antd';
import *as action from '../Action/';
import {connect} from 'react-redux';

import moment from 'moment';
import debounce from 'lodash/debounce';

const { SubMenu } = Menu;
const {sel, OptGroup}  = Select;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const Item = List.Item;
const RadioGroup = Radio.Group;

const { TextArea } = Input;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

class LessonViewModal extends React.Component{
    constructor(props){
      super(props);
      this.state = { 
        lesson_id : this.props.params.lesson_id,
      };
    }

    componentDidMount(){
      let {lesson_id, student_id} = this.state;
      lesson_id = "2c058d70-64f4-11e9-b050-cd91a2ea";
      student_id = "54d02180507611e9881259fe263fe740";
      this.props.getLessonStudent(lesson_id);
      this.props.getStudentOneLesson(lesson_id, student_id);      
    }
    
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
          <Col span={18}>
            <div>        
              <div style={{fontWeight: 'bold', fontSize: '1.3rem'}} >
                {this.renderCourseAvatar(course_label)}
                {group_name}
              </div>
            </div>
          </Col>
          <Col span={4}>
            {is_sign ? 
              <Button type="primary" size={"small"}>已签到</Button>
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
                  value={[this.state.start_time, this.state.end_time]}
                  onChange={(dates) => this.setState({start_time: dates[0], end_time: dates[1]})}
                  placeholder={['Start Time', 'End Time']}
                />
                <div style={{marginTop: 5}}>
                  <a onClick={e => this.props.updateLessonRange(lesson_id, this.state.start_time.toDate(), this.state.end_time.toDate())}>确定</a>
                  <a onClick={e => this.props.editLesson('range_edit', false)} style={{marginLeft: 10}}>取消</a> 
                </div>
              </div>
              :
              <div style={{fontSize: '1rem', cursor: 'pointer'}} 
                  onClick={e => {
                    this.props.editLesson('range_edit', true);
                    this.setState({start_time: moment(start_time), end_time: moment(end_time)});
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

    renderKpComment(){
      const { lesson } = this.props;
      let {kp_comment, lesson_id} = lesson;

      const [p_comment, n_comment] = (kp_comment || []).reduce(
        ([p_comment, n_comment], item, index) => {
          const itemDom = 
            <List.Item>
              <Item.Meta
                title={
                  <div>
                    <span style={{marginRight: "0.7rem", fontSize: "1rem", fontWeight: "bold"}}>#{item.kpname}#</span>
                  </div>
                }
                description={<span style={{fontSize: "1rem"}}>{item.kp_comment_content}</span>}
              /> 
            </List.Item>

            return item.side ? [[...p_comment, itemDom], n_comment] : [p_comment, [...n_comment, itemDom]]
        }, [[], []])


      return(
        <div>
          <div style={{marginTop: "4rem", fontSize: "1.8rem", fontWeight: "blod", borderBottom: "2px solid "}}>知识点点评</div>
          <Alert message={<span style={{fontSize: "1.2rem"}}>表扬进步</span>} type="success" style={{background: "#FFF", marginTop: "1rem", marginBottom: "1rem"}} icon={<Icon type="like" />} 
            showIcon description={
            <List itemLayout="horizontal">
              {p_comment}
            </List>            
          } />

          <Alert message={<span style={{fontSize: "1.2rem"}}>存在问题</span>} style={{background: "#FFF"}} type="warning" showIcon 
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


    renderPfComment(){
      const { lesson } = this.props;
      let {pf_comment, lesson_id} = lesson;

      return(
        <div>          
          <div style={{marginTop: "4rem", fontSize: "1.8rem", fontWeight: "blod", borderBottom: "2px solid "}}>课堂表现</div>
          <List itemLayout="horizontal">
            {
              (pf_comment || []).map((item, index) => (
                <List.Item> 
                  <Item.Meta
                    title={
                      <div>
                        <span style={{fontSize: "1rem", marginRight: "0.7rem", fontWeight: "bold"}}>#{item.label_name}#</span>
                      </div>
                    }
                    description={<span style={{fontSize: "1rem"}}>{item.pf_comment_content}</span>}
                  /> 
                </List.Item>
              ))
            }  
          </List>             
        </div>
      )
    }

    render(){
      let {pf_comment, lesson_student, lesson_content, homework, lesson_id, teacher_name, assistant_name, start_time, end_time, group_name, course_label, label_name} = this.props.lesson;
      const item_title = ["课堂学习", "知识讲解", "课堂练习"];
      const star = 5;
      let cols = [];
      for(let i = 0; i < star; i++){
        cols.push(
          <Icon type="star" style={{fontSize: "1.5rem", marginLeft: i ? "1rem" : 0}}/>
        )
      }
      return(
        <div style={{padding: "120px", width: "1075px", height: "1568px"}}>
          <Select style={{ width: 120 }} 
            onSelect={(value, option) => this.setState({student_id: value, student_name: option.props.children})}>
            {(lesson_student || []).map(item => <Option value={item.student_id}>{item.student_name}</Option>)}
          </Select>          
          <div style={{fontSize: "3rem"}}>李承耀 课堂报告</div>
          <div style={{fontSize: "1.5rem", color: '#a6a6a6'}}>{group_name + ' ' + label_name}</div>
          
          <Row justify="end" type="flex" style={{ marginTop: 20}} gutter={3} align="right">
            <Col span={2} style={{borderBottom: "1px solid "}}>
              <div style={{color: '#a6a6a6'}}><Icon style={{color: '#a6a6a6', marginRight: 10}} type="calendar" theme="outlined" />时间</div>
            </Col>
            <Col span={6} style={{borderBottom: "1px solid "}}>
              <div style={{fontSize: '1rem'}} >
                {moment(start_time).format("YYYY-MM-DD HH:mm") + "  -  " + moment(end_time).format("HH:mm")}
              </div> 
            </Col>
          </Row>

          <Row justify="end" type="flex" style={{ marginTop: 20}} gutter={3} align="right">
            <Col span={2} style={{borderBottom: "1px solid "}}>
              <div style={{color: '#a6a6a6'}}><Icon style={{color: '#a6a6a6', marginRight: 10}} type="user-add" theme="outlined" />老师</div>
            </Col>
            <Col span={6} style={{borderBottom: "1px solid "}}>
              <div style={{fontSize: '1rem'}} >
                {teacher_name + " " + assistant_name}
              </div> 
            </Col>
          </Row>

          <div style={{marginTop: "3rem", fontSize: "1.5rem", textAlign: "center"}}>
            <div>
              <span style={{marginRight: "0.5rem"}}>本节课成就</span>
            </div>
        
            <div>
              <Icon type="star" style={{fontSize: "1.5rem"}}/>
              <span style={{marginLeft: "0.5rem", fontSize: "1.5rem"}}>x 5</span>

            </div>
            <div style={{fontSize: "1rem"}}>领先53.2%的学生</div>
          </div>

          {this.renderKpComment()}
          {this.renderPfComment()}
          <div style={{marginTop: "4rem", fontSize: "1.8rem", fontWeight: "blod", borderBottom: "2px solid "}}>课堂内容</div>
          <List split={false} size={"small"}>
              {(lesson_content || []).map((item, i) => 
                <Item>
                  <List.Item.Meta
                    description={<div style={{color: "rgba(0, 0, 0, 0.65)", fontSize: "1rem"}}><span style={{
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
          </List>
          <div style={{marginTop: "4rem", fontSize: "1.8rem", fontWeight: "blod", borderBottom: "2px solid "}}>课后作业</div>
          <List split={false} size={"small"}>
            {(homework || []).map((item, index) => {
              const remark_str = item.type ? item.remark : JSON.parse(item.remark).map(item => 'P' + item).join(', ')
              return(
                <Item style={{fontSize: "1rem"}}>
                  <span>{index + 1 + "."}</span>
                  <span style={{ marginLeft: "0.5rem", marginRight: "1rem"}}>{item.source_name}</span>
                  <span>{remark_str}</span>                       
                </Item>
              )
            }  
            )}
          </List>  
        </div>
      )
    }
    
    
}

export default connect(state => {
  const lesson_data = state.lessonData.toJS();  

  return { 
    lesson: lesson_data.lesson,
  }
}, action)(LessonViewModal);