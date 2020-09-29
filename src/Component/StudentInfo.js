import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Tabs, Breadcrumb, List, Avatar, Tag, Select, Form, Row, Col, Button} from 'antd';
import Styles from '../styles/stu_capacity.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Zq_Header from './ZQ_Header.js';
import moment from 'moment';

const { Header, Footer, Sider, Content } = Layout;
const TabPane = Tabs.TabPane;

class StudentInfo extends React.Component{
	constructor(props){
		super(props);
		this.state = { activeKey : '1',
            student_id : this.props.params.id,
            course_label : null,
            side_option : [{side:1,side_label:'表扬进步'},{side:0,side_label:'存在问题'}],
		};
	}

	componentDidMount(){
        const {student_id} = this.state;
        if(student_id){
            this.props.getStuInfoById(student_id);
            this.props.getStuCourse(student_id);
            this.props.getStuPfCommentList(student_id);
            this.props.getStuKpCommentList(student_id,{});
        }
    }

	onTabChange(key){
		this.setState({activeKey : key});
    }

    getTagColor(course_label){
        let tag_color = '';
        switch (course_label){
          case '1':
            tag_color = '#28b6b6';
            break;
          case '2':
            tag_color = '#fef001';
            break;
          case '3':
            tag_color = '#f56a00';
            break;
          case '4':
            tag_color = '#0ebec4';
            break;
          case '5':
            tag_color = '#3162e5';
            break;
          case '6':
            tag_color = '#eece2e';
            break;
          case '7':
            tag_color = '#ff9918';
            break;
          case '8':
            tag_color = '#ff4640';
            break;
          case '9':
            tag_color = '#d4b22a';
            break;
          case '10':
            tag_color = '#28d900';
            break;
          default:
            break;
        }
        return tag_color;
    }
    
    renderPfComment(){
        const {stu_pfcomment_list} = this.props;
        return (
            <List
                itemLayout="vertical"
                // size="large"
                pagination={{
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: 6,
                }}
                dataSource={stu_pfcomment_list}
                renderItem={item => (
                    <List.Item
                        key={item.comment_id}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={
                                <div>
                                    <span>{item.realname}</span>
                                    <Tag 
                                        size = 'small'
                                        style={{marginLeft:'1rem'}}
                                        color={this.getTagColor(item.course_label)}
                                    >
                                        {item.course_label_name}
                                    </Tag>
                                </div>
                            }
                            description={
                                <div>
                                    <span style={{color:'#1890ff'}}>#{item.label_name}#</span>
                                    <span style={{marginLeft:'1rem'}}>{moment(item.comment_time).format("MM-DD HH:mm")}</span>
                                </div>
                            }
                        />
                        <div style={{marginLeft:'3rem'}}>
                            {item.pf_comment_content}
                        </div>
                    </List.Item>
                )}
            />
        );
    }

    handleReset(){
        this.setState({
          query_course_label: undefined,
          query_side:undefined,
        });
    }

    renderKpComment(){
        const {student_id, side_option, query_course_label, query_side} = this.state;
        const {course_option, stu_kpcomment_list} = this.props;
        const courseOption = course_option.map((item) => <Option value={item.course_label}>{item.course_label_name}</Option>);
        const sideOption = side_option.map((item) => <Option value={item.side}>{item.side_label}</Option>);
        return (
            <div>
                <Form
                    style = {{
                        padding: "12px",
                        background: "#fbfbfb",
                        border: "1px solid #d9d9d9",
                        borderRadius: "6px"
                    }}
                    layout="inline"
                >
                    <Row type="flex" justify="space-around" align="middle">
                        <Col span={8}>
                            <Form.Item label={"学科"}>
                                <Select
                                    showSearch
                                    style={{ width: "130" }}
                                    placeholder="选择学科"
                                    optionFilterProp="children"
                                    value={query_course_label}
                                    onChange={(value) => this.setState({query_course_label: value})}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {courseOption}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={"知识点表现"}>
                                <Select
                                    showSearch
                                    style={{ width: "130" }}
                                    placeholder="选择表现情况"
                                    optionFilterProp="children"
                                    value={query_side}
                                    onChange={(value) => this.setState({query_side: value})}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {sideOption}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit" onClick={() => this.props.getStuKpCommentList(student_id, {
                            course_label:query_course_label, 
                            side:query_side,
                            })}>查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={() => this.handleReset()}>
                                重置
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <List
                    itemLayout="vertical"
                    // size="large"
                    style={{marginTop:'1rem'}}
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 6,
                    }}
                    dataSource={stu_kpcomment_list}
                    renderItem={item => (
                        <List.Item
                            key={item.comment_id}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={
                                    <div>
                                        <span>{item.realname}</span>
                                        <Tag 
                                            size = 'small'
                                            style={{marginLeft:'1rem'}}
                                            color={this.getTagColor(item.course_label)}
                                        >
                                            {item.course_label_name}
                                        </Tag>
                                    </div>
                                }
                                description={
                                    <div>
                                        <span style={{color : item.side? '#52c41a' : '#ff4d4f'}}>#{item.kpname}#</span>
                                        <span style={{marginLeft:'1rem'}}>{moment(item.comment_time).format("MM-DD HH:mm")}</span>
                                    </div>
                                }
                            />
                            <div style={{marginLeft:'3rem'}}>
                                {item.kp_comment_content}
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        );
       
    }

	render(){
		const {activeKey,student_id} =this.state;
		const {student_name, group_name} = this.props;
		console.log("student_name",student_name);
		if(student_name){
			return(
				<Layout className="layout">
                    <Header style={{background: '#fff',height:'80px'}}>
                        <Zq_Header/>
                    </Header>
                    <Content style={{ padding: '0 250px' }}>
                        <Breadcrumb style={{ margin: '12px 0' }} separator=">">
                            <Breadcrumb.Item><span><Link to="/teacher-zq/root/stu_manager">学生管理</Link></span></Breadcrumb.Item>
                            <Breadcrumb.Item>{student_name}</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <Tabs size="large" onChange={(key)=>this.onTabChange(key)} activeKey={activeKey}>
                            <TabPane tab="课堂表现" key="1">{this.renderPfComment()}</TabPane>
                            <TabPane tab="知识点点评" key="2">{this.renderKpComment()}</TabPane>
                        </Tabs>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2019 Created by Bourne
                    </Footer>
				</Layout>
			);
		}else{
			return null;
		}
	}
}

export default connect(state => {
  const student_data = state.studentData.toJS();
  const {student_info, stu_pfcomment_list, stu_kpcomment_list, course_option} = student_data;	
  return {
	  student_name : student_info ? student_info.realname : null,
      group_name : student_info ? student_info.group_name : null,
      stu_pfcomment_list : stu_pfcomment_list,
      stu_kpcomment_list : stu_kpcomment_list,
      course_option : course_option,
  }
}, action)(StudentInfo);



