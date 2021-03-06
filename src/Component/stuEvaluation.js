import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Col, Progress, Row, Layout, Card, Breadcrumb, Statistic, Icon, Divider, Button } from 'antd';
import { Link } from 'react-router';
import Styles from '../styles/stuEvaluation.css';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend } from "bizcharts";
import DataSet from "@antv/data-set";
import *as action from '../Action/';
import { connect } from 'react-redux';
import Zq_Header from './ZQ_Header';
import moment from 'moment';
const { Header, Footer, Content } = Layout;


class StuEvaluation extends React.Component {
	componentWillMount() {
		let { query } = this.props.location;
		// this.props.getMyTestData(query.student_id,query.test_id);
		this.props.getStuTestSurvey(query.student_id, query.test_id);
		this.props.getStuEvaluationData(query.student_id, query.test_id);
	}

	ProcessKPstatus() {
		const { eval_data } = this.props;
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
		let KPstatus = [];
		for (var i = 0; i < eval_data.length; i++) {
			if (eval_data[i].chapter_exercise_times == 0) {
				KPstatus.push(
					<div>
						<div style={{ marginLeft: '24px' }}><h2>{eval_data[i].chapter_name}</h2></div>
						<Row type="flex" justify="space-around" align="middle">
							<Col span={23}>
								<Card>
									<h1 style={{ color: 'gray' }}>未评估</h1>
								</Card>
							</Col>
						</Row>
					</div>
				)
			} else {
				KPstatus.push(
					<div>
						<div style={{ marginLeft: '24px' }}><h2>{eval_data[i].chapter_name}</h2></div>
						{/* <Divider orientation="left"><h2>{eval_data[i].chapter_name}</h2></Divider> */}
						<Row type="flex" justify="space-around" align="middle">
							<Col span={11}>
								<Card>
									<div>
										<Row type="flex" justify="space-around" align="middle">
											<Col span={8}>
												<Progress
													strokeLinecap="square"
													type="circle"
													width={100}
													percent={eval_data[i].chapter_ratting.toFixed(1)}
													format={(percent) => `${percent}%`}
												/>
											</Col>
											<Col span={8}>
												{/* <Statistic
												title="章节掌握度"
												value={11.28}
												precision={2}
												valueStyle={{ color: '#3f8600' }}
												prefix={<Icon type="arrow-up" />}
												suffix="%"
											/> */}
												<span>章节掌握度</span>
											</Col>
										</Row>
										<Row type="flex" justify="space-around" align="middle" style={{ marginTop: '2rem' }}>
											<Col span={22}>
												<Chart height={eval_data[i].kp_status.length == 1 ? 200 : 400} data={eval_data[i].kp_status} scale={cols_r} forceFit>
													<Coord transpose />
													<Axis name="kp_name" label={kp_name_lable} />
													<Axis name="kp_correct_rating" title={true} />
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
														adjust={[
															{
																type: 'dodge',//   'stack', 'dodge', 'jitter', 'symmetric'
															}
														]}
													>
														<Label
															content="kp_correct_rating"
															formatter={(text, item, index) => {
																let delta = ((item._origin.kp_delta_rating / item._origin.kp_standard) * 100).toFixed(1);
																return text + "%   " + (item._origin.kp_delta_rating > 0 ? '+' : '') + delta + '%';
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
													strokeColor={eval_data[i].chapter_correct_percent >= 70 ? '#52c41a' : (eval_data[i].chapter_correct_percent >= 40) ? '#fff566' : 'red'}
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
										<Row type="flex" justify="space-around" align="middle" style={{ marginTop: '2rem' }}>
											<Col span={22}>
												<Chart height={eval_data[i].kp_status.length == 1 ? 200 : 400} data={eval_data[i].kp_status} scale={cols_p} forceFit>
													<Coord transpose />
													<Axis name="kp_name" label={kp_name_lable} />
													<Axis name="kp_correct_percent" title={true} />
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
														adjust={[
															{
																type: 'dodge',//   'stack', 'dodge', 'jitter', 'symmetric'
															}
														]}
													>
														<Label
															content="kp_correct_percent"
															formatter={(text, item, index) => {
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
		}
		return KPstatus;
	}


	render() {
		const { survey_data, isFetching } = this.props;
		const { test_log } = survey_data;
		var elapsed_time = moment(moment(test_log.finish_time) - moment(test_log.start_time)).subtract(8, 'hours');
		return (
			<Layout className="layout">
				<Header className='noprint' style={{ background: '#fff', height: '80px' }}>
					<Zq_Header />
				</Header>
				{/* <div className="header">冠名机构</div> */}
				<Content style={{ padding: '0 120px' }}>
					<div className="print">
						<Breadcrumb style={{ margin: '12px 0' }} separator=">">
							<Breadcrumb.Item><Link to="/teacher-zq/root/testcenter">测试中心</Link></Breadcrumb.Item>
							<Breadcrumb.Item><Link to={"/teacher-zq/testresult/" + this.props.location.query.test_id}>{test_log.test_name}</Link></Breadcrumb.Item>
							<Breadcrumb.Item>{survey_data.student_name}</Breadcrumb.Item>
						</Breadcrumb>
						<div style={{ background: '#fff', padding: 24, minHeight: 560 }}>
							<div style={{ padding: 24 }}>
								<div><h2>概况</h2></div>
								<Card>
									<Row type="flex" justify="space-around" align="middle">
										<Col span={4}>
											<div>
												<Progress
													strokeLinecap="square"
													type="circle"
													width={80}
													percent={test_log.test_state}
													format={(percent) => `${percent}%`}
												/>
											</div>
										</Col>
										<Col span={4} >
											<p style={{ fontSize: 28, color: '#0e77ca', marginLeft: 8 }}>{survey_data.student_rating}</p>
										</Col>
										<Col span={4} >
											<p style={{ fontSize: 20, color: '#0e77ca' }}>{elapsed_time >= 60 * 60 ?
												moment(elapsed_time).format('HH时m分ss秒') : moment(elapsed_time).format('m分ss秒')
											}</p>
										</Col>
										<Col span={6}>
											<p style={{ fontSize: 16, color: '#0e77ca' }}>{moment(test_log.finish_time).format("YYYY-M-D H:mm:ss")}</p>
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
					</div>
				</Content>
				<Footer className='noprint' style={{ textAlign: 'center' }}>
					Ant Design ©2017 Created by Bourne
				</Footer>
			</Layout>
		)
	}
}
export default connect(state => {
	// const stuMyTestData = state.fetchTestsData.toJS();
	const { isFetching, eval_data, survey_data } = state.stuEvaluationData.toJS();
	return {
		isFetching: isFetching,
		eval_data: eval_data,
		survey_data: survey_data,

	}
}, action)(StuEvaluation)