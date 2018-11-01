import {push} from 'react-router-redux'
import config from '../utils/Config'
import axios from 'axios';

// const AppID = 'wx6f3a777231ad1747';
// const AppSecret = '881a3265d13a362a6f159fb782f951f9';


let target = config.server_url;

/*-------------------------------------------------*/
//登录注册相关action

export const loginUser = (username, password, redirect) => {
   
    let path = '/login';
    let url = target + path;

    // dispatch(loginUserRequest());

    return (dispatch) => {
        return axios.get(url,{
            params:{
                username,
                password,
            }
        })
        .then(function (response) {
            if(response.data){
                console.log("response.data :",response.data);
                dispatch(push(redirect));
            }else{
                alert("用户名或密码错误");
            }
            
        })
        .catch(function (error) {
            // dispatch(loginUserFailure(error));
        });
    }
    
}

export const regUser = (username, password, redirect) => {
    let url = target + "/signup";
    return dispatch => {
        return axios.post(url,{username,password})
        .then(function (response) {
            console.log("response.data :",JSON.stringify(response.data));
            if(response.data.signMsg == 'failed'){
                alert("注册失败！");
            }else if(response.data.signMsg == 'existed'){
                alert("用户已存在");
            }else{
                alert("注册成功");
                dispatch(push(redirect));
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    
}