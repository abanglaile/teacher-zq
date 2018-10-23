import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon,Spin,Table, Menu, Row, Col, Tabs, Button,Breadcrumb, Radio, DatePicker, Popconfirm, Select ,Avatar, Input, Checkbox,TreeSelect,Modal, List, Tag} from 'antd';
import *as action from '../Action/';
import {connect} from 'react-redux';
// import {Link} from 'react-router';
import config from '../utils/Config';

import moment from 'moment';

const { SubMenu } = Menu;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
class LessonManager extends React.Component{
    constructor(props) {
        super(props);
        this.state={
          teacher_edit: false,
          group_edit: false,
          range_edit: false,
          course_edit: false,
          content_edit: false,
          select_teacher: [[], []],
          visible:false,teacher_id : 1,tree_value:[],treeData:[]};
    }

    componentDidMount(){
      this.props.getClassGroup(10001);
      this.props.getOptionData(10001, 1);
      this.props.getOneLesson('test');
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
        console.log(main_teacher, vice_teacher);
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

    renderLessonContent(){
      const {lesson, lesson_edit} = this.props;
      const {lesson_content} = lesson;
      lesson_content.map((item, i) => 
        lesson_edit.content_edit[i] ?
        <div>
          {item.content}
        </div>
        :
        <div>
          <Input placeholder="Basic usage" value={this.state.content[i]}/>
        </div>
      )
      return(
        <List
          header={<div>课堂内容</div>}
          footer={<div>Footer</div>}
          renderItem={item => (<List.Item>{item}</List.Item>)}>
          <List.Item actions={[<a onClick={e => this.props.editLesson('content_edit', false)}>edit</a>, <a>more</a>]}>
            <div>复习有理数概念定义</div>
            <Input placeholder="Basic usage" />
            <div>lesson_edit.content_edit ?</div>
          </List.Item>
          <List.Item>复习有理数概念定义</List.Item>
        </List>
      )
    }

    renderLessonModal(){
      const data = [
        '学习有理数加减法',
        '复习有理数概念定义',
      ];
      const {teacher_group, course_option, label_option, lesson, lesson_edit} = this.props;
      console.log(course_option);
      const {lesson_teacher} = lesson;
      const {select_teacher} = this.state;
      const group_option = teacher_group.map((item) => <Option value={item.stu_group_id}>{item.group_name}</Option>)
      const courseOption = course_option.map((item) => <Option value={item.course_id}>{item.course_name}</Option>)
      const labelOption = label_option.map((item) => <Option value={item.label_id}>{item.label_name}</Option>)

      return(
      <Modal title="课堂记录" onCancel={e => this.setState({view_modal: false})}
        visible={this.state.view_modal} width={650} style={{height:400}} footer={null}>
        {
          lesson_edit.group_edit ? 
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
                    onChange={(value) => this.setState({course_id: value})}
                    value={this.state.course_id}
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
                      this.setState({course_id: lesson.course_id, label_id: lesson.label_id});
                    }}>
                  <Tag style={{marginRight: 10}} color="green">{lesson.course_name}</Tag>
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
              {this.renderTeacherView(0)}
            </Col>
          </Row>
          <Row style={{marginTop: 20}} gutter={2}>
            <Col span={6}>
              <div style={{color: '#a6a6a6'}}>
                <Icon style={{color: '#a6a6a6', marginRight: 10}} type="usergroup-add" theme="outlined" />助教
              </div>
            </Col>
            <Col className="gutter-row" span={16}>
              {this.renderTeacherView(1)}
            </Col>
          </Row>
        
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

    renderNewModal(){
      const {teacher_group} = this.props;
      const {role_select, select_teacher} = this.state;
      const group_option = teacher_group.map((item) => <Option value={item.stu_group_id}>{item.group_name}</Option>)
      //const teacher_option = school_teacher.map((item) => <Option value={item.teacher_id.toString()}>{item.realname}</Option>)
      return (
        <Modal title="新建课堂" onOk={this.createModal}
          onCancel={e => this.setState({visible: false})}
          visible={this.state.visible} width={500} style={{height:400}} okText="确定">
          <div>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="选择学生分组"
              optionFilterProp="children"
              onChange={(value) => this.setState({group_id: value})}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {group_option}
            </Select> 
            
          </div>
          <div style={{marginTop: 15}}>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="选择科目"
              optionFilterProp="children"
              onChange={(value) => this.setState({course_id: value})}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="tom">Tom</Option>
            </Select>
            <Select
              showSearch
              style={{ marginLeft: 20, width: 200 }}
              placeholder="选择课程标签"
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="tom">Tom</Option>
            </Select>
          </div>
          <div style={{marginTop: 15}}>
            <Radio.Group value={this.state.role_select} onChange={(e) => this.setState({ role_select: e.target.value })}>
              <Radio.Button value="0">任课老师</Radio.Button>
              <Radio.Button value="1">助教</Radio.Button>
            </Radio.Group>
            <div style={{marginTop: 10}}>
              <Select
                mode="multiple"
                placeholder={this.state.role_select == "1" ? "选择助教" : "选择任课老师"}
                value={select_teacher[role_select]}
                onChange={(value) => this.selectTeacher(value)}
                style={{ width: '100%' }}
              >
                {}
              </Select>
            </div>
          </div>
          <div style={{marginTop: 15}}>
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              placeholder={['开始时间', '结束时间']}
            />
          </div>
        </Modal>
      )
    }

    render(){
      const {visible, treeData,tree_value} = this.state;
      const {tests,isFetching} = this.props;

      const data = [
  {
    title: '王悦思一对一英语',
  },
  {
    title: '王悦思一对一英语',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];
      return(
        <div>
            <Spin spinning={isFetching} />
            <div style={{marginBottom:"10px"}}>
              <Button 
                type="primary"  
                onClick={() => this.setState({visible: true})}
              >
                <Icon type="plus" />新建课堂
              </Button>
            </div>
            {this.renderLessonModal()}
            {this.renderNewModal()}
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={item => (
                <List.Item actions={[<a onClick={e => this.setState({view_modal: true})}>edit</a>, <a>more</a>]}>
                  <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={<div><a href="https://ant.design">{item.title}</a></div>}
                    description={<div>2018-10-01 9:00 - 2018-10-01 11:00</div>}
                  />
                  <Tag color="green">数学</Tag>
                  <Tag color="green">导学</Tag> 
                </List.Item>
              )}
            />
         </div>   
      );
    }
}

export default connect(state => {
  const lesson_data = state.lessonData.toJS();
  const group_data = state.classGroupData.toJS();
  const personal_data = state.personalData.toJS();
  const {lesson, lesson_edit} = lesson_data;
  const {classgroup_data} = group_data;
  const {teacher_option, course_option, label_option} = personal_data;
  console.log(personal_data);

  return { 
    isFetching: state.fetchTestsData.get('isFetching'), 
    teacher_id:state.AuthData.get('userid'),
    lesson: lesson,
    lesson_edit: lesson_edit,
    teacher_group: classgroup_data,
    teacher_option: teacher_option,
    course_option: course_option,
    label_option: label_option,
  }
}, action)(LessonManager);