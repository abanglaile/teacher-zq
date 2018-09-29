import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Layout, Icon, Menu,Table} from 'antd';
import Styles from '../styles/stu_capacity.css';
import *as action from '../Action/';
import {connect} from 'react-redux';
import config from '../utils/Config';

const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

var urlip = config.server_url;

class KpAbility extends React.Component {
	constructor(props) {
		super(props);
		this.state={current:'163840'};
		this.columns = [{
            title: '知识点名称',
            dataIndex: 'kpname',
            width: '50%',
        }, {
            title: '能力分值',
            dataIndex: 'kp_rating',
            width: '20%',
        }, {
            title: '最近更新时间',
            dataIndex: 'update_time',
            width: '30%',
            render: (text, record, index) => {
              return(
              	text ?
              	(
              	  <div>
					  <p>{text.split('T')[0]}</p>
				  </div>
              	) : ''
              );
            },
        }];
	}

	componentDidMount(){
        //course_id 为3
        this.props.fetchBookMenu(3);
	}

	handleClick(e){
        const {student_id} = this.props;
        this.setState({ current: e.key });
        if(student_id){
            this.props.getKpWithScore(e.key,student_id);
        }
	}

	render(){
        const {menu_data, kp_data} = this.props;
        
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
        if(kp_data){
            return(
                <Layout style={{ padding: '24px 0', background: '#fff'}}>
                    <Sider width={200} style={{ background: '#fff' }}>
                        <Menu onClick = { (e) => this.handleClick(e) } style = {{ width: 200 } }
                            defaultSelectedKeys = {[this.state.current]}
                            defaultOpenKeys = {['1'] } 
                            mode = "inline" 
                        >
                            {menuHtml}
                        </Menu >
                    </Sider>
                    <Content style={{ padding: '0 24px', minHeight: 280 }}>
                    < Table columns = { this.columns } dataSource = { kp_data }/> 
                    </Content>
                </Layout>
            );
        }
	}
}

export default connect(state => {
    const student_data = state.studentData.toJS();
    const {kp_data} = student_data;	
    return {
      kp_data : kp_data,
      menu_data: state.bookMenuData.get('bookmenu_data').toJS(), 
    }
  }, action)(KpAbility);