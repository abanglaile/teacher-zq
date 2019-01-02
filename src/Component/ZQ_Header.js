import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Row, Col} from 'antd';
import {Icon, Menu, Button,Dropdown} from 'antd';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../Action';


class Zq_Header extends React.Component{
    
    componentDidMount () {
        // this.fetchData();
        console.log("statusText:"+this.props.statusText);
        console.log("userName:"+this.props.userName);
    }

    // fetchData () {
    //     let token = this.props.authData.token;
    //     this.props.actions.fetchProtectedData(token);
    // }
    handleMenuClick(e){
      if(e.key == 2){
        this.props.actions.logoutAndRedirect();
      }else{

      }
    }


    render(){
      const usr = this.props.userName;
      // const {dispatch} = this.props;
      const menu = (
        <Menu onClick={(e)=>this.handleMenuClick(e)}>
          <Menu.Item key="1">个人中心</Menu.Item>
          <Menu.Item key="2">退出</Menu.Item>
        </Menu>
      );

      return( 
          <div style={{ margin: '0 70px' }}>
            <Row type="flex" align="bottom" justify="space-between">
              <Col span={4}> 
                <Link to="/teacher-zq/root">
                  <img src="/teacher-zq/img/知秋.jpg" width="171" height="80" alt="logo"/>
                </Link>
              </Col>
              <Col span={3}>
                <div style={{ margin: '20px 0',float:'right'}}>
                  <Dropdown overlay={menu}>
                    <Button>
                      {usr} <Icon type="down" />
                    </Button>
                  </Dropdown>
                </div>
              </Col>
            </Row>
          </div>  
      );
    }
}

const mapStateToProps = (state) => ({
    userName: state.AuthData.get('userName')
});

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Zq_Header);
