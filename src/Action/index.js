import { checkHttpStatus, parseJSON } from '../utils';
import { push } from 'react-router-redux'
import jwtDecode from 'jwt-decode';
// import fetch from 'isomorphic-fetch';
// import NetUtil from '../utils/NetUtil';
import config from '../utils/Config';
import axios from 'axios';

let target = config.server_url;

// export function loginUserSuccess(token) {
//   localStorage.setItem('token', token);
//   return {
//     type: 'LOGIN_USER_SUCCESS',
//     payload: {
//       token: token
//     }
//   }
// }

// export function regUserSuccess(token) {
//   localStorage.setItem('token', token);
//   return {
//     type: 'REG_USER_SUCCESS',
//     payload: {
//       token: token
//     }
//   }
// }

// export function loginUserFailure(error) {
//   localStorage.removeItem('token');
//   return {
//     type: 'LOGIN_USER_FAILURE',
//     payload: {
//       status: error.response.status,
//       statusText: error.response.statusText
//     }
//   }
// }

// export function regUserFailure(error) {
//   localStorage.removeItem('token');
//   return {
//     type: 'REG_USER_FAILURE',
//     payload: {
//       status: error.response.status,
//       statusText: error.response.statusText
//     }
//   }
// }

// export function loginUserRequest() {
//   return {
//     type: 'LOGIN_USER_REQUEST'
//   }
// }

// export function regUserRequest() {
//   return {
//     type: 'REG_USER_REQUEST'
//   }
// }

// export function logout() {
//     localStorage.removeItem('token');
//     return {
//         type: 'LOGOUT_USER'
//     }
// }

// export function logoutAndRedirect() {
//     return (dispatch, state) => {
//         dispatch(logout());
//         dispatch(push('/AuthJWT/login'));
//     }
// }

// export function loginUser(username, password, redirect) {
//     return function(dispatch) {
//         let url = target + '/login';
//         dispatch(loginUserRequest());
//         return fetch(url, {
//             method: 'post',
//             mode: "cors",
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//                 body: JSON.stringify({username: username, password: password})
//             })
//             .then(checkHttpStatus)
//             .then(parseJSON)
//             .then(response => {
//                 try {
//                     let decoded = jwtDecode(response.token);
//                     console.log('decoded:'+JSON.stringify(decoded));
//                     console.log('response.token:'+response.token);
//                     dispatch(loginUserSuccess(response.token));
//                     dispatch(push(redirect));
//                 } catch (e) {
//                     console.log('response.json():'+response.json());
//                     dispatch(loginUserFailure({
//                         response: {
//                             status: 403,
//                             statusText: response.json()
//                         }
//                     }));
//                 }
//             })
//             .catch(error => {
//                 console.log('error:'+error);
//                 dispatch(loginUserFailure(error));
//             })
//     }
// }

// export function regUser(username, password, redirect) {
//     return function(dispatch) {
//         let url = target + '/newuser';
//         dispatch(regUserRequest());
//         return fetch(url, {
//             method: 'post',
//             mode: "cors",
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//                 body: JSON.stringify({username: username, password: password})
//             })
//             .then(checkHttpStatus)
//             .then(parseJSON)
//             .then(response => {
//                 try {
//                     let decoded = jwtDecode(response.token);
//                     dispatch(regUserSuccess(response.token));
//                     dispatch(push(redirect));
//                 } catch (e) {
//                     dispatch(regUserFailure({
//                         response: {
//                             status: 403,
//                             statusText: response.json()
//                         }
//                     }));
//                 }
//             })
//             .catch(error => {
//                 dispatch(loginUserFailure(error));
//             })
//     }
// }
// //登录注册相关结束
// /*-------------------------------------------------------------------------------------------------------------*/

//开始获取数据
const getTestsStart = () => {
    return {
      type: 'GET_TESTS_START',
    }
}

//开始获取数据
const getClassgroupStart = () => {
    return {
      type: 'GET_CLASSGROUP_START',
    }
  }
  
//获取数据成功
const getClassgroupSuc = (json) => {
return {
        type: 'GET_CLASSGROUP_SUCESS',
        json,
    }
}

//开始获取数据
const getGroupDataStart = () => {
    return {
      type: 'GET_GROUPDATA_START',
    }
  }


//开始获取数据
const getBookmenuStart = () => {
    return {
      type: 'GET_BOOKMENU_START',
    }
  }

//开始获取数据
const getSelectmenuStart = () => {
    return {
      type: 'GET_SELECTMENU_START',
    }
  }
  

export const addToBasket = (data) =>{
    return {
        type: 'ADD_BASKET_DATA',
        data
    }
}

export const deleteFromBasket = (exerciseid) =>{
    return {
        type: 'DEL_BASKET_DATA',
        exerciseid
    }
}

//清除试题篮里数据
const clearBasketData = () => {
  console.log("clear!!!");
  return {
        type: 'CLEAR_BASKET_DATA',
  }
}

const changeTestState = (index,time) => {
    return {
            type: 'CHANGE_TEST_STATE',
            index,
            time
    }
}


// =============================================/接口/====================================================

/*---------------------------------------获取目录菜单----------------------------------*/


export const fetchBookMenu = (course_id) => {
    let url = target + "/getBookChapter";
    return dispatch => {
        dispatch(getBookmenuStart());
        return axios.get(url,{
            params:{
                course_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_BOOKMENU_SUCESS',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}



export const fetchSelectMenu = (chapter_id) => {
    let url = target + "/getChapterKp";
    return dispatch => {
        dispatch(getSelectmenuStart());
        return axios.get(url,{
            params:{
                chapter_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_SELECTMENU_SUCESS',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

/*---------------------------------------测试中心----------------------------------*/
//根据teacherid 获取老师创建的所有测试
export const getTestTable = (teacher_id) => {
    let url = target + "/getTestTable";
    return dispatch => {
        dispatch(getTestsStart());
        return axios.get(url,{
            params:{
                teacher_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_TESTS_SUCESS',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

// 保存新建测试信息，并上传后台
export const saveNewTest = (postData) => {
    let url = target + "/addNewTest";
    return dispatch => {
        return axios.post(url,{postData})
        .then(function (response) {
            dispatch(clearBasketData());
            dispatch({
                type : 'ADD_NEW_TEST',
                testname : postData.test_name,
                testid : response.data.test_id
            });
            dispatch(push("/teacher-zq/root/testcenter"));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}



export const delOneTest = (test_id,index) => {
    let url = target + "/deleteOneTest";
    return dispatch => {
        return axios.post(url,{test_id})
        .then(function (response) {
            dispatch({
                type : 'DEL_ONE_TEST',
                index : index
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}


//将试题要分发的班级和个人 传递到后台
export const distributeTest = (keys,test_id,index) => {
    let url = target + "/distributeTest";
    return dispatch => {
        return axios.post(url,{keys,test_id})
        .then(function (response) {
            dispatch({
                type : 'CHANGE_TEST_STATE',
                index : index,
                time : response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}


export const getTestDetail = (test_id) => {
    let url = target + "/getTestDetail";
    return dispatch => {
        return axios.get(url,{
            params:{
                test_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_TEST_DETAIL_SUCESS',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getTestInfoById = (test_id) => {
    let url = target + "/getTestInfoById";
    return dispatch => {
        return axios.get(url,{
            params:{
                test_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_TEST_INFO_SUCESS',
                json : response.data[0], 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getTestKpResult = (test_id) => {
    let url = target + "/getTestKpResult";
    return dispatch => {
        return axios.get(url,{
            params:{
                test_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_TEST_KP_SUCESS',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getTestResultInfo = (test_id) => {
    let url = target + "/getTestResultInfo";
    return dispatch => {
        return axios.get(url,{
            params:{
                test_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_TEST_RES_TABLE',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}


/*---------------------------------------班级管理----------------------------------*/

//根据教师username获取 下带的班级分组数据
export const getClassGroup = (teacher_id) => {
    let url = target + "/getClassGroup";
    return dispatch => {
        dispatch(getClassgroupStart());
        return axios.get(url,{
            params:{
                teacher_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_CLASSGROUP_SUCESS',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}


//根据班级id获取 班级里的学生信息
export const getGroupData = (stu_group_id) => {
    let path = "/getGroupData";
    let url = target + path;
    return dispatch => {
        dispatch(getGroupDataStart());
        return axios.get(url,{
            params:{
                stu_group_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_GROUPDATA_SUCESS',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//新建老师管理的班级分组，并传到后台
export const addNewGroup = (teacher_id,group_name) => {
    let url = target + "/addNewGroup";
    return dispatch => {
        return axios.post(url,{teacher_id,group_name})
        .then(function (response) {
            dispatch({
                type: 'ADD_NEW_GROUP',
                groupname : group_name,
                groupid : response.data
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//删除老师管理的班级分组（包括分组里的学生信息）
export const delOneGroup = (stu_group_id) => {
    let url = target + "/deleteOneGroup";
    return dispatch => {

        return axios.post(url,{stu_group_id})
        .then(function (response) {
            dispatch({
                type: 'DEL_ONE_GROUP',
                groupid : stu_group_id,
            });
        })
        .catch(function (error) {
            console.log(error);
        });

    }
}

//删除班级分组里单个学生信息
export const delOneStu = (student_id,index) => {
    let url = target + "/deleteOneStudent";
    return dispatch => {
        return axios.post(url,{student_id})
        .then(function (response) {
            dispatch({
                type : 'DEL_ONE_STUDENT',
                index : index,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//新增班级分组里单个学生信息
export const addOneStu = (values,id) => {
    let url = target + "/addOneStudent";
    return dispatch => {
        return axios.post(url,{
                    student_name:values.stuname,
                    student_id:values.stuid,
                    phone_num:values.phonenum,
                    stu_group_id:id
                })
        .then(function (response) {
            dispatch({
                type: 'ADD_ONE_STUDENT',
                values : values,
                groupid : id
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

/*---------------------------------------学生能力信息----------------------------------*/

export const getStuInfoById = (student_id) => {
    let path = "/getStuInfoById";
    let url = target + path;
    return dispatch => {
        return axios.get(url,{
            params:{
                student_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_STU_INFO_SUCESS',
                json: response.data[0],
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getStuAbility = (student_id,course_id) => {
    let path = "/getStuAbility";
    let url = target + path;
    return dispatch => {
        return axios.get(url,{
            params:{
                student_id,
                course_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_STU_ABILITY_SUCESS',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getStuRatingHistory = (student_id) => {
    let path = "/getStuRatingHistory";
    let url = target + path;
    return dispatch => {
        return axios.get(url,{
            params:{
                student_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_STU_LADDER_SUCESS',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getStuComUsedKp = (student_id) => {
    let path = "/getStuComUsedKp";
    let url = target + path;
    return dispatch => {
        return axios.get(url,{
            params:{
                student_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_STU_COMUSEDKP_SUCESS',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getStuRecentKp = (student_id) => {
    let path = "/getStuRecentKp";
    let url = target + path;
    return dispatch => {
        return axios.get(url,{
            params:{
                student_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_STU_RECENTKP_SUCESS',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getKpWithScore = (chapter_id, student_id) => {
    let path = "/getKpWithScore";
    let url = target + path;
    return dispatch => {
        return axios.get(url,{
            params:{
                chapter_id,
                student_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_KP_SCORE_SUCESS',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}