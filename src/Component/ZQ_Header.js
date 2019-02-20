import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Row, Col} from 'antd';
import {Icon, Menu, Button, Dropdown, Avatar } from 'antd';
import {connect} from 'react-redux';
import {Link} from 'react-router';
// import { bindActionCreators } from 'redux';
// import * as actionCreators from '../Action';
import *as action from '../Action/';


class Zq_Header extends React.Component{
    
    componentDidMount () {
      const {userid} = this.props;
      // console.log("userid:",userid);
      this.props.getUserInfo(userid);
    }

    handleMenuClick(e){
      if(e.key == 2){
        this.props.logoutAndRedirect();
      }
    }


    render(){
      const {username ,imgurl, realname} = this.props;
      const menu = (
        <Menu onClick={(e)=>this.handleMenuClick(e)}>
          <Menu.Item key="1"><Icon type="user" />{realname}</Menu.Item>
          <Menu.Divider />
          <Menu.Item key="2"><Icon type="poweroff" />退出登录</Menu.Item>
        </Menu>
      );

      return( 
          <div style={{ margin: '0 70px' }}>
            <Row type="flex" align="top" justify="space-between">
              <Col span={4}> 
                <Link to="/teacher-zq/root">
                  {/* <img src="../../img/知秋3.jpg" height="80" alt="logo"/> */}
                  <img src="/teacher-zq/img/知秋3.jpg" height="80" alt="logo"/>
                </Link>
              </Col>
              <Col span={3}>
                <div style={{ margin: '20px 0',float:'right'}}>
                  <Dropdown overlay={menu} placement="bottomRight">
                    <div>
                      {imgurl ? <Avatar src={imgurl} /> : <Avatar icon="user" />}
                      <span style={{verticalAlign:'middle',marginLeft:'1rem',fontSize:'1rem',color:'#40a9ff'}}>{username}</span>
                    </div>
                  </Dropdown>
                </div>
              </Col>
            </Row>
          </div>  
      );
    }
}

export default connect(state => {
  // console.log(state);
  console.log('state.AuthData:',JSON.stringify(state.AuthData));
  return {
    userid: state.AuthData.get('userid'),
    username: state.AuthData.get('username'),
    imgurl: state.AuthData.get('imgurl'),
    nickname: state.AuthData.get('nickname'),
    realname: state.AuthData.get('realname'),
  }
}, action)(Zq_Header);
