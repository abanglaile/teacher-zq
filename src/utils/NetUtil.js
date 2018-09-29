import React, { Component } from 'react';
import 'whatwg-fetch';
import 'es6-promise';

class NetUtil extends React.Component{
    /*
     *  get请求
     *  url:请求地址
     *  data:参数
     *  callback:回调函数
     * */
    static get(url,params,callback){
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        //fetch请求
        fetch(url, {
            method: 'GET',
            mode: "cors",
            headers:{
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
            .then((response) => {

                return response.json();
            })
            .then((responseJSON) => {
                callback(responseJSON)
            }).catch((err) => {
                console.log(err);
            });
    }
    /*
     *  post请求
     *  url:请求地址
     *  data:参数
     *  callback:回调函数
     * */
    static post(url,params,headers,callback){
        //fetch请求
        fetch(url, {
            method: 'POST',
            mode: "cors",
            headers:{
                'Content-Type': 'application/json; charset=UTF-8',
                // 'token': headers
            },
            body:JSON.stringify(params)
        })
            .then((response) => response.json())
            .then((responseJSON) => {
                // console.log('responseJSON:'+responseJSON);
                callback(responseJSON)
            }).catch((err) => {
                console.log(err);
            });
    }
 
 
 
}
 
module.exports = NetUtil;