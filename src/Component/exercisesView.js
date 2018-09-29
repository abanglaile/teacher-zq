import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Row, Col, Menu, Select,Modal,Button,Badge,Dropdown,Popconfirm,Checkbox,Form,Input} from 'antd';
import NetUtil from '../utils/NetUtil';
import config from '../utils/Config';
import Styles from '../styles/KpExerciseView.css';
import Tex from './renderer.js';
import *as action from '../Action/';
import {connect} from 'react-redux';
import Zq_Header from '../containers/ZQ_Header';


const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
const Option = Select.Option;
const FormItem = Form.Item;

var urlip = config.server_url;

class OneExercise extends React.Component {
	constructor(props) {
		super(props);
		this.state={expand:false,display:'none'};
	}
	handleShow(){
		this.setState({expand:!this.state.expand});
		if(this.state.display === 'none'){
			this.setState({display:'block'});
		}
		else{
			this.setState({display:'none'});
		}
	}

	render(){
		const {expand,display} = this.state;
		if(this.props.exercise){
			const {title ,type, answer, breakdown} = this.props.exercise;
			const isinbasket = this.props.isinbasket;
			var steps = [];
			for(var j = 0; j < breakdown.length; j++) {
            	steps.push(
            	<div key={j} className="step_frame">
            		<p className="step_index">（{(j+1).toString()}）&nbsp;</p><Tex className="step_content" content={breakdown[j].content}/>
            		<div className="step_kpname"><a>{breakdown[j].kpname}</a></div>
            	</div>
            	);
        	}
        	var choice = eval(answer);
        	var answerDom = (
				type ?
					choice.map((item, i) => {
        				return(
            				<Row className="row_answer" type="flex" justify="start" align="middle">
            					<Col span={1}>
									<p><Checkbox checked={expand? item.correct:0} disabled ></Checkbox></p>
								</Col>
            					<Col span={18}>
									<Tex content={item.value} />
								</Col>
            				</Row>
            			);
					})
				: 
				<div className="step_answer">
					<p className="step_index">答案：&nbsp;</p>
					{choice.map((item, i) => {
        				return(
            				<div>
								<Tex className="step_content" content={item.value} />
            				</div>
            			);
					})}
				</div>
			);
        	return(
				<div className="exercise_frame">
					<div className="exercise_body_frame">
						<Tex content={title} />
						{answerDom}
					</div>
					<div style={{display}} className="kp_step">
						<p className="step_annouce">步骤：</p>
						<div>
							{steps}
						</div>
					</div>
					<div className="button_frame">
						<Button onClick={()=>this.handleShow()}>{!expand? "解题详情" : "收起详情"}</Button>
					</div>
				</div>
			);
		}
	}
}

class ExercisesView extends React.Component {
	constructor(props) {
		super(props);
		this.state={kpid:'',exer_data:[],menu_data:[],selmenu:[]};
	}

	componentDidMount(){
        var url = urlip+'/getBookChapter';
        NetUtil.get(url, {course_id:2}, (results) => {
            this.setState({menu_data : results});
        })
    }

    handleChange(value){
		const {exer_data , kpid} = this.state;//kpid为当前选中的知识点的id，exer_data是对应知识点的题目
        this.setState({ kpid: value },()=>{
            var data = [];
            var url = urlip+'/getExerciseByKp';
            NetUtil.get(url, {kpid : value}, (results) => {
                data = results;
                console.log("data:"+JSON.stringify(data));
                this.setState({ exer_data : data}); 
            })                         
        });
    }

	handleClick(e){
		var url = urlip+'/getChapterKp';
    	NetUtil.get(url, {chapter_id:e.key}, (results) => {
            this.setState({selmenu : results});
        })	
	}

	render(){
		const {exer_data,menu_data,selmenu} = this.state;
		if(menu_data){//存储章节的侧边栏信息
			var menuHtml = menu_data.map(function(bookmenu,index,input) {
                      var chaEl = [];
                      var chmenu = bookmenu.chapters;
                      for(var j = 0; j < chmenu.length; j++) {
                            chaEl.push(<Menu.Item key= {chmenu[j].chapterid}>{chmenu[j].chaptername}</Menu.Item>);
                      }
                      return(
                            <SubMenu key={bookmenu.bookid} title={<span><Icon type="mail" /><span>{bookmenu.bookname}</span></span>}>
                                {chaEl}
                            </SubMenu>
                      )
        	})
		}
		if(selmenu){
			var kps = [];//存储下拉框中的选项信息
            for (var i = 0; i < selmenu.length; i++) {
                kps.push(<Option key={selmenu[i].kpid} value={selmenu[i].kpid.toString()}>{selmenu[i].kpname}</Option>);
            }
		}

        var exerDatas = [];//展示选中知识点关联的题目
		for(var j = 0; j < exer_data.length; j++) {
            exerDatas.push(
            	<div key={exer_data[j].exercise_id}>
            		<OneExercise exercise={exer_data[j]}/>
            	</div>
            );
        }
		return(
			<Layout>
			    <Header style={{background: '#fff',height:'80px'}}>
			      <Zq_Header/>
			    </Header>
			    <Content style={{ padding: '24px 120px' }}>
			      <Layout style={{ padding: '24px 0', background: '#fff'}}>
			        <Sider width={300} style={{ background: '#fff' }}>
			            <Menu onClick = { (e) => this.handleClick(e) } style = {{ width: 300 } }
                            defaultSelectedKeys = {[this.state.current]}
                            defaultOpenKeys = {['4'] } 
                        	mode = "inline" 
                        >
                            {menuHtml}
                        </Menu >
			        </Sider>
			        <Content style={{ padding: '0 24px', minHeight: 280 }}>
			          <Row className="row_loc" type="flex" align="middle" justify="space-between">
						<Col span={12}>
						  <Select
						    showSearch
						    style={{ width: 300 }}
						    dropdownMatchSelectWidth={false}
						    placeholder="选择知识点"
						    optionFilterProp="children"
						    onChange={(value)=>this.handleChange(value)}
						    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
						  >
						    {kps}
						  </Select>
						</Col>
						<Col span={6}></Col>
						<Col span={6}></Col>
					  </Row>
					  <div>
						{exerDatas}
					  </div> 
			        </Content>
			      </Layout>
			    </Content>
			    <Footer style={{ textAlign: 'center' }}>
			      ExerciseView ©2017 Created by Bourne
			    </Footer>
			</Layout>
		);
	}
}

export default connect(state => {
  console.log(state);
  return {
  }
}, action)(ExercisesView);

