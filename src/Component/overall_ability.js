import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import createG2 from 'g2-react';
import { Stat } from 'g2';
import { Row, Col,Tabs,Progress} from 'antd';
import Styles from '../styles/stu_capacity.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
import config from '../utils/Config';
import ComUsedKp from './comused_kp.js'

var urlip = config.server_url;

const TabPane = Tabs.TabPane;


const Line = createG2((chart) => {
    var defs = {
    procount: {
      type: 'linear',
      alias:'练习题数',
      nice : false,
    },
    score: {
      type: 'linear',
      alias:'天梯分数',
      tickCount : 6,
    },
  };

  // console.log(chart);
  chart.source(chart._attrs.data,defs);
  chart.line().position('procount*score').size(2);
  chart.render();
});

class LadderScore extends React.Component {
  constructor(props) {
      super(props);
      this.state={
          data: this.props.ladder,
          width: 520,
          height: 250,
          plotCfg: {
            margin: [10, 50, 50, 85],
          },
      };
  }
  componentWillReceiveProps(nextProps){
      if(nextProps.ladder !== this.state.data){
          this.setState({data : nextProps.ladder});
      }
  }
  render(){
      return (
        <div>
          <Line
            data={this.state.data}
            width={this.state.width}
            height={this.state.height}
            plotCfg={this.state.plotCfg}
          />
        </div>
      );
  }
}

class OverallAbility extends React.Component{
	constructor(props) {
		super(props);
		this.state={ activeKey : '1'};
	}
	componentDidMount(){
        const { student_id } = this.props;
        if(student_id){
            //course_id = 3 
            this.props.getStuAbility(student_id, 3);
            this.props.getStuRatingHistory(student_id);
        }


    }
	onTabChange(key){
		this.setState({activeKey : key});
	}
	render(){
        const {activeKey} = this.state;
        const {capatity, ladder, student_id} = this.props;// ladder这里需要修改
		console.log('capatity: '+JSON.stringify(capatity));
		if(capatity.length){
	    	return(
	    	  <div>
	    	  	<div className="tab_content">
	    	  		<p className="p_tab_content">综合概况</p>
			        <Tabs size='small' tabPosition='left' onChange={(key)=>this.onTabChange(key)} activeKey={activeKey}>
			          <TabPane tab="全部" key="1">
				        <Row type="flex" justify="start">
							<Col span={5}><p className="p_header">练题数</p></Col>
							<Col span={5}><p className="p_header">正确率</p></Col>
							<Col span={5}><p className="p_header">天梯分</p></Col>
						</Row>
			          	<Row align="middle" type="flex" justify="start" className="row_content">
							<Col span={5}><p className="p_content">{capatity[0].exercount}</p></Col>
							<Col span={5}><div className="p_content"><Progress type="circle" percent={capatity[0].rate} width={60} format={(percent) => `${percent}%`}/></div></Col>
							<Col span={5}><p className="p_content">{capatity[0].ladderscore}</p></Col>
						</Row>
			          </TabPane>
			          <TabPane tab="近20题" key="2">
			          	<Row type="flex" justify="start">
							<Col span={5}><p className="p_header">练题数</p></Col>
							<Col span={5}><p className="p_header">正确率</p></Col>
							<Col span={5}><p className="p_header">天梯分变化</p></Col>
						</Row>
			          	<Row align="middle" type="flex" justify="start" className="row_content">
							<Col span={5}><p className="p_content">{capatity[1].exercount}</p></Col>
							<Col span={5}><div className="p_content"><Progress type="circle" percent={capatity[1].rate} width={60} format={(percent) => `${percent}%`}/></div></Col>
							<Col span={5}><p className="p_content">{capatity[1].ladderscore>0? "+"+capatity[1].ladderscore : "-"+Math.abs(capatity[1].ladderscore)}</p></Col>
						</Row>
			          </TabPane>
			          <TabPane tab="近50题" key="3">
			          	<Row type="flex" justify="start">
							<Col span={5}><p className="p_header">练题数</p></Col>
							<Col span={5}><p className="p_header">正确率</p></Col>
							<Col span={5}><p className="p_header">天梯分变化</p></Col>
						</Row>
			          	<Row align="middle" type="flex" justify="start" className="row_content">
							<Col span={5}><p className="p_content">{capatity[2].exercount}</p></Col>
							<Col span={5}><div className="p_content"><Progress type="circle" percent={capatity[2].rate} width={60} format={(percent) => `${percent}%`}/></div></Col>
							<Col span={5}><p className="p_content">{capatity[2].ladderscore>0? "+"+capatity[2].ladderscore : "-"+Math.abs(capatity[2].ladderscore)}</p></Col>
						</Row>
			          </TabPane>
			        </Tabs>
		        </div>
		        <div className="d_ladder">
		        	<p className="p_ladder_title">天梯积分</p>
		        	<LadderScore ladder={ladder}/>
		        </div>
		        <div className="d_kp">
		        	<p className="p_d_kp">常练知识点</p>
		        	<ComUsedKp student_id={student_id}/>
		        </div>
		      </div>
	    	);
    	}else{
            return null;
        }
	}
}

export default connect(state => {
  const student_data = state.studentData.toJS();
  const {capatity, ladder} = student_data;	
  return {
    capatity : capatity,
    ladder : ladder,
  }
}, action)(OverallAbility);