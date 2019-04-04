import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Col,Progress,Row,Layout,Card,Breadcrumb} from 'antd';
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
		this.props.getstuEvaluationData(query.student_id,query.test_id);
	}

	dataProcess(data){
		console.log("dataProcess:",JSON.stringify(data));
		const ds = new DataSet().createView().source(data);
		ds.transform({
			type: "rename",
			map: {
				kp_correct_percent: '本次测试知识点正确率',
				kp_correct_rating: '知识点累计掌握度'
			}
		}).transform({
			type: "fold",
			fields: ["知识点累计掌握度", "本次测试知识点正确率"],
			// 展开字段集
			key: "type",
			// key字段
			value: "value" // value字段
		  });
		return ds
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
		// const value_label = {
		// 	offset
		// }
		const scale = {
			value:{
				type:"linear",
				max:100
			}
		}
		let KPstatus=[];
		for (var i=0;i<eval_data.length;i++){
			KPstatus.push(
			<Card>
				<div>
					<Row type="flex" justify="center" align="middle">
						<Col span={8}>
							<h1>
								{eval_data[i].chapter_name}
							</h1>
						</Col>
						<Col span={8}>
						<Progress 
							type="circle"
							width={80}
							percent={eval_data[i].chapter_ratting} 
							format={(percent) => `${percent}%`}  
						/>
						</Col>
						<Col span={8}>
							<Progress 
							type="circle"
							width={80}
							percent={eval_data[i].chapter_correct_percent} 
							format={(percent) => `${percent}%`}  
						/>
						</Col>
					</Row>
					<Row type="flex" justify="center" align="middle">
						<Col span={8}></Col>
						<Col span={8}><span>知识点掌握度</span></Col>
						<Col span={8}><span>章节答题正确率</span></Col>
					</Row>
					<Row type="flex" justify="center" align="middle">
						<Col span={20}>
							<Chart height={300} padding={[ 20, 30, 20, 30]} data={this.dataProcess(eval_data[i].kp_status)} scale={scale} forceFit>
								<Legend />
								<Coord transpose scale={[1, -1]} />
								<Axis name="kp_name" label={kp_name_lable}/>
								<Axis name="value" visible={false} position={"right"}  />
								<Tooltip />
								<Geom
									type="interval"
									position="kp_name*value"
									color={"type"}
									size={10}
									adjust={[
										{
											type: "dodge",
											marginRatio: 0
										}
									]}
								>
									<Label
										content="value"
										// labelLine= "false"
										textStyle={{
										// textAlign: 'start', // 文本对齐方向，可取值为： start middle end
										// fill: '#404040', // 文本的颜色
										fontSize: '18', // 文本大小
										// fontWeight: 'bold', // 文本粗细
										// rotate: 0,
										// textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
										}}
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
			)
		}
		return KPstatus;
	}

    render () {
		const {eval_data,TestStatus,isFetching} = this.props;

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
					<Row type="flex" justify="center" align="middle">
						<Col span={4} offset={3}>
							<div>
							<Progress 
								type="circle"
								width={80}
								percent={TestStatus.correct_rate} 
								format={(percent) => `${percent}%`} 
							/>
							</div>
						</Col>
						<Col span={4} offset={3}>
							<p className="row_rate_time">{TestStatus.elapsed_time}</p>
						</Col>
						<Col span={6} offset={2}>
							<p className="row_rate_time">{TestStatus.finish_time}</p>
						</Col>
					</Row>
					<Row type="flex" justify="center" align="middle">
						<Col span={5} offset={3}>正确率</Col>
						<Col span={5} offset={2}>耗时</Col>
						<Col span={3} offset={3}>提交时间</Col>
					</Row>
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