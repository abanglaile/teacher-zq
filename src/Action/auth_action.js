import {push} from 'react-router-redux'
import config from '../utils/Config'
import axios from 'axios';

// const AppID = 'wx6f3a777231ad1747';
// const AppSecret = '881a3265d13a362a6f159fb782f951f9';


let target = config.server_url;

/*-------------------------------------------------*/
//登录注册相关action
export const loginUserSuccess = (token) => {
    localStorage.setItem('token', token);
    return {
      type: 'LOGIN_USER_SUCCESS',
      token: token,
    }
}
