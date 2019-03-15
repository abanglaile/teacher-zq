import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon,Spin,Table, Menu, Row, Col, Tabs, Form, Button,Breadcrumb, DatePicker, Popconfirm, Select ,Avatar, Input, Checkbox,TreeSelect,Modal, List, Tag, Dropdown, Mention} from 'antd';
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
        let start_time = new Date();
        start_time.setDate(start_time.getDate() - 7);
        console.log(start_time);
        this.state={
          kp_tags: [],
          select_teacher: "",
          select_assistant:"",
          select_student: [],
          start_time: start_time,
          range_time: [],
          visible:false,
        };
    }

    componentDidMount(){
      let {teacher_id} = this.props;
      teacher_id = "3044f0f040ba11e9ad2ca1607a4b5d90";
      this.props.getClassGroup(teacher_id);
      this.props.getTeacherLesson(teacher_id, {});
      // this.props.getOptionData(teacher_id, 1);
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

    onGroupChange(value){
      console.log("onGroupChange value:",value);
      var temp = value.split('-');
      this.setState({group_id: temp[0], course_label : temp[1]});
      this.props.getOptionData(temp[0]);
    }

    renderNewModal(){
      const {teacher_group, label_option, teacher_option, room_option} = this.props;
      // console.log("teacher_group:",JSON.stringify(teacher_group));
      const {select_teacher, select_assistant} = this.state;
      const group_option = teacher_group.map((item) => <Option value={item.stu_group_id+'-'+item.course_label}>{item.group_name}</Option>)
      // const courseOption = course_option.map((item) => <Option value={item.course_label}>{item.course_label_name}</Option>)
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
              // onChange={(value) => this.setState({group_id: value})}
              onChange={(value) => this.onGroupChange(value)}
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
            {/* <Select
              showSearch
              style={{ width: 200 }}
              placeholder="选择学科"
              optionFilterProp="children"
              onChange={(value) => this.setState({course_label: value})}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {courseOption}
            </Select> */}

            <Select
              showSearch
              // style={{ marginLeft: 20, width: 200 }}
              style={{ width: 200 }}
              placeholder="选择课程标签"
              optionFilterProp="children"
              onChange={(value) => this.setState({label_id: value})}
              value={this.state.label_id}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {labelOption}
            </Select>

            <Select
              placeholder={"选择任课老师"}
              optionFilterProp="children"
              // value={select_teacher}
              onChange={(value) => this.setState({select_teacher: value})}
              style={{ marginLeft: 20, width: 200 }}
            >
              {teacherOption}
            </Select>
          </div>

          <div style={{marginTop: 15}}>
            <Select
              placeholder="选择助教老师"
              optionFilterProp="children"
              style={{ width: 200 }}
              onChange={(value) => this.setState({select_assistant: value})}
              // value={select_assistant}
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
        default:
          break;
      }
      return (
        <Avatar style={{ color: ava_color, backgroundColor: ava_background }}>{text}</Avatar>
      );
    }

    renderQueryOption(){
      const {teacher_group, course_option, label_option, teacher_option, teacher_id} = this.props;
      const {select_teacher, select_assistant, start_time, end_time, group_id, course_label, label_id, querySpread} = this.state;
      const group_option = teacher_group.map((item) => <Option value={item.stu_group_id}>{item.group_name}</Option>)
      const courseOption = course_option.map((item) => <Option value={item.course_label}>{item.course_label_name}</Option>)
      const labelOption = label_option.map((item) => <Option value={item.label_id}>{item.label_name}</Option>)
      const teacherOption = teacher_option.map((item) => <Option value={item.teacher_id.toString()}>{item.realname}</Option>)
      
      console.log(start_time, end_time);

      return(
      <div>
        <Form
          style = {{
            padding: "24px",
            background: "#fbfbfb",
            border: "1px solid #d9d9d9",
            borderRadius: "6px"
          }}
          layout="inline"
          
        >
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <Form.Item label={"学生分组"}>
                <Select
                  showSearch
                  style={{ width: "170" }}
                  placeholder="选择学生分组"
                  optionFilterProp="children"
                  onChange={(value) => this.setState({group_id: value})}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {group_option}
                </Select>
              </Form.Item>
            </Col>

            <Col md={8} sm={24}>
              <Form.Item label={"开始时间"}>
                <DatePicker
                  locale={locale}
                  style={{ width: 170 }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={"开始时间"}
                  onChange={(value,dateString) => this.setState({start_time: dateString})}
                /> 
              </Form.Item>
            </Col>

            <Col md={8} sm={24}>
              <Form.Item label={"结束时间"}>
                <DatePicker
                  locale={locale}
                  style={{ width: 170 }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={"结束时间"}
                  onChange={(value,dateString) => this.setState({end_time: dateString})}
                /> 
              </Form.Item>
            </Col>            

            <Col span={8} style={{ display: querySpread ? 'block' : 'none' }}>
              <Form.Item label={"任课老师"}>
                <Select
                  placeholder={"选择任课老师"}
                  value={select_teacher}
                  onChange={(value) => this.setState({select_teacher: value})}
                  style={{ width: "170" }}
                >
                  {teacherOption}
                </Select> 
              </Form.Item>
            </Col>

            <Col span={8} style={{ display: querySpread ? 'block' : 'none' }}>
              <Form.Item label={"课程学科"}>
                <Select
                  showSearch
                  style={{ width: 170 }}
                  placeholder="选择学科"
                  optionFilterProp="children"
                  onChange={(value) => this.setState({course_label: value})}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {courseOption}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8} style={{ display: querySpread ? 'block' : 'none' }}>
              <Form.Item label={"课程标签"}>
                <Select
                  showSearch
                  style={{ width: 170 }}
                  placeholder="选择课程标签"
                  optionFilterProp="children"
                  onChange={(value) => this.setState({course_label: value})}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {labelOption}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{marginTop: "1rem", marginRight: "7%"}}>  
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" onSubmit={e => this.props.getTeacherLesson(teacher_id, {
                select_teacher, 
                start_time, 
                end_time, 
                group_id,
                course_label, 
                label_id,
              })}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8, fontSize: 12 }} onClick={(e) => this.setState({querySpread: !this.state.querySpread})}>
                折叠 <Icon type={this.state.querySpread ? 'up' : 'down'} />
              </a>
            </Col>
          </Row>
        </Form>
        
        </div>
      )
    }
    
    render(){
      const {visible, treeData,tree_value} = this.state;
      const {tests,teacher_lesson,isFetching} = this.props;
      console.log(teacher_lesson);

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
              renderItem={(item, index) => (
                <List.Item
                  key={item.title}
                  // actions={[<Icon type="check" style={{color: '#08c'}}/>, <Icon type="delete" />]}
                  // actions={[<span style={{color: '#52c41a'}}>已签到</span>, <Icon type="delete" />]}
                  actions={[<span style={{color: '#69c0ff'}}>未签到</span>,
                  <Popconfirm title = "确定删除?" onConfirm = {() => this.props.deleteOneLesson(item.lesson_id)} >
                      <Icon type="delete"/>
                  </Popconfirm >
                  ]}
                >
                  <List.Item.Meta
                    avatar={this.renderCourseAvatar(item.course_label)}
                    title={<a onClick={e => {
                      this.props.getOneLesson(item.lesson_id, index);
                      this.props.setLessonIndexVisible(index);
                      this.setState({view_modal: true});
                    }}>{item.group_name}</a>}
                    description={moment(item.start_time).format("YYYY-MM-DD HH:mm") + "  -  " + moment(item.end_time).format("HH:mm")}
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
    }primary
}

export default connect(state => {
  const lesson_data = state.lessonData.toJS();
  const group_data = state.classGroupData.toJS();
  const personal_data = state.personalData.toJS();
  const {lesson, lesson_edit, teacher_lesson} = lesson_data;
  const {classgroup_data} = group_data;
  const {teacher_option, course_option, label_option, room_option, search_result } = personal_data;

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
    // test_option: test_option,
    room_option: room_option,
    search_result: search_result,
  }
}, action)(LessonManager);