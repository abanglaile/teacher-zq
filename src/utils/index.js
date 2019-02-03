import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper'
import { routerActions,push } from 'react-router-redux';
import config from './Config'

let redirect_uri = config.redirect_uri;

export function createConstants(...constants) {
    return constants.reduce((acc, constant) => {
        acc[constant] = constant;
        return acc;
    }, {});
}

export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];

        return reducer
            ? reducer(state, action.payload)
            : state;
    };
}

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

export function parseJSON(response) {
     return response.json()
}

export const requireAuthentication = UserAuthWrapper({
  authSelector: state => {
    // alert("state:"+JSON.stringify(state));
    return (state.AuthData);
  },

  predicate: AuthData => AuthData.get('isAuthenticated'),

  failureRedirectPath: (state, ownProps) => {
    console.log("ownProps:",ownProps);
    console.log("ownProps.location.query.redirect :",ownProps.location.query.redirect);
    var url = ownProps.location.pathname + ownProps.location.search;
    return url;

  },
//   redirectAction: routerActions.push,
  redirectAction: (newLoc) => {  
    console.log("newLoc:"+JSON.stringify(newLoc)); 
    console.log("newLoc.query.redirect:",newLoc.query.redirect);
    window.location.href = "http://www.zhiqiu.pro/zhiqiu-login/pc_login?redirect=" + newLoc.query.redirect;
  },
//   redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsJWTAuthenticated'
})
