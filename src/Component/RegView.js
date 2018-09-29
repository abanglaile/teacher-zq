import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button} from 'antd';
import *as actionCreators from '../Action/';

import * as style from '../styles/Login.css';

const FormItem = Form.Item;
const formLayout = 'horizontal';

class RegForm extends React.Component {

  constructor(props) {
    super(props);
    const redirectRoute = '/AuthJWT/t_center';
    this.state = {
      confirmDirty: false,
      usrname: '',
      password: '',
      redirectTo: redirectRoute
    };
  }

  handleSubmitReg(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log('this.state.redirectTo:'+this.state.redirectTo);
        this.setState({usrname:values.usrname,password:values.password},()=>{
          this.props.actions.regUser(values.usrname, values.password, this.state.redirectTo);
        });
      }
    });
  }

  handleConfirmBlur(e){  //失焦的时候触发
    const value = e.target.value;
    console.log('e.target.value:'+value);
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  checkConfirm(rule, value, callback){
    const form = this.props.form;
    console.log('value:'+value);
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  checkPassword(rule, value, callback){
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
          <Form onSubmit={(e)=>this.handleSubmitReg(e)} className="reg-form">
            <FormItem label="账户" hasFeedback>
              {getFieldDecorator('usrname', {
                rules: [{
                  required: true, message: 'Please input your usrname!',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="密码" hasFeedback>
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: 'Please input your password!',
                }, {
                  validator: (rule, value, callback)=>this.checkConfirm(rule, value, callback),
                }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem label="确认密码" hasFeedback>
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: 'Please confirm your password!',
                }, {
                  validator: (rule, value, callback)=>this.checkPassword(rule, value, callback),
                }],
              })(
                <Input type="password" onBlur={(e)=>this.handleConfirmBlur(e)} />
              )}
            </FormItem>
            <Button type="primary" htmlType="submit">注册</Button>
          </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticating   : state.AuthData.get('isAuthenticating'),
  statusText         : state.AuthData.get('statusText')
});

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

const  RegView = Form.create()(RegForm);
export default connect(mapStateToProps, mapDispatchToProps)(RegView);
