import { checkHttpStatus, parseJSON } from '../utils';
import { push } from 'react-router-redux'
import config from '../utils/Config';
import { message } from 'antd';
import moment from 'moment';
import axios from 'axios';

let target = config.server_url;
/*-------------------------------------------登陆登出相关----------------------------------------------*/
export const loginUserSuccess = (token) => {
    localStorage.setItem('token', token);
    return {
      type: 'LOGIN_USER_SUCCESS',
      token: token,
    }
}

export const logout = () => {
  localStorage.removeItem('token');
  return {
      type: 'LOGOUT_USER',
  }
}

export const logoutAndRedirect = () => {
  return (dispatch) => {
      dispatch(logout());
      dispatch(push('/teacher-zq/root'));
  }
}

// //登录注册相关结束
// /*-------------------------------------------------------------------------------------------------------------*/

//开始获取数据
const getTestsStart = () => {
    return {
      type: 'GET_TESTS_START',
    }
}

//开始获取小程序码数据
const getXcxCodeStart = () => {
    return {
      type: 'GET_XCXCODE_START',
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
  

export const addToBasket = (data) => {
    return {
        type: 'ADD_BASKET_DATA',
        data
    }
}

export const deleteFromBasket = (exercise_id) => {
    return {
        type: 'DEL_BASKET_DATA',
        exercise_id
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
/*---------------------------------------获取个人信息----------------------------------*/

export const getUserInfo = (userid) => {
    let url = target + "/getUserInfo";
    return dispatch => {
        dispatch(getBookmenuStart());
        return axios.get(url,{
            params:{
                userid,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_USERINFO_SUCESS',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

/*---------------------------------------获取目录菜单以及知识点对应题目----------------------------------*/
export const getCourse = () => {
    let url = target + "/getCourse";
    return (dispatch) => {
        return axios.get(url).then(function(response){
            dispatch({
                type: 'GET_COURSE',
                course: response.data,
            })            
        })
    }
}

export const setCourseId = (value) => {
    return {
        type: 'SET_COURSE_ID',
        data: value,
    }
}

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

export const getExerciseByKp = (kpid) => {
    let url = target + "/getExerciseByKp";
    return dispatch => {
        return axios.get(url,{
            params:{
                kpid,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_KP_EXERCISE_SUCESS',
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
export const saveNewTest = (test_name,teacher_id,test_exercise,course_id) => {
    let url = target + "/addNewTest";
    return dispatch => {
        return axios.post(url,{test_name,teacher_id,test_exercise,course_id})
        .then(function (response) {
            dispatch(clearBasketData());
            dispatch({
                type : 'ADD_NEW_TEST',
                testname : test_name,
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
export const distributeTest = (keys,test_id,test_type,index) => {
    let url = target + "/distributeTest";
    return dispatch => {
        return axios.post(url,{keys,test_id,test_type})
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

//复制试题，生成新的未发布试题
export const copyTest = (teacher_id, test_id,copy_name) => {
    let url = target + "/copyTest";
    return dispatch => {
        return axios.post(url,{teacher_id, test_id,copy_name})
        .then(function (response) {
            dispatch(getTestTable(teacher_id));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//获取公开测试 testid 所对应的小程序码
export const getXcxCode = (test_id) => {
    let url = target + "/getXcxCode";
    return dispatch => {
        dispatch(getXcxCodeStart());
        return axios.get(url,{
            params:{
                test_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_XCX_CODE',
                data : response.data, 
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
                json : response.data, 
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

/*---------------------------------------作业管理----------------------------------*/
//根据teacherid 获取老师创建的所有作业
const getTasksStart = () => {
    return {
      type: 'GET_TASKS_START',
    }
}

export const getTaskTable = (teacher_id) => {
    let url = target + "/getTaskTable";
    return dispatch => {
        dispatch(getTasksStart());
        return axios.get(url,{
            params:{
                teacher_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_TASKS_SUCESS',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const setTaskTab = (key) => {
    return {
        type: 'SET_TASK_TAB',
        data: key,
    }
}

export const getTaskLogTable = (teacher_id) => {
    let url = target + "/getTaskLogTable";
    return dispatch => {
        return axios.get(url,{
            params:{
                teacher_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_TASK_LOGS_SUCESS',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const delOneTask = (taskid,index) => {
    let url = target + "/deleteOneTask";
    return dispatch => {
        return axios.post(url,{taskid})
        .then(function (response) {
            dispatch({
                type : 'DEL_ONE_TASK',
                index : index
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getTaskInfoById = (task_id) => {
    let url = target + "/getTaskInfoById";
    return dispatch => {
        return axios.get(url,{
            params:{
                task_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_TASK_INFO_SUCESS',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getTaskResultInfo = (task_id) => {
    let url = target + "/getTaskResultInfo";
    return dispatch => {
        return axios.get(url,{
            params:{
                task_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_TASK_RES_INFO',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const setVerifyRes = (verifyState,comment,taskid,teacher_id,student_id,assign_type) => {
    let url = target + "/setVerifyRes";
    // console.log("verifyState:",verifyState);
    // console.log("comment:",comment);
    // console.log("taskid:",taskid);
    // console.log("teacher_id:",teacher_id);
    // console.log("student_id:",student_id);
    // console.log("assign_type:",assign_type);
    return dispatch => {
        return axios.post(url,{verifyState,comment,taskid,teacher_id,student_id,assign_type})
        .then(function (response) {
            dispatch(getTaskLogTable(teacher_id));
            dispatch(getTaskResultInfo(taskid));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const distributeNewHW = (students, task) => {
    let url = target + "/distributeNewHomeWork";
    return dispatch => {
        return axios.post(url, {students, task})
        .then(function (response) {
            dispatch(getTaskTable(task.create_user));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const distributeTaskLog = (students, tasklog) => {
    let url = target + "/distributeTaskLog";
    return dispatch => {
        return axios.post(url, {students, tasklog})
        .then(function (response) {
            message.success('任务分发成功!');
            dispatch(getTaskLogTable(tasklog.verify_user));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const addTask = (task) => {
    let url = target + "/addTask";
    return dispatch => {
        return axios.post(url, {task})
        .then(function (response) {
            dispatch(getTaskTable(task.create_user));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}


/*---------------------------------------班级管理----------------------------------*/
//获取老师所在的学校和机构
export const getSchool = (teacher_id) => {
    let url = target + "/getSchool";
    return dispatch => {
        return axios.get(url,{
            params:{
                teacher_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_SCHOOL_SUCESS',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//根据教师id获取 下带的班级分组数据
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

//获取学生邀请码
export const getCodeByGroupid = (stu_group_id) => {
    let url = target + '/getCodeByGroupid'
    return (dispatch) => {
      return axios.get(url, { params: { stu_group_id } })
      .then((response) => {
        dispatch({
          type: 'GET_GROUP_CODE',
          code: response.data
        })
      })
    }
}

//根据教师id获取 下带的班级分组及分组内学生的数据
export const getTeacherGroup = (teacher_id) => {
    let url = target + "/getTeacherGroup";
    return dispatch => {
        dispatch(getClassgroupStart());
        return axios.get(url,{
            params:{
                teacher_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_STUGROUP_SUCESS',
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
/*---------------------------------------作业批改----------------------------------*/
export const getUncheckedExers = (test_id) => {
    let url = target + "/getUncheckedExers";
    return dispatch => {
        return axios.get(url,{
            params:{
                test_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_UNCHECKED_EXERS_SUCESS',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getCheckedExers = (test_id) => {
    let url = target + "/getCheckedExers";
    return dispatch => {
        return axios.get(url,{
            params:{
                test_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_CHECKED_EXERS_SUCESS',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const submitCheckAnswer = (testid, exercise_log, breakdown_sn) => {
    console.log("action submitCheckAnswer");
    let url = target + "/submitCheckAnswer";
    return dispatch => {
        return axios.post(url, { exercise_log, breakdown_sn})
        .then(function (response) {
            message.success('批改提交成功!');
            dispatch(getUncheckedExers(testid));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

/*---------------------------------------学生管理----------------------------------*/
//获取老师所带的学生的信息
export const getStudentList = (teacher_id) => {
    let url = target + "/getStudentList";
    return dispatch => {
        return axios.get(url, { 
            params:{
                teacher_id,
        }})
        .then(function (response) {
            dispatch({
                type : 'GET_STUDENT_LIST',
                student_list: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//获取学生邀请码
export const getCodeByStudentid = (student_id) => {
    let url = target + '/getCodeByUserid'
    return (dispatch) => {
      return axios.get(url, { params: { student_id } })
      .then((response) => {
        dispatch({
          type: 'GET_STUDENT_CODE',
          code: response.data
        })
      })
    }
  }

//获取老师所带的学生的信息
export const getStuCourse = (student_id) => {
    let url = target + "/getStuCourse";
    return dispatch => {
        return axios.get(url, { 
            params:{
                student_id,
        }})
        .then(function (response) {
            dispatch({
                type : 'GET_STU_COURSE',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//获取老学生表现信息
export const getStuPfCommentList = (student_id) => {
    let url = target + "/getStuPfCommentList";
    return dispatch => {
        return axios.get(url, { 
            params:{
                student_id,
        }})
        .then(function (response) {
            dispatch({
                type : 'GET_STU_PFCOMMENT_LIST',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

//获取老学生表现信息
export const getStuKpCommentList = (student_id,filter_option) => {
    let url = target + "/getStuKpCommentList";
    console.log("filter_option:",JSON.stringify(filter_option));
    return dispatch => {
        return axios.post(url, { student_id, filter_option})
        .then(function (response) {
            dispatch({
                type : 'GET_STU_KPCOMMENT_LIST',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}


// export const getstuEvaluationData= (student_id,test_id) => {
//     let path = '/getMyTestStepAnalysis'
//     let url = target + path;
//     return dispatch => {
//         return axios.get(url,{
//             params:{
//                 test_id,
//                 student_id,
//             }
//         })
//         .then(function (response) {
//             dispatch({
//                 type : 'GET_STU_EVAL_SUCESS',
//                 json: response.data,
//             });
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
//     }
// }
/*---------------------------------------课时管理----------------------------------*/
//获取老师所带的学生课时信息
export const getClassHourTable = (teacher_id) => {
    let url = target + "/getClassHourTable";
    return dispatch => {
        return axios.get(url, { 
            params:{
                teacher_id,
        }})
        .then(function (response) {
            dispatch({
                type : 'GET_CLASS_HOUR',
                class_hour: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}
/*---------------------------------------路径管理----------------------------------*/

export const getGroupPath = (path_id, group_id) => {
    let url = target + "/getGroupPath";
    return dispatch => {
        dispatch(getPathsStart());
        return axios.get(url, {
            params:{
                path_id,
                group_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_GROUP_PATH_DATA',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

const getPathsStart = () => {
    return {
      type: 'GET_PATHS_START',
    }
}

export const getPathTable = (teacher_id) => {
    let url = target + "/getPathTable";
    return dispatch => {
        dispatch(getPathsStart());
        return axios.get(url,{
            params:{
                teacher_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_PATHS_TABLE_SUCESS',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getStudentPathChapter = (student_id,group_id,path_id) => {
    let url = target + "/getStudentPathChapter";
    return dispatch => {
        return axios.get(url,{
            params:{
                student_id,
                group_id,
                path_id,
            }
        })
        .then(function (response) {
            dispatch(getStudentChapterNode(student_id,group_id,response.data.current_chapter_id));
            dispatch({
                type : 'GET_STU_PATH_CHAPTER_SUCESS',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getStudentChapterNode = (student_id,group_id,path_chapter_id) => {
    let url = target + "/getStudentChapterNode";
    return dispatch => {
        dispatch(getPathsStart());
        return axios.get(url,{
            params:{
                student_id,
                group_id,
                path_chapter_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_STU_CHAPTER_NODE_SUCESS',
                json : response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}




/*---------------------------------------课程管理----------------------------------*/
export const getTeacherLesson = (teacher_id, filter_option) => {
    let url = target + "/getTeacherLesson";
    console.log("filter_option:",JSON.stringify(filter_option));
    return dispatch => {
        return axios.post(url, {teacher_id, filter_option})
        .then(function (response) {
            dispatch({
                type : 'GET_TEACHER_LESSON',
                teacher_lesson: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getTeacherLessonNotComment = (teacher_id) => {
    let url = target + "/getTeacherLessonNotComment";
    return dispatch => {
        return axios.get(url, {
            params: { teacher_id }
        })
        .then(function (response) {
            dispatch({
                type : 'SET_LESSON_NOT_COMMENT',
                lesson_not_comment: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getStudentOneLesson = (lesson_id, student_id) => {
    let url = target + "/getStudentOneLesson";
    return dispatch => {
        return axios.get(url, {
            params:{
                lesson_id,
                student_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_STUDENT_ONE_LESSON',
                lesson: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getLessonStudent = (lesson_id) => {
    let url = target + "/getLessonStudent";
    return dispatch => {
        return axios.get(url, {
            params:{
                lesson_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_LESSON_STUDENT',
                lesson_student: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getOneLesson = (lesson_id, index) => {
    let url = target + "/getOneLesson";
    return dispatch => {
        return axios.get(url, {
            params:{
                lesson_id,
            }
        })
        .then(function (response) {
            const lesson = response.data;
            if(lesson.lesson_student && lesson.lesson_student.length == 1){
                dispatch({
                    type: 'SELECT_LESSON_STUDENT',
                    select_student: {
                        select_id: [lesson.lesson_student[0].student_id], 
                        select_name: [lesson.lesson_student[0].realname]
                    },
                })
            }
            dispatch({
                type : 'GET_ONE_LESSON',
                lesson: lesson,
                index: index,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const selectLessonStudent = (select_student) => {    
    return {
        type: 'SELECT_LESSON_STUDENT',
        select_student: select_student,
    }
}

export const deleteOneLesson = (lesson_id,teacher_id) => {
    let url = target + "/deleteOneLesson";
    console.log(lesson_id);
    return dispatch => {
        return axios.post(url, {lesson_id})
        .then(function (response) {
            dispatch(getTeacherLesson(teacher_id,{}));
            dispatch(getTeacherLessonNotComment(teacher_id));
            // dispatch({
            //     type : 'DELETE_ONE_LESSON',
            //     lesson: response.data,
            // });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const setLessonIndexVisible = (index) => {
    return {
      type: 'SET_LESSON_INDEX',
      index: index,
    }
}

export const addNewLesson = (lesson, teacher_id) => {
    let url = target + "/addNewLesson";
    return dispatch => {
        return axios.post(url, {lesson})
        .then(function (response) {
            dispatch(getTeacherLesson(teacher_id,{}));
            // dispatch({
            //     type : 'ADD_NEW_LESSON',
            //     lesson_id : response.data,
            // });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const addHomework = (lesson_id, task, users) => {
    let url = target + "/addHomework";
    return dispatch => {
        return axios.post(url, {lesson_id, task, users})
        .then(function (response) {
            dispatch({
                type : 'EDIT_HOMEWORK',
                homework: response.data, 
            });
            dispatch(editLesson('new_homework_edit', false));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const relateHomework = (lesson_id, task_id, users) => {
    let url = target + "/relateHomework";
    return dispatch => {
        return axios.post(url, {lesson_id, task_id, users})
        .then(function (response) {
            dispatch({
                type : 'EDIT_HOMEWORK',
                homework: response.data, 
            });
            dispatch(editLesson('new_homework_edit', false));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const deleteHomework = (lesson_id, task_id, users) => {
    let url = target + "/deleteHomework";
    return dispatch => {
        return axios.post(url, {lesson_id, task_id, users})
        .then(function (response) {
            dispatch({
                type : 'EDIT_HOMEWORK',
                homework: response.data, 
            });
            // dispatch(editLesson('new_homework_edit', false));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const addLessonContent = (lesson_content) => {
    let url = target + "/addLessonContent";
    return dispatch => {
        return axios.post(url, {lesson_content})
        .then(function (response) {
            dispatch({
                type : 'EDIT_LESSON_CONTENT',
                lesson_content: response.data, 
            });
            dispatch(editLesson('new_content_edit', false));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const deleteLessonContent = (lesson_content, i) => {
    let url = target + "/deleteLessonContent";
    return dispatch => {
        return axios.post(url, {lesson_content})
        .then(function (response) {
            dispatch({
                type : 'EDIT_LESSON_CONTENT',
                lesson_content: response.data, 
            });
            dispatch(editLesson(i, false));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getLessonPfComment = (lesson_id) => {
    let url = target + "/getLessonPfComment";
    return dispatch => {
        return axios.post(url, {lesson_id})
        .then(function (response) {
            dispatch({
                type : 'EDIT_LESSON_PFCOMMENT',
                pf_comment: response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);});
    }
}

export const getLessonKpComment = (lesson_id) => {
    let url = target + "/getLessonKpComment";
    return dispatch => {
        return axios.post(url, {lesson_id})
        .then(function (response) {
            dispatch({
                type : 'EDIT_LESSON_KPCOMMENT',
                kp_comment: response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);});
    }
}

export const updatePfComment = (pf_comment, comment_id, callback) => {
    let url = target + "/updatePfComment";
    return dispatch => {
        return axios.post(url, {pf_comment, comment_id})
        .then(function (response) {
            callback();
        })
        .catch(function (error) {
            console.log(error);});
    }
}

export const updateKpComment = (kp_comment, comment_id, callback) => {
    let url = target + "/updateKpComment";
    return dispatch => {
        return axios.post(url, {kp_comment, comment_id})
        .then(function (response) {
            callback();
        })
        .catch(function (error) {
            console.log(error);});
    }
}

export const addLessonKpComment = (lesson_id, select_student, kp_comment, callback) => {
    let url = target + "/addLessonKpComment";
    return dispatch => {
        return axios.post(url, {lesson_id, select_student, kp_comment})
        .then(function (response) {
            callback();
            dispatch(getLessonKpComment(lesson_id));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const addLessonPfComment = (lesson_id, select_student, pf_comment, callback) => {
    let url = target + "/addLessonPfComment";
    return dispatch => {
        return axios.post(url, {lesson_id, select_student, pf_comment})
        .then(function (response) {
            callback();
            dispatch(getLessonPfComment(lesson_id));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const deleteLessonPfComment = (comment_id, lesson_id) => {
    let url = target + "/deleteLessonPfComment";
    return dispatch => {
        return axios.post(url, {comment_id, lesson_id})
        .then(function (response) {
            dispatch(getLessonPfComment(lesson_id));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const deleteLessonKpComment = (comment_id, lesson_id) => {
    let url = target + "/deleteLessonKpComment";
    return dispatch => {
        return axios.post(url, {comment_id, lesson_id})
        .then(function (response) {
            dispatch(getLessonKpComment(lesson_id));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

// export const updateLessonGroup = (lesson_id, group_id) => {
//     let url = target + "/updateLessonGroup";
//     return dispatch => {
//         return axios.post(url, {lesson_id, group_id})
//         .then(function (response) {
//             dispatch({
//                 type: 'UPDATE_LESSON_GROUP',
//                 lesson_basic: response.data,
//             });
//             dispatch(editLesson('group_edit', false));
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
//     }
// }
export const updateLessonLabel = (lesson_id, label_id) => {
    let url = target + "/updateLessonLabel";
    return dispatch => {
        return axios.post(url, {lesson_id, label_id})
        .then(function (response) {
            dispatch({
                type: 'UPDATE_LESSON_LABEL',
                lesson_basic: response.data,
            });
            dispatch(editLesson('label_edit', false));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const updateLessonTeacher = (lesson_id, teacher_id) => {
    let url = target + "/updateLessonTeacher";
    return dispatch => {
        return axios.post(url, {lesson_id, teacher_id})
        .then(function (response) {
            dispatch({
                type: 'UPDATE_LESSON_TEACHER',
                lesson_basic: response.data,
            });
            dispatch(editLesson('teacher_edit', false));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const updateLessonAssistant = (lesson_id, assistant_id) => {
    let url = target + "/updateLessonAssistant";
    return dispatch => {
        return axios.post(url, {lesson_id, assistant_id})
        .then(function (response) {
            dispatch({
                type: 'UPDATE_LESSON_ASSISTANT',
                lesson_basic: response.data,
            });
            dispatch(editLesson('assistant_edit', false));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const signLesson = (lesson_id, teacher_id) => {
    let url = target + "/signLesson";
    return dispatch => {
        dispatch({
            type: 'CHANGE_IS_SIGNING',
            res: true,
        });
        return axios.post(url, {lesson_id})
        .then(function (response) {
            dispatch({
                type: 'SIGN_LESSON',
            });
            // dispatch(getTeacherLesson(teacher_id,{}));
            dispatch({
                type: 'CHANGE_IS_SIGNING',
                res: false,
            });
        })
        .catch(function (error) {
            dispatch({
                type: 'CHANGE_IS_SIGNING',
                res: false,
            });
            console.log(error);
        });
    }
}

export const undoSignLesson = (lesson_id, index) => {
    let url = target + "/undoSignLesson";
    return dispatch => {
        dispatch({
            type: 'CHANGE_IS_SIGNING',
            res: true,
        });
        return axios.post(url, {lesson_id})
        .then(function (response) {
            dispatch({
                type: 'UNDO_SIGN_LESSON',
                index: index,
            });
            // dispatch(getTeacherLesson(teacher_id,{}));
            dispatch({
                type: 'CHANGE_IS_SIGNING',
                res: false,
            });
        })
        .catch(function (error) {
            dispatch({
                type: 'CHANGE_IS_SIGNING',
                res: false,
            });
            console.log(error);
        });
    }
}

export const accLessonAward = (lesson_id) => {
    let url = target + "/accLessonAward";
    return dispatch => {
        return axios.get(url, {
            params:{
               lesson_id
            }
        })
        .then(function (response) {
            dispatch({
                type: 'ACC_LESSON_AWARD',
                acc_award: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const addLessonAward = (leeson_id) => {
    let url = target + "/addLessonAward";
    return dispatch => {
        return axios.post(url, {leeson_id})
        .then(function (response) {
            dispatch({
                type: 'ADD_LESSON_AWARD',
                lesson_award: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

// export const updateLessonCourse = (lesson_id, course_id) => {
//     let url = target + "/updateLessonCourse";
//     return dispatch => {
//         return axios.post(url, {lesson_id, course_id})
//         .then(function (response) {
//             dispatch({
//                 type : 'UPDATE_LESSON_TEACHER',
//                 lesson_basic: response.data,
//             });
//             dispatch(editLesson('label_edit', false));
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
//     }
// }

// export const updateLessonLabel = (lesson_id, label_id) => {
//     let url = target + "/updateLessonLabel";
//     return dispatch => {
//         return axios.post(url, {lesson_id, label_id})
//         .then(function (response) {
//             dispatch({
//                 type : 'UPDATE_LESSON_LABEL',
//                 lesson_basic: response.data,
//             });
//             dispatch(editLesson('label_edit', false));
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
//     }
// }

export const getStuTestSurvey = (student_id, test_id) => {
    let url = target + "/getStuTestSurvey";
    return (dispatch) => {
        return axios.get(url,{
                params:{
                   student_id,
                   test_id,
                }
        })
        .then(function (response) {

            console.log("getStuTestSurvey:",JSON.stringify(response.data));
            
            let test_data = response.data.test_log;
            let start_time=moment(test_data.start_time);
            let finish_time=moment(test_data.finish_time);
            let pre_elapsed_time = moment(finish_time-start_time).subtract(8,'hours')
            let elapsed_time = pre_elapsed_time >= 60*60 ? moment(pre_elapsed_time).format('HH时m分ss秒'):moment(pre_elapsed_time).format('m分ss秒');
            let end_time = moment(test_data.finish_time).format("YYYY-M-D H:mm:ss");
            // console.log(elapsed_time);
            
            let per_data = "{" + 
                    '"test_name":' + '"' + test_data.test_name + '"' + "," + 
                    '"elapsed_time":' + '"' + elapsed_time + '"' + "," +
                    '"correct_rate":' + test_data.test_state + "," +
                    '"finish_time":' + '"' + end_time + '"' +
                    "}"
            
            let data=JSON.parse(per_data);
            dispatch({
                type: 'GET_STU_TEST_SURVEY',
                json: response.data,
            })
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getMyTestData = (student_id, test_id) => {
    let url = target + "/getMyTestData";
    return (dispatch) => {
        return axios.get(url,{
                params:{
                   test_id,
                   student_id,
                }
        })
        .then(function (response) {

            // console.log(response);
            
            let test_data = response.data.test_log;
            let start_time=moment(test_data.start_time);
            let finish_time=moment(test_data.finish_time);
            let pre_elapsed_time = moment(finish_time-start_time).subtract(8,'hours')
            let elapsed_time = pre_elapsed_time >= 60*60 ? moment(pre_elapsed_time).format('HH时m分ss秒'):moment(pre_elapsed_time).format('m分ss秒');
            let end_time = moment(test_data.finish_time).format("YYYY-M-D H:mm:ss");
            // console.log(elapsed_time);
            
            let per_data = "{" + 
                    '"test_name":' + '"' + test_data.test_name + '"' + "," + 
                    '"elapsed_time":' + '"' + elapsed_time + '"' + "," +
                    '"correct_rate":' + test_data.test_state + "," +
                    '"finish_time":' + '"' + end_time + '"' +
                    "}"
            
            let data=JSON.parse(per_data);
            dispatch({
                type: 'GET_MY_TEST_DATA',
                json: data
            })
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const updateLessonRange = (lesson_id, start_time, end_time) => {
    let url = target + "/updateLessonRange";
    console.log("start_time end_time:",start_time,end_time);
    return dispatch => {
        return axios.post(url, {lesson_id, start_time, end_time})
        .then(function (response) {
            dispatch({
                type : 'UPDATE_LESSON_RANGE',
                start_time, 
                end_time,
            });
            dispatch(editLesson('range_edit', false));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const searchPfLabel = (input) => {
    let url = target + "/searchPfLabel";
    return dispatch => {
        return axios.get(url, {params: {input}})
        .then(function (response) {
            dispatch({
                type : 'SEARCH_PF_LABEL',
                result: response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getPfLabelOptions = () => {
    let url = target + "/getPfLabelOptions";
    return dispatch => {
        return axios.get(url, {params: {}})
        .then(function (response) {
            dispatch({
                type : 'GET_PF_LABEL_OPTIONS',
                result: response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const searchKpLabel = (input) => {
    let url = target + "/searchKpLabel";
    return dispatch => {
        return axios.get(url, {params: {input}})
        .then(function (response) {
            dispatch({
                type : 'SEARCH_KP_LABEL',
                result: response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const searchTaskSource = (input) => {
    let url = target + "/searchTaskSource";
    return dispatch => {
        return axios.get(url, {params: {input}})
        .then(function (response) {
            dispatch({
                type : 'SEARCH_TASK_SOURCE',
                result: response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const searchTeacherTask = (teacher_id, input) => {
    let url = target + "/searchTeacherTask";
    return dispatch => {
        return axios.get(url, {params: {teacher_id, input}})
        .then(function (response) {
            dispatch({
                type : 'SEARCH_TEACHER_TASK',
                result: response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getOptionData = (teacher_id) => {
    let url = target + "/getOptionData";
    return dispatch => {
        return axios.get(url, {params: {teacher_id}})
        .then(function (response) {
            dispatch({
                type : 'GET_TEACHER_OPTION',
                teacher_option: response.data.teacher_option, 
                course_option: response.data.course_option,
                label_option: response.data.label_option,
                // test_option: response.data.test_option,
                room_option: response.data.room_option,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getLinkageOptionData = (group_id) => {
    let url = target + "/getLinkageOptionData";
    return dispatch => {
        return axios.get(url, {params: {group_id}})
        .then(function (response) {
            dispatch({
                type : 'GET_TEACHER_LINK_OPTION',
                teacher_link_option: response.data.teacher_link_option, 
                // course_option: response.data.course_option,
                // label_option: response.data.room_link_option,
                // test_option: response.data.test_option,
                room_link_option: response.data.room_link_option,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const getstuEvaluationDataStart = () => {
    return {
      type: 'GET_STU_EVAL_START',
    }
  }
export const getStuEvaluationData= (student_id,test_id) => {
    let path = '/getStuTestStepAnalysis'
    let url = target + path;
    return dispatch => {
        return axios.get(url,{
            params:{
                test_id,
                student_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_STU_EVAL_SUCESS',
                json: response.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export function editLesson(key, value) {
  return {
    type: 'LESSON_EDITABLE',
    key,
    value,
  }
}

export function editPfComment(index, value) {
  return {
    type: 'PF_COMMENT_EDITABLE',
    index,
    value,
  }
}

export function editKpComment(index, value) {
  return {
    type: 'KP_COMMENT_EDITABLE',
    index,
    value,
  }
}
  
