import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon,Spin,Table, Menu, Row, Col, Tabs, Button,Breadcrumb, DatePicker, Popconfirm, Select ,Avatar, Input, Checkbox,TreeSelect,Modal, List, Tag, Dropdown, Mention} from 'antd';
import *as action from '../Action/';
import {connect} from 'react-redux';
// import {Link} from 'react-router';
import LessonViewModal from './LessonViewModal.js';

import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
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

class LessonManager extends React.Component{
    constructor(props) {
        super(props);
        this.state={
          kp_tags: [],
          select_teacher: "10001",
          select_student: [],
          range_time: [],
          visible:false,
          teacher_id : 1,
        };
        this.searchKpLabel = debounce(this.searchKpLabel, 500);
    }

    componentDidMount(){
      this.props.getClassGroup(10001);
      this.props.getOptionData(10001, 1);
      this.props.getTeacherLesson({teacher_id: 10001});//teacher_id 为10001 暂时
    }


    createNewLesson(){
      const {group_id, room_id, course_label, label_id, select_teacher, select_assistant, range_time} = this.state;
      var new_lesson = {
        stu_group_id : group_id,
        room_id : room_id,
        course_label : course_label,
        label_id : label_id,
        teacher_id : select_teacher,
        assistant_id : select_assistant,
        start_time : range_time[0],
        end_time : range_time[1],
      };
      this.setState({visible: false});
      this.props.addNewLesson(new_lesson);
    }

    renderNewModal(){
      const {teacher_group, course_option, label_option, teacher_option, room_option} = this.props;
      const {select_teacher, select_assistant} = this.state;
      const group_option = teacher_group.map((item) => <Option value={item.stu_group_id}>{item.group_name}</Option>)
      const courseOption = course_option.map((item) => <Option value={item.course_label}>{item.course_label_name}</Option>)
      const labelOption = label_option.map((item) => <Option value={item.label_id}>{item.label_name}</Option>)
      const teacherOption = teacher_option.map((item) => <Option value={item.teacher_id.toString()}>{item.realname}</Option>)
      const roomOption = room_option.map((item) => <Option value={item.room_id}>{item.room_name}</Option>)
      // const teacher_option = school_teacher.map((item) => <Option value={item.teacher_id.toString()}>{item.realname}</Option>)
      return (
        <Modal title="新建课堂" onOk={(e) => this.createNewLesson()}
          onCancel={e => this.setState({visible: false})}
          okText="新建"
          cancelText="取消"
          visible={this.state.visible} width={500} style={{height:400} }>
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
            
            <Select
              showSearch
              style={{ marginLeft: 20, width: 200 }}
              placeholder="选择课室"
              optionFilterProp="children"
              onChange={(value) => this.setState({room_id: value})}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {roomOption}
            </Select> 
          </div>
          <div style={{marginTop: 15}}>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="选择学科"
              optionFilterProp="children"
              onChange={(value) => this.setState({course_label: value})}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {courseOption}
            </Select>

            <Select
              showSearch
              style={{ marginLeft: 20, width: 200 }}
              placeholder="选择课程标签"
              optionFilterProp="children"
              onChange={(value) => this.setState({label_id: value})}
              value={this.state.label_id}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {labelOption}
            </Select>
          </div>

          <div style={{marginTop: 15}}>
            <Select
              placeholder={"选择任课老师"}
              value={select_teacher}
              onChange={(value) => this.setState({select_teacher: value})}
              style={{ width: '200' }}
            >
              {teacherOption}
            </Select>

            <Select
              placeholder="选择助教老师"
              style={{ marginLeft: 20, width: 200 }}
              onChange={(value) => this.setState({select_assistant: value})}
              value={select_assistant}
            >
              {teacherOption}
            </Select>
          </div>

          <div style={{marginTop: 15}}>
            <RangePicker
              locale={locale}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              placeholder={['开始时间', '结束时间']}
              onChange={(value,dateString) => this.setState({range_time: dateString})}
            />
          </div>
        </Modal>
      )
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
        <Avatar style={{ color: ava_color, backgroundColor: ava_background }}>{text}</Avatar>
      );
    }

    renderQueryOption(){
      const {teacher_group, course_option, label_option, teacher_option} = this.props;
      const {select_teacher, select_assistant, range_time, group_id, course_label, label_id} = this.state;
      const group_option = teacher_group.map((item) => <Option value={item.stu_group_id}>{item.group_name}</Option>)
      const courseOption = course_option.map((item) => <Option value={item.course_label}>{item.course_label_name}</Option>)
      const labelOption = label_option.map((item) => <Option value={item.label_id}>{item.label_name}</Option>)
      const teacherOption = teacher_option.map((item) => <Option value={item.teacher_id.toString()}>{item.realname}</Option>)
      
      return(
      <div>
        <div>
          <Select
            showSearch
            style={{ width: 150 }}
            placeholder="选择学生分组"
            optionFilterProp="children"
            onChange={(value) => this.setState({group_id: value})}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {group_option}
          </Select> 
          <Select
            showSearch
            style={{ marginLeft: "1rem", width: 150 }}
            placeholder="选择学科"
            optionFilterProp="children"
            onChange={(value) => this.setState({course_label: value})}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {courseOption}
          </Select>

          <Select
            showSearch
            style={{ marginLeft: "1rem", width: 150 }}
            placeholder="选择课程标签"
            optionFilterProp="children"
            onChange={(value) => this.setState({label_id: value})}
            value={this.state.label_id}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {labelOption}
          </Select>
        </div>
        <div style={{marginTop: "1rem"}}>
          <RangePicker
            locale={locale}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={['开始时间', '结束时间']}
            onChange={(value,dateString) => this.setState({range_time: dateString})}
          /> 
          <Select
            placeholder={"选择任课老师"}
            value={select_teacher}
            onChange={(value) => this.setState({select_teacher: value})}
            style={{ marginLeft: "1rem", width: "120" }}
          >
            {teacherOption}
          </Select>
          <Button 
            style={{marginLeft: "1rem"}}
            type="primary"  
            onClick={() => this.props.getTeacherLesson({
              teacher_id: select_teacher, 
              start_time: range_time[0], 
              end_time: range_time[1], 
              group_id: group_id,
              course_label: course_label, 
              label_id: label_id,
            })}
          >
            查询
          </Button>
        </div>
        </div>
      )
    }
    
    render(){
      const {visible, treeData,tree_value} = this.state;
      const {tests,teacher_lesson,isFetching} = this.props;

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
            {this.renderQueryOption()}
            <LessonViewModal visible={this.state.view_modal} onCancel={e => this.setState({view_modal: false})}/>
            {this.renderNewModal()}
            <List
              // itemLayout="vertical"
              size="large"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              dataSource={teacher_lesson}
              renderItem={item => (
                <List.Item
                  key={item.title}
                  actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
                >
                  <List.Item.Meta
                    avatar={this.renderCourseAvatar(item.course_label)}
                    title={<a onClick={e => {
                      this.props.getOneLesson(item.lesson_id);
                      this.setState({view_modal: true});
                    }}>{item.group_name}</a>}
                    description={moment(item.start_time).format("YYYY-MM-DD HH:mm") + "  -  " + moment(item.end_time).format("YYYY-MM-DD HH:mm")}
                  />
                  <div style={{marginLeft:'48px'}}>
                    <Tag style={{marginRight: 10}} color="blue">{item.room_name}</Tag>
                    <Tag style={{marginRight: 10}} color="green">{item.label_name}</Tag>  
                  </div>
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
  const {lesson, lesson_edit, teacher_lesson} = lesson_data;
  const {classgroup_data} = group_data;
  const {teacher_option, course_option, label_option, test_option, room_option, search_result } = personal_data;

  return { 
    isFetching: state.fetchTestsData.get('isFetching'), 
    teacher_id:state.AuthData.get('userid'),
    lesson: lesson,
    lesson_edit: lesson_edit,
    teacher_lesson : teacher_lesson,
    teacher_group: classgroup_data,
    teacher_option: teacher_option,
    course_option: course_option,
    label_option: label_option,
    test_option: test_option,
    room_option: room_option,
    search_result: search_result,
  }
}, action)(LessonManager);