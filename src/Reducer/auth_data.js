import Immutable from 'immutable'
import jwtDecode from 'jwt-decode';

const defaulatAuthData = Immutable.fromJS({
        token: null,
        nickname: null,
        imgurl:null,
        realname:null,
        username: 'fei',
        // userid: '3044f0f040ba11e9ad2ca1607a4b5d90',
        // userid: '1927560040d911e9ad2ca1607a4b5d90',
        userid: 1,
        isAuthenticated: false,
        isAuthenticating: false,
        statusText: null
});

//获取鉴权数据
export const AuthData = (state = defaulatAuthData, action = {}) => {
    switch(action.type){
        case 'LOGIN_USER_REQUEST':
            return state.set('isAuthenticating', true);
        case 'REG_USER_REQUEST':
            return state.set('isAuthenticating', true);
        case 'LOGIN_USER_SUCCESS':
            console.log("action.token:",action.token);
            var obj = JSON.parse(action.token);
            console.log("action username:",obj.identifier);
            console.log("action userid:",obj.userid);
            return state.set('isAuthenticating', false)
                    .set('isAuthenticated',true)
                    .set('username',obj.identifier)
                    .set('userid',obj.userid);
        case 'GET_USERINFO_SUCESS':
            return state.set('nickname',action.json.nickname)
                    .set('imgurl',action.json.avatar)
                    .set('realname',action.json.realname);
        case 'REG_USER_SUCCESS':
            var sucRegState = {
                isAuthenticating: false,
                isAuthenticated: true,
                token: action.payload.token,
                userName: jwtDecode(action.payload.token).username,
                userid: jwtDecode(action.payload.token).userid,
                statusText: 'You have been successfully registered.'
            };
            return Immutable.fromJS(sucRegState);
        case 'LOGIN_USER_FAILURE':
            var failState = {
                isAuthenticating: false,
                isAuthenticated: false,
                token: null,
                userName: null,
                userid: null,
                statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`
            };
            return Immutable.fromJS(failState);
        case 'REG_USER_FAILURE':
            var failRegState = {
                isAuthenticating: false,
                isAuthenticated: false,
                token: null,
                userName: null,
                userid: null,
                statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`
            };
            return Immutable.fromJS(failRegState);
        case 'LOGOUT_USER':
            return state.set('isAuthenticated', false)
                    .set('username',null)
                    .set('userid',null)
                    .set('imgurl',null)
                    .set('realname',null);
        default:
            return state;
    }
}