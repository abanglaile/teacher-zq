import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
// import createHistory from 'history/createBrowserHistory';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'

import * as auth_data from './Reducer/auth_data';
import * as reducer from './Reducer';
import {loginUserSuccess} from './Action';
// import {getWxUserInfoSuccess} from './Action/reg_action';
import routes from './Router/'; 
// import reducers from './reducers' // Or wherever you keep your reducers


// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(browserHistory)
// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(  
  combineReducers({
    ...reducer,
    ...auth_data,
    routing: routerReducer
  }),
  applyMiddleware(middleware, thunk)
);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

let token = localStorage.getItem('token');
console.log("app js token",token);
if (token !== null) {
    store.dispatch(loginUserSuccess(token));
    // store.dispatch(getWxUserInfoSuccess(token));
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
)