import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Col,Progress,Row,Layout,Card,Breadcrumb,Statistic,Icon,Divider} from 'antd';
import {Link} from 'react-router';
import Styles from '../styles/stuEvaluation.css';
import {Chart,Geom,Axis,Tooltip,Coord,Label,Legend} from "bizcharts";
import DataSet from "@antv/data-set";
import *as action from '../Action/';
import {connect} from 'react-redux';
import Zq_Header from './ZQ_Header';
const { Header, Footer, Content } = Layout;

class StuEvaluation extends React.Component {
	componentWillMount(){
		let { query } = this.props.location;
		this.props.getMyTestData(query.student_id,query.test_id);
		// this.props.getStuTestSurvey(query.student_id,query.test_id);
		this.props.getStuEvaluationData(query.student_id,query.test_id);
	}

	ProcessKPstatus(){
		const {eval_data} = this.props;
		console.log("eval_data:",JSON.stringify(eval_data));
		const kp_name_lable = {
			offset: 80,
			htmlTemplate(text, item, index) {
				return `<div class="o">${text}</div>`;
			}
		};
		
		const cols_r = {
			kp_name: {
				alias: '知识点', // 为属性定义别名
			},
			kp_correct_rating: {
				alias: '知识点掌握度', // 为属性定义别名
				max: 100,
			}
		};
		const cols_p = {
			kp_name: {
				alias: '知识点', // 为属性定义别名
			},
			kp_correct_percent: {
				alias: '知识点正确率', // 为属性定义别名
				max: 100,
			}
		};
		let KPstatus=[];
		for (var i=0;i<eval_data.length;i++){
			KPstatus.push(
			// <Card  bordered={false} title={<h2>{eval_data[i].chapter_name}</h2>} >
				<div>
					<div style={{marginLeft:'24px'}}><h2>{eval_data[i].chapter_name}</h2></div>
					{/* <Divider orientation="left"><h2>{eval_data[i].chapter_name}</h2></Divider> */}
					<Row type="flex" justify="space-around" align="middle">
						<Col span={11}>
							<Card>
								<div>
									<Row type="flex" justify="space-around" align="middle">
										<Col span={11}>
											<Progress 
												strokeLinecap="square"
												type="circle"
												width={100}
												percent={eval_data[i].chapter_ratting} 
												format={(percent) => `${percent}%`}  
											/>
										</Col>
										<Col span={11}>
											<Statistic
												title="章节掌握度"
												value={11.28}
												precision={2}
												valueStyle={{ color: '#3f8600' }}
												prefix={<Icon type="arrow-up" />}
												suffix="%"
											/>
										</Col>
									</Row>
									<Row type="flex" justify="space-around" align="middle" style={{marginTop:'2rem'}}>
										<Col span={22}>
											<Chart height={400} data={eval_data[i].kp_status} scale={cols_r} forceFit>
												<Coord transpose />	
												<Axis name="kp_name" label={kp_name_lable}/>
												<Axis name="kp_correct_rating"  title={true}/>
												<Tooltip
													crosshairs={{
														type: "rect",
													}}
												/>
												<Geom type="interval" 
													position="kp_name*kp_correct_rating" 
													color='kp_name'
													tooltip={['kp_name*kp_correct_rating', (kp_name, kp_correct_rating) => {
														return { //自定义 tooltip 上显示的 title 显示内容等。
														name: kp_name + '',
														title: '知识点掌握度',
														value: kp_correct_rating + '%'
														};
													}]}
													adjust= {[
														{
														type: 'dodge',//   'stack', 'dodge', 'jitter', 'symmetric'
														}
													]}
												>
													<Label
														content="kp_correct_rating"
														formatter={(text, item, index)=>{
															return text + "%"
														}}
													/>
												</Geom>
											</Chart>
										</Col>
									</Row>
								</div>
							</Card>
						</Col>
						<Col span={11}>
							<Card>
								<div>
									<Row type="flex" justify="space-around" align="middle">
										<Col span={8}>
											<Progress 
												strokeLinecap="square"
												strokeColor = "red"
												type="circle"
												width={100}
												percent={eval_data[i].chapter_correct_percent} 
												format={(percent) => `${percent}%`}  
											/>
										</Col>
										<Col span={8}>
											<span>章节正确率</span>
										</Col>
									</Row>
									<Row type="flex" justify="space-around" align="middle" style={{marginTop:'2rem'}}>
										<Col span={22}>
											<Chart height={400} data={eval_data[i].kp_status} scale={cols_p} forceFit>
												<Coord transpose />	
												<Axis name="kp_name" label={kp_name_lable} />
												<Axis name="kp_correct_percent"  title={true}/>
												<Tooltip
													crosshairs={{
														type: "rect",
													}}
												/>
												<Geom type="interval" 
													position="kp_name*kp_correct_percent" 
													color='kp_name'
													tooltip={['kp_name*kp_correct_percent', (kp_name, kp_correct_percent) => {
														return { //自定义 tooltip 上显示的 title 显示内容等。
														name: kp_name + '',
														title: '知识点正确率',
														value: kp_correct_percent + '%'
														};
													}]}
													adjust= {[
														{
														type: 'dodge',//   'stack', 'dodge', 'jitter', 'symmetric'
														}
													]}
												>
													<Label
														content="kp_correct_percent"
														formatter={(text, item, index)=>{
															return text + "%"
														}}
													/>
												</Geom>
											</Chart>
										</Col>
									</Row>
								</div>
							</Card>
						</Col>
					</Row>
				</div>
			// </Card>
			)
		}
		return KPstatus;
	}

    render () {
		const {eval_data,TestStatus,isFetching} = this.props;
		console.log("TestStatus:",JSON.stringify(TestStatus));
        return (
			<Layout className="layout">
			<Header style={{background: '#fff',height:'80px'}}>
			<Zq_Header/>
			</Header>
			<Content style={{ padding: '0 120px' }}>
				<Breadcrumb style={{ margin: '12px 0' }} separator=">">
					<Breadcrumb.Item><Link to="/teacher-zq/stu_manager">测试中心</Link></Breadcrumb.Item>
					<Breadcrumb.Item>{eval_data.student_name}</Breadcrumb.Item>
					<Breadcrumb.Item>{TestStatus.test_name}</Breadcrumb.Item>
				</Breadcrumb>
				<div style={{ background: '#fff', padding: 24, minHeight: 560 }}>
					<div style={{padding: 24}}>
						<div><h2>概况</h2></div>
						<Card>
						<Row type="flex" justify="space-around" align="middle">
							<Col span={4}>
								<div>
									<Progress 
										strokeLinecap="square"
										type="circle"
										width={80}
										percent={TestStatus.correct_rate} 
										format={(percent) => `${percent}%`} 
									/>
								</div>
							</Col>
							<Col span={4} >
								<p style={{fontSize: 28,color:'#0e77ca',marginLeft:8}}>800</p>
							</Col>
							<Col span={4} >
								<p style={{fontSize: 24,color:'#0e77ca'}}>{TestStatus.elapsed_time}</p>
							</Col>
							<Col span={6}>
								<p style={{fontSize: 16,color:'#0e77ca'}}>{TestStatus.finish_time}</p>
							</Col>
						</Row>
						<Row type="flex" justify="space-around" align="middle">
							<Col span={4} ><p className="p_row_rate">正确率</p></Col>
							<Col span={4} ><p className="row_rate_p">天梯分</p></Col>
							<Col span={4} ><p className="row_rate_p">耗时</p></Col>
							<Col span={6} ><p className="row_rate_p">提交时间</p></Col>
						</Row>
					</Card>
					</div>
                <div>
					{this.ProcessKPstatus()}
                </div>
			</div>
			</Content>
				<Footer style={{ textAlign: 'center' }}>
				Ant Design ©2017 Created by Bourne
				</Footer>
		</Layout>
        )
    }
}
export default connect (state => {
	const stuMyTestData = state.fetchTestsData.toJS();
	const stuevaldata = state.stuEvaluationData.toJS();
    return {
		isFetching: stuevaldata.isFetching,
		TestStatus: stuMyTestData.test_kp,
		eval_data:stuevaldata.eval_data
    }
},action)(StuEvaluation)