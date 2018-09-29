import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Row, Col, Menu, Select,Modal,Button,Badge,Dropdown,Popconfirm,Checkbox,Form,Input} from 'antd';
import NetUtil from '../utils/NetUtil';
import Styles from '../styles/KpExerciseView.css';
import Tex from './renderer.js';
import *as action from '../Action/';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import config from '../utils/Config';
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
	handleAddtoBasket(){
		this.props.onValueBack(this.props.exercise);
	}
	handleRemovefromBasket(){
		this.props.onValueRemove(this.props.exercise);
	}
	render(){
		const {expand,display} = this.state;
		// console.log("isinbasket:"+isinbasket);
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
						<Button className="basket_button" onClick={!isinbasket? ()=>this.handleAddtoBasket() : ()=>this.handleRemovefromBasket()} type={!isinbasket? "primary" : ""}>
							{!isinbasket? "加入试题篮" : "移出试题篮"}
						</Button>	
					</div>
				</div>
			);
		}
	}
}

class OneExerView extends React.Component {
	constructor(props){
		super(props);
	}
	handleDelete(){
		this.props.onDelValue(this.props.exercise);
	}
	render(){
		if(this.props.exercise){
			const {title ,type, answer, breakdown} = this.props.exercise;
        	var choice = eval(answer);
        	var answerDom = (
				type ?
					choice.map((item, i) => {
        				return(
            				<Row className="row_answer" type="flex" justify="start" align="middle">
            					<Col span={1}>
									<p><Checkbox checked={item.correct} disabled ></Checkbox></p>
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
					<div className="button_frame">
						<Button onClick={()=>this.handleDelete()}>删除</Button>	
					</div>
				</div>	
			);
		}
	}
}

class AddTestForm extends React.Component {}
AddTestForm = Form.create({})(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
			  labelCol: { span: 4 },
			  wrapperCol: { span: 12 },
		  };
    return (
      <Modal  
      	title="提交试题" 
      	visible={visible} 
      	width={500} 
      	onOk={onCreate} 
      	onCancel={onCancel} 
      	okText="提交"
      >
        <Form>
			<FormItem {...formItemLayout} label="试卷名称"> 
	          {getFieldDecorator('testname', {
	            rules: [{ required: true, message: '请输入试卷名称!' }],
	          })(
	            <Input />
	          )}
	        </FormItem>
		</Form>
      </Modal>
    );
  }
); 

class KpExerciseView extends React.Component {
	constructor(props) {
		super(props);
		this.state={previsible:false,provisible:false,vicurrent:'',kpid:'',exer_data:[]};
	}

	componentDidMount(){
      this.loadBookMenu();
    }

	loadBookMenu(){

      var url = "/getBookChapter";
      //this.setState({isLoading: true});
      console.log(this.props.fetchPosts);
      this.props.fetchBookMenu(url, {course_id:3});
	}

	handlePreView(){
		this.setState({previsible: true});
	}

	handleProduce(){
		if(this.props.basket_tests.length > 0){
			this.setState({provisible: true});
		}
	}

	handleToBasket(currentData){
		this.props.addToBasket(currentData);
	}

	handleRemoveBasket(currentData){
		this.props.deleteFromBasket(currentData);
	}

	handlePreOk(){
		if(this.props.basket_tests.length > 0){
			this.setState({
		      previsible: false,
		      provisible: true,
		    });
	    }
	}
		

	handlePreCancel(){
	    this.setState({
	      previsible: false,
	    });
    }

    handleProOk(){
    	var url = "/addNewTest";
    	const form = this.form;
    	const {basket_tests} = this.props;
	    form.validateFields((err, values) => {
	      if (err) {
	        return;
	      }
	      // console.log("this.form.values:"+JSON.stringify(values));
	      this.setState({
		      provisible: false,
		  });
		  var test_exerid = [];
		  console.log("basket_tests:"+JSON.stringify(this.props.basket_tests));
		  for(var j = 0; j < basket_tests.length; j++) {
		  	 test_exerid.push(basket_tests[j].exercise_id)
          }
		  console.log("test_exerid:"+test_exerid);
		  var postdata = {"test_name":values.testname,"teacher_id":1,"test_exercise":test_exerid};
	      this.props.saveNewTest(url,postdata);
	    });
	}

	handleProCancel(){
	    this.setState({
	      provisible: false,
	    });
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
		// console.log("e.key:"+e.key);
		var url = "/getChapterKp";
		this.props.fetchSelectMenu(url, {chapter_id:e.key});	
	}

	saveFormRef(form){
		this.form = form;
	}

	render(){
		const {exer_data,previsible,provisible} = this.state;
		const {menu_data,selmenu,basket_tests} = this.props;
		console.log("basket_tests count:"+basket_tests.length);
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
		const menu = (
		  <Menu>
		    <Menu.Item className="menu_item">
		      <Button onClick={()=>this.handlePreView()} type="primary">试题预览</Button>
		    </Menu.Item>
		    <Menu.Item className="menu_item">
		      <Button onClick={()=>this.handleProduce()} type="primary">生成试卷</Button>
		    </Menu.Item>
		  </Menu>
		);
		if(basket_tests){//试题篮中题目预览
			var exerViews = [];
			for(var j = 0; j < basket_tests.length; j++) {
	            exerViews.push(
	            	<div key={j}>
	            		<OneExerView exercise={basket_tests[j]} onDelValue={(currentData)=>this.handleRemoveBasket(currentData)}/>
	            	</div>
	            );
	        }
		}
        var exerDatas = [];//展示选中知识点关联的题目
		for(var j = 0; j < exer_data.length; j++) {
			var isin = 0;
			if(basket_tests){
				for(var k = 0; k < basket_tests.length; k++){
					if(exer_data[j].exercise_id === basket_tests[k].exercise_id){
						isin = 1;
					}
				}
			}
            exerDatas.push(
            	<div key={exer_data[j].exercise_id}>
            		<OneExercise exercise={exer_data[j]} isinbasket={isin} onValueBack={(currentData)=>this.handleToBasket(currentData)} onValueRemove={(currentData)=>this.handleRemoveBasket(currentData)}/>
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
			          <Modal title="试题预览" visible={previsible} width={700} onOk={()=>this.handlePreOk()} onCancel={()=>this.handlePreCancel()} okText="生成试卷">
				          {exerViews}
				      </Modal>
				      <AddTestForm
				          ref={(form)=>this.saveFormRef(form)}
				          visible={provisible}
				          onCancel={()=>this.handleProCancel()}
				          onCreate={()=>this.handleProOk()}
				       />
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
						<Col span={6}>
							<div style={{float:'right'}}>
								<Dropdown overlay={menu} placement="bottomRight">
									<Badge count={basket_tests.length} style={{}}>
							          	<Button className="basket_pro">
							          		<Icon className="icon_basket" type="shopping-cart" />
							          		<a className="ant-dropdown-link" href="#">我的试题篮<Icon type="down" /></a>
							          	</Button>
						          	</Badge>
								</Dropdown>
							</div>
						</Col>
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
    menu_data: state.fetchBookMenuData.bookmenu_data,   //左侧可选科目栏数据
    selmenu:state.fetchSelMenuData.selmenu_data,       //栏目下的具体知识点
	basket_tests : state.basketDataMonitor.basket_data,
  }
}, action)(KpExerciseView);

