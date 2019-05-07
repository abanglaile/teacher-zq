import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon,Spin,Table,Badge, Menu, Row, Col, Tabs, Popover, Progress, Radio, Button, Alert, DatePicker, Popconfirm, Select ,Avatar, Input, Checkbox,TreeSelect, Modal, List, Tag, Dropdown, InputNumber} from 'antd';
import *as action from '../Action/';
import {connect} from 'react-redux';

import Styles from '../styles/stuEvaluation.css';
import moment from 'moment';


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
          <Alert message={<span style={{fontSize: "1.2rem"}}>表扬进步</span>} type="success" style={{background: "#FFF", width: "95%", marginTop: "1rem", marginBottom: "1rem"}} icon={<Icon type="like" />} 
            showIcon description={
            <List itemLayout="horizontal">
              {p_comment}
            </List>            
          } />

          <Alert message={<span style={{fontSize: "1.2rem"}}>存在问题</span>} style={{background: "#FFF", width: "95%"}} type="warning" showIcon 
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
      console.log(lesson_student);
      return(
        <div className="print" style={{marginLeft: "60px", marginRight: "60px"}}>           
          <Select style={{ width: 120 }} 
            onSelect={(value, option) => this.setState({student_id: value, student_name: option.props.children})}>
            {(lesson_student || []).map(item => <Option value={item.student_id}>{item.student_name}</Option>)}
          </Select>          
          <div>
            <span style={{fontSize: "3rem"}}>李承耀 课堂报告</span>
            <span style={{marginLeft: "0.5rem", fontSize: "1rem", color: "rgba(0, 0, 0, 0.45)"}}>/喜悦教育 最专业的私人订制课程</span>
          </div>
          <div style={{fontSize: "1.5rem", color: '#a6a6a6'}}>{group_name + ' ' + label_name}</div>
          
          <Row justify="end" type="flex" style={{ marginTop: 20}} gutter={3} align="right">
            <Col span={2} style={{borderBottom: "1px solid "}}>
              <div style={{fontSize: "1rem", color: '#a6a6a6'}}><Icon style={{color: '#a6a6a6', marginRight: 10}} type="calendar" theme="outlined" />时间</div>
            </Col>
            <Col span={6} style={{borderBottom: "1px solid "}}>
              <div style={{fontSize: '1rem'}} >
                {moment(start_time).format("YYYY-MM-DD HH:mm") + "  -  " + moment(end_time).format("HH:mm")}
              </div> 
            </Col>
          </Row>

          <Row justify="end" type="flex" style={{ marginTop: 20}} gutter={3} align="right">
            <Col span={2} style={{borderBottom: "1px solid "}}>
              <div style={{fontSize: "1rem", color: '#a6a6a6'}}><Icon style={{color: '#a6a6a6', marginRight: 10}} type="user-add" theme="outlined" />老师</div>
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
          <div style={{marginTop: "3rem", fontSize: "1.8rem", fontWeight: "blod", borderBottom: "2px solid "}}>课堂内容</div>
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
          <div style={{marginTop: "3rem", fontSize: "1.8rem", fontWeight: "blod", borderBottom: "2px solid "}}>课后作业</div>
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