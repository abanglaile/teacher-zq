import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout,Breadcrumb,Steps,Divider,Table,Tooltip,Tag,Input,Button,Icon,Spin} from 'antd';
import Styles from '../styles/TestResult.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Zq_Header from './ZQ_Header.js';
import config from '../utils/Config';
import moment from 'moment';

const { Header, Footer, Sider, Content } = Layout;
const { Step } = Steps;

class GroupPath extends React.Component {
	constructor(props){
		super(props);
		this.state = { 
			filterDropdownVisible: false,
			searchText: '',
			filtered: false,
		};
	}

	componentWillMount() {
		let { query } = this.props.location;
		this.props.getGroupPath(query.path_id,query.group_id);
	}

	// componentDidMount(){
	//   const {path_id, group_id} = this.state;
	//   console.log("path_id 2",path_id);
	//   if(path_id){
	// 	//   this.props.getGroupPath(path_id,group_id);
	// 	  this.props.getGroupPath('64b9d6b7671547622bc65d782656470b',group_id);
	//   }
	// }

	handleSearch = (selectedKeys, confirm) => () => {
		confirm();
		this.setState({ searchText: selectedKeys[0] });
	}

	handleReset = clearFilters => () => {
		clearFilters();
		this.setState({ searchText: '' });
	}
	
	renderGroupPath(){
		const {path_info,stu_path} = this.props;
		// console.log("path_info",JSON.stringify(path_info));
		var chapter_step_option = [];
		this.columns = [{
            title: '姓名',
            dataIndex: 'realname',
            width: '15%',
            key:'student_id',
            filterDropdown: ({
							setSelectedKeys, selectedKeys, confirm, clearFilters,
						}) => (
		        <div className="custom-filter-dropdown">
			          <Input
			            ref={ele => this.searchInput = ele}
			            placeholder="输入姓名"
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
				var indexs = record.realname.indexOf(value);
				return (indexs >= 0 ? true : false);
			},
			onFilterDropdownVisibleChange: (visible) => {
				if (visible) {
					setTimeout(() => {
						this.searchInput.focus();
					});
				}
			},
			render: (text,record) => {
				const { searchText } = this.state;
				return searchText ? (
					<a 	
						href={"/teacher-zq/stu_path?group_id=" + record.stu_group_id + "&" + "student_id=" + record.student_id + "&" + "path_id=" + record.path_id}
					>
						{text.split(new RegExp(`(${searchText})`, 'gi')).map((fragment, i) => (
							fragment.toLowerCase() === searchText.toLowerCase()
								? <a key={i} className="highlight" >{fragment}</a> : fragment// eslint-disable-line
						))}
					</a> 
				) : (<a 
						href={"/teacher-zq/stu_path?group_id=" + record.stu_group_id + "&" + "student_id=" + record.student_id + "&" + "path_id=" + record.path_id}
					>{text}</a>);
			},
	    },{
            title: '章节进度',
            dataIndex: 'path_chapter_name',
            width: '15%',
			key:'path_chapter_index',
			sorter: (a, b) => a.path_chapter_index - b.path_chapter_index,
		},{
            title: '知识点进度',
            dataIndex: 'node_name',
            width: '15%',
			key:'node_index',
        },{
            title: '最近更新时间',
            dataIndex: 'update_time',
            width: '15%',
						key:'update_time',
						render: (text, record) => {
							if(text) return moment(text).format('YYYY-MM-DD HH:mm:ss'); //2014-09-24 23:36:09 
							else return '';
            },
			sorter: (a, b) => (moment(a.end_time)-moment(b.end_time)),
        }];
		
		if(path_info){
			chapter_step_option = path_info.map((item) =>  
				<Step 
					title={item.path_chapter_name} 
					status="process"
					// subTitle="2人"
					description={
						<div style={{marginTop:'0.5rem'}}>
							<Tooltip 
								placement="bottomLeft" 
								title={
									<div>
										<span>当前章节停留：</span>
										<span>{item.chapter_stu ?
											item.chapter_stu.stu_info.map((ele) => <span>{ele.realname}&nbsp;</span>)
											: '无'}
											</span>
									</div>
								}
							>	
								<Tag color={"geekblue"}>
									{item.chapter_stu ? 
									item.chapter_stu.stu_num : 0}人
								</Tag>
							</Tooltip>
						</div>
					}
				/>
			);
		}
		
		return (
			<div 
				// style={{mar:'500px'}}
			>
				<div style={{marginBottom:'4rem'}}>
					<Steps>
						{chapter_step_option}
					</Steps>
				</div>
				<div style={{marginTop:'3rem'}}>
					<Table 
					columns={this.columns} dataSource={stu_path} />
				</div>
			</div>
		  );
	}
	
	render(){
		const {group_name,path_name,isFetching} = this.props;
		return(
			<Layout className="layout">
				<Header style={{background: '#fff',height:'80px'}}>
				<Zq_Header/>
				</Header>
				<Content style={{ padding: '0 120px' }}>
				<Breadcrumb style={{ margin: '12px 0' }} separator=">">
					<Breadcrumb.Item> <Link to="/teacher-zq/root/path-manager">路径管理</Link></Breadcrumb.Item>
					{/* <Breadcrumb.Item>路径管理</Breadcrumb.Item> */}
					<Breadcrumb.Item>{path_name}</Breadcrumb.Item>
					<Breadcrumb.Item>{group_name}</Breadcrumb.Item>
				</Breadcrumb>
				<div style={{ background: '#fff', padding: 24, minHeight: 560 }}>
					<Spin spinning={isFetching} > 
					<div style={{ padding: 24 }}>
						{this.renderGroupPath()}
					</div>
					</Spin>
				</div>
				</Content>
				<Footer className='noprint' style={{ textAlign: 'center' }}>
					Ant Design ©2021 Created by Bourne
				</Footer>
			</Layout>
		);
		
	}
}

export default connect(state => {
  const { path_data, isFetching } = state.pathData.toJS();
//   console.log("path_data",JSON.stringify(path_data));
  return {
	path_info : path_data.path_info,
	stu_path : path_data.stu_path,
	group_name : path_data.group_name,
	path_name : path_data.path_name,
	isFetching : isFetching,
  }
}, action)(GroupPath);


