import React from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Checkbox,Tabs } from 'antd';
import RegView from './register';
import *as action from '../Action/auth_action';
import * as style from '../styles/Login.css';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    const redirectRoute = this.props.location.query.redirect || '/teacher-zq/root';
    this.state = {
      confirmDirty: false,
      username: '',
      password: '',
      redirectTo: redirectRoute
    };
  }

  handleSubmitLogin(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log('values.userName:'+values.userName);
        console.log('values.password:'+values.password);
        console.log('this.state.redirectTo:'+this.state.redirectTo);
        this.setState({username:values.userName,password:values.password},()=>{
          this.props.loginUser(values.userName, values.password, this.state.redirectTo);
        });
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='div_tab'>

        <Tabs type='card'>

          <TabPane tab="登录" key="1">
            <Form onSubmit={(e)=>this.handleSubmitLogin(e)} className="login-form">
              <FormItem>
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                  <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox>Remember me</Checkbox>
                )}
                <a className="login-form-forgot" href="">忘记密码</a>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  登录
                </Button>
                <a href="">免费注册</a>
              </FormItem>
            </Form>
          </TabPane>

          <TabPane tab="注册" key="2">
            <RegView/>
          </TabPane>

        </Tabs>

      </div>
    );
  }
}

const  LoginView = Form.create()(LoginForm);
export default connect(state => {
  console.log(state);
  return {
    
  }
}, action)(LoginView);
