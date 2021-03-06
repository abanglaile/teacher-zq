import { checkHttpStatus, parseJSON } from '../utils';
import { push } from 'react-router-redux'
import config from '../utils/Config';
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
            console.log("response.data:",response.data);
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
export const saveNewTest = (test_name,teacher_id,test_exercise) => {
    let url = target + "/addNewTest";
    return dispatch => {
        return axios.post(url,{test_name,teacher_id,test_exercise})
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

export const getstuEvaluationData= (student_id,test_id) => {
    let path = '/getMyTestStepAnalysis'
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
/*---------------------------------------课程管理----------------------------------*/
export const getTeacherLesson = (filter_option) => {
    let url = target + "/getTeacherLesson";
    return dispatch => {
        return axios.post(url, {filter_option})
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

export const getOneLesson = (lesson_id, index) => {
    let url = target + "/getOneLesson";
    console.log(lesson_id);
    return dispatch => {
        return axios.get(url, {
            params:{
                lesson_id,
            }
        })
        .then(function (response) {
            dispatch({
                type : 'GET_ONE_LESSON',
                lesson: response.data,
                index: index,
            });
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

export const addNewLesson = (lesson) => {
    let url = target + "/addNewLesson";
    return dispatch => {
        return axios.post(url, {lesson})
        .then(function (response) {
            dispatch({
                type : 'ADD_NEW_LESSON',
                lesson_id : response.data,
            });
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

export const deleteHomework = (lesson_id, task_id, users) => {
    let url = target + "/deleteHomework";
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

export const updateLessonContent = (lesson_content, i) => {
    let url = target + "/updateLessonContent";
    return dispatch => {
        return axios.post(url, {lesson_content})
        .then(function (response) {
            dispatch({
                type : 'EDIT_LESSON_CONTENT',
                lesson_content: response.data, 
            });
            dispatch(editLessonContent(i, false));
        })
        .catch(function (error) {
            console.log(error);});
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

export const addTeacherComment = (label_id, label_type, select_student,teacher_comment) => {
    let url = target + "/addTeacherComment";
    return dispatch => {
        return axios.post(url, {label_id, label_type, select_student, teacher_comment})
        .then(function (response) {
            console.log(response.data);
            dispatch({
                type : 'ADD_TEACHER_COMMENT',
                teacher_comment: response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const deleteTeacherComment = (comment_id, lesson_id) => {
    let url = target + "/deleteTeacherComment";
    return dispatch => {
        return axios.post(url, {comment_id, lesson_id})
        .then(function (response) {
            dispatch({
                type : 'DELETE_TEACHER_COMMENT',
                teacher_comment: response.data, 
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const updateLessonGroup = (lesson_id, group_id) => {
    let url = target + "/updateLessonGroup";
    return dispatch => {
        return axios.post(url, {lesson_id, group_id})
        .then(function (response) {
            dispatch({
                type: 'UPDATE_LESSON_GROUP',
                lesson_basic: response.data,
            });
            dispatch(editLesson('group_edit', false));
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

export const updateLessonCourse = (lesson_id, course_id) => {
    let url = target + "/updateLessonCourse";
    return dispatch => {
        return axios.post(url, {lesson_id, course_id})
        .then(function (response) {
            dispatch({
                type : 'UPDATE_LESSON_TEACHER',
                lesson_basic: response.data,
            });
            dispatch(editLesson('label_edit', false));
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

export const updateLessonLabel = (lesson_id, label_id) => {
    let url = target + "/updateLessonLabel";
    return dispatch => {
        return axios.post(url, {lesson_id, label_id})
        .then(function (response) {
            dispatch({
                type : 'UPDATE_LESSON_LABEL',
                lesson_basic: response.data,
            });
            dispatch(editLesson('label_edit', false));
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

export const searchCommentLabel = (input) => {
    let url = target + "/searchCommentLabel";
    return dispatch => {
        return axios.get(url, {params: {input}})
        .then(function (response) {
            dispatch({
                type : 'SEARCH_LABEL',
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

export const getOptionData = (teacher_id, school_id) => {
    let url = target + "/getOptionData";
    console.log(teacher_id);
    return dispatch => {
        return axios.get(url, {params: {teacher_id, school_id}})
        .then(function (response) {
            dispatch({
                type : 'GET_TEACHER_OPTION',
                teacher_option: response.data.teacher_option, 
                course_option: response.data.course_option,
                label_option: response.data.label_option,
                test_option: response.data.test_option,
                room_option: response.data.room_option,
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

export function editLessonContent(index, value) {
  return {
    type: 'LESSON_CONTENT_EDITABLE',
    index,
    value,
  }
}

export function editLessonHomework(index, value) {
  return {
    type: 'LESSON_HOMEWORK_EDITABLE',
    index,
    value,
  }
}
