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