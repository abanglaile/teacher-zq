import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Col, Row, Layout, Breadcrumb, Icon,Upload,Spin,Descriptions,Divider,Card,Button, Steps, Progress , Timeline, List, Avatar,Tag,Modal} from 'antd';
import { Link } from 'react-router';
import *as action from '../Action/';
import { connect } from 'react-redux';
import Zq_Header from './ZQ_Header';
import moment from 'moment';
const { Header, Footer, Content } = Layout;
const { Step } = Steps;

const path_ch = [{	
					chapater_index : 0,
					path_chapater_id : 0,
					path_chapter_name : '二次根式',
				},{	
					chapater_index : 1,
					path_chapater_id : 1,
					path_chapter_name : '勾股定理',	
				},{
					chapater_index : 2,
					path_chapater_id : 2,
					path_chapter_name : '平行四边形',
					currnet_kp_index : 0,
					chapter_node : [{
						kpid : '132608',
						node_index : 0,
						node_name : '平行四边形',
						test_list : [{
							test_id : 8,
							test_index : 0,
							test_name : "学前测评",
							desc: '平行四边形',
							rate : '97',
						}],
						task_list : [{
							taskid : 0,
							task_index : 0,
							source_name : "智能导学案",
							desc : '学习笔记例题#平行四边形的对角性质#',
							status : '待审核',
						},{
							taskid : 1,
							task_index : 1,
							source_name : "智能导学案",
							desc : '学习笔记例题#平行四边形的判定定理#',
							status : '待审核',
						}],
					},{
						kpid : '132609',
						node_index : 1,
						node_name : '特殊平行四边形',
					}]
				},{
					chapater_index : 3,
					path_chapater_id : 3,
					path_chapter_name : '一次函数',	
				},{
					chapater_index : 4,
					path_chapater_id : 4,
					path_chapter_name : '数据分析',	
				},
			];

class StuPath extends React.Component {
	constructor(props) {
		super(props);
        this.state={
			current_ch_index : -1,
			weak_visible : false,
			node_res : {chapter_name:'',weak_kp_tags:[],kp_mastery: 0},
			current_tasklog : {wrong_ex:0,task_desc:'',total_ex:0,task_count:0,correct_rate:0,content:''},
			task_visible : false,
			previewVisible: false,
            previewImage: '',
        };
	}
	
	componentDidMount(){
		let { query } = this.props.location;
		this.setState({
			student_id : query.student_id,
			group_id : query.group_id,
			path_id : query.path_id,
		});
		this.props.getStudentPathChapter(query.student_id,query.group_id,query.path_id);
	}

	onChapterChange(current){
		this.setState({current_ch_index : current});
		const {path_chapter_list} = this.props;
		const {student_id,group_id} = this.state;
		this.props.getStudentChapterNode(student_id,group_id,path_chapter_list[current].path_chapter_id);
	}

	renderPath(){
		const {path_chapter_list,current_chapter_index,current_node_index,stu_chapter_node,isFetching} = this.props;
		var {current_ch_index,weak_visible,node_res,current_tasklog,task_visible,previewVisible,previewImage} = this.state;
		console.log("stu_chapter_node:",JSON.stringify(stu_chapter_node));
		// console.log("current_tasklog:",JSON.stringify(current_tasklog));
		// console.log("current_ch_index:",current_ch_index);
		if(current_tasklog.submit_url){
            var url_list = current_tasklog.submit_url.split(',');
            var fileList = [];
            for(var i=0;i<url_list.length;i++){
                var file = {
                    uid : i,
                    url : url_list[i]
                };
                fileList.push(file);
            }
        }
		const chapter_step_option = path_chapter_list.map((item) =>  
			<Step title={item.path_chapter_name} 
				status={
					item.chapter_index < current_chapter_index ? 'finish' :
					item.chapter_index == current_chapter_index ?
					'process' : 'wait'
				} 
			/>
		);
		const node_step_option = stu_chapter_node ? stu_chapter_node.map((item) =>  
			<Timeline.Item
				color={
					current_ch_index < 0 ? (item.node_index < current_node_index ? 'green' :
					item.node_index == current_node_index ?
					'blue' : 'grey') : current_ch_index < current_chapter_index ?
					'green' : current_ch_index > current_chapter_index ?
					'grey': item.node_index < current_node_index ? 'green' :
					item.node_index == current_node_index ?
					'blue' : 'grey'
				}
			>
				<div>
					<div>{item.node_name}</div>
					<div style={{marginTop:'1rem'}}>
						{   item.pre_test ?
							<List
							    bordered='true'
								itemLayout="horizontal"
							>
								<List.Item>
									<List.Item.Meta
										title={'知识点测评'}
										description={item.pre_test ? item.pre_test.test_desc + ' ' + '共'+item.pre_test.total_exercise+'题' : ''}
									/>
									<div onClick={() => item.pre_test.result? this.setState({node_res:item.pre_test.result,weak_visible:true}) : ''}
                					>
										{item.pre_test.result ? 
											<Tag style={{marginRight: '1rem'}} color="orange">薄弱项x{item.pre_test.result? item.pre_test.result.weak_kp_tags.length : '0'}</Tag>
											:
											item.pre_test.start_time ? 
											<Tag style={{marginRight: '1rem'}} color="blue">待测评</Tag>
											:
											<Tag style={{marginRight: '1rem'}}>未解锁</Tag>
										}
									</div>
								</List.Item>
								{item.node_tasks.length?
									item.node_tasks.map((litem) =>  
										<List.Item>
											<List.Item.Meta
												title={litem.task_desc}
												description={litem.task_count ? '共'+litem.task_count+'题'+' '+(litem.start_time ? moment(litem.start_time).format("YYYY-MM-DD HH:mm"):'') : ''}
											/>
											<div onClick={() => this.setState({current_tasklog:litem,task_visible:true})}>
												<Tag style={{marginRight: '1rem'}} color={
													litem.verify_state != null ? 
													litem.verify_state == 0 ? 'red' : litem.verify_state == 1 ? 'blue' : 'green'
													: null
												}>
													{litem.verify_state != null  ? 
														litem.verify_state == 0 ? '未完成' : litem.verify_state == 1 ? '审核中' : '已完成'
														: '未解锁'}
												</Tag>
											</div>
									</List.Item>) : ''
								}
							</List> : ''
						}
					</div>
				</div>
			</Timeline.Item>
		) : [];
		return (
			<div 
				// style={{width:'500px'}}
			>
				<Steps current={current_chapter_index} 
					type="navigation"
					onChange={current => this.onChapterChange(current)}>
					{chapter_step_option}
				</Steps>
				<Divider />
				<Modal title={node_res.chapter_name} visible={weak_visible} width={550} style={{height:400}} footer={null} onCancel={()=>this.setState({weak_visible:false})}>
					<div style={{ background: '#ECECEC', padding: '30px' }}> 
						<Row type="flex" justify="space-around" align="top">
						{/* <Row gutter={16}> */}
							<Col span={11}>
								<Card title={<div>知识点薄弱项x{node_res.weak_kp_tags.length}</div>} 
									bordered={false} >
									{node_res.weak_kp_tags.map((item) => (
										<p><Tag color="orange">{item}</Tag></p>
									))}
								</Card>
							</Col>
							<Col span={8}>
								<Card title={<div>掌握程度</div>} 
									bordered={false} >
									<Progress type="circle" percent={node_res.kp_mastery} 
										format={(percent) => `${percent}%`} width={90}/>
								</Card>
							</Col>
						</Row>
					</div>
				</Modal>
				<Modal title={current_tasklog.task_desc} visible={task_visible} width={550} style={{height:400}} footer={null} onCancel={()=>this.setState({task_visible:false})}>
					<div>
						{current_tasklog.verify_state > 1 ?
							<Descriptions title={null} column={1} bordered={true}>
								<Descriptions.Item label="任务详情">{current_tasklog.content}</Descriptions.Item>
								<Descriptions.Item label={<div>正确率：{current_tasklog.task_count-current_tasklog.wrong_ex}/{current_tasklog.task_count}</div>}>
									<Progress type="circle" percent={current_tasklog.correct_rate? current_tasklog.correct_rate:0} 
										width={70} format={(percent) => `${percent}%`} />
								</Descriptions.Item>
								{current_tasklog.submit_url ?
									<Descriptions.Item label="提交详情">
										<Upload
											listType="picture-card"
											fileList={fileList}
											onPreview={(file) => this.setState({previewImage:file.url,previewVisible: true})}
											>
										</Upload>
										<Modal visible={previewVisible} width={660} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
											<img alt="example" style={{ width: '100%' }} src={previewImage} />
										</Modal>
									</Descriptions.Item>
									: ''
								}
								
							</Descriptions>
							:
							<Descriptions title={null} column={1} bordered={true}>
								<Descriptions.Item label="任务详情">{current_tasklog.content}</Descriptions.Item>
							</Descriptions>
						}
					</div>
				</Modal>
				<Spin spinning={isFetching} > 
					<div style={{margin:'0 5rem 0 5rem'}}>
						<Timeline>
							{node_step_option}
						</Timeline>
					</div>
				</Spin>
			</div>
		  );
	}


	render() {
		const {realname,path_name,group_name} = this.props;
		const {student_id,group_id,path_id} = this.state;
		return (
			<Layout className="layout">
				<Header className='noprint' style={{ background: '#fff', height: '80px' }}>
					<Zq_Header />
				</Header>
				<Content style={{ padding: '0 120px' }}>
					<div className="print">
						<Breadcrumb style={{ margin: '12px 0' }} separator=">">
							<Breadcrumb.Item> <Link to="/teacher-zq/root/path-manager">路径管理</Link></Breadcrumb.Item>
							<Breadcrumb.Item>{path_name}</Breadcrumb.Item>
							<Breadcrumb.Item><a href={"/teacher-zq/group_path?group_id=" + group_id + "&" + "path_id=" + path_id}>{group_name}</a></Breadcrumb.Item>
							<Breadcrumb.Item>{realname}</Breadcrumb.Item>
						</Breadcrumb>
						<div style={{ background: '#fff', padding: 24, minHeight: 560 }}>
							<div style={{ padding: 24 }}>
								{this.renderPath()}
							</div>
						</div>
					</div>
				</Content>
				<Footer className='noprint' style={{ textAlign: 'center' }}>
					Ant Design ©2021 Created by Bourne
				</Footer>
			</Layout>
		)
	}
}
export default connect(state => {
	const { isFetching, stu_path_chapter, stu_chapter_node, path_stu_name} = state.pathData.toJS();
	// console.log("stu_chapter_node:",JSON.stringify(stu_chapter_node));
	return {
		isFetching: isFetching,
		path_chapter_list: stu_path_chapter.path_chapter_list,
		current_chapter_index: stu_path_chapter.current_chapter_index,
		current_node_index: stu_path_chapter.current_node_index,
		realname:stu_path_chapter.realname,
		path_name:stu_path_chapter.path_name,
		group_name:stu_path_chapter.group_name,
		stu_chapter_node:stu_chapter_node.chapter_node_list,
	}
}, action)(StuPath)