import Immutable from 'immutable';


const defaultTestsData = Immutable.fromJS({//教师创建的所有测试
		test_data: [], //老师创建的所有测试
		testlog : [], //测试试题详细信息
		test_info : {}, //测试进本信息
		kp_data : [],//知识点测试情况
		test_res : {},//测试基本情况，各学生完成情况
        isFetching: false,
	});
	
const defaultStudentData = Immutable.fromJS({//学生信息
	student_info : {}, //学生基本信息
	capatity : [], //综合能力数据
	ladder : [], //天梯分历史数据
	used_data : [], //常用知识点数据
	recent_data : [], //最近常练知识点
	kp_data : [],// 知识点能力
	isFetching: false,
});

const defaultBookMenuData = Immutable.fromJS({//book菜单
        bookmenu_data: [],
        isFetching: false,
    });

const defaultClassGroupData = Immutable.fromJS({//教师管理的所有班级
        classgroup_data: [],
        groupstu_data: [],
        isFetching: false,
    });

const defaultSelMenuData = Immutable.fromJS({//某班级下面的所有学生信息
        selmenu_data: [],
        isFetching: false,
    });

const defaultbasketData = Immutable.fromJS({//试题篮里的信息
        basket_data: [],
    });


export const fetchTestsData = (state = defaultTestsData , action = {}) => {
    switch(action.type){
        case 'GET_TESTS_START':
            return state.set('isFetching', true);
        case 'GET_TESTS_SUCESS':
            return state.set('test_data', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'ADD_NEW_TEST':
            var newtest = {'key':action.testid,'testname':action.testname,'teststate':0,'time':''};
            return state.update('test_data', test => test.push(Immutable.fromJS(newtest)));
        case 'DEL_ONE_TEST':
            return state.update('test_data', test => test.splice(action.index,1));
        case 'CHANGE_TEST_STATE':
            return state.setIn(['test_data',action.index,'teststate'], 1)
					.setIn(['test_data',action.index,'time'], action.time);
		case 'GET_TEST_DETAIL_SUCESS':
			return state.set('testlog', Immutable.fromJS(action.json)).set('isFetching', false);
		case 'GET_TEST_INFO_SUCESS':
			return state.set('test_info', Immutable.fromJS(action.json));	
		case 'GET_TEST_KP_SUCESS':
			return state.set('kp_data', Immutable.fromJS(action.json));
		case 'GET_TEST_RES_TABLE':
			return state.set('test_res', Immutable.fromJS(action.json)); 
        default:
            return state;
    }
}

export const bookMenuData = (state = defaultBookMenuData, action = {}) => {
    switch(action.type){
        case 'GET_BOOKMENU_START':
            return state.set('isFetching', true);
        case 'GET_BOOKMENU_SUCESS':
            return state.set('bookmenu_data', Immutable.fromJS(action.json)).set('isFetching', false);
        default:
            return state;
    }
}

export const classGroupData = (state = defaultClassGroupData, action = {}) => {
    switch(action.type){
        case 'GET_CLASSGROUP_START':
            return state.set('isFetching', true);
        case 'GET_CLASSGROUP_SUCESS':
            return state.set('classgroup_data', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'ADD_NEW_GROUP':
            var newgroup = {'stu_group_id':action.groupid,'group_name':action.groupname};
            return state.update('classgroup_data', classgroup => classgroup.push(Immutable.fromJS(newgroup)));
        case 'DEL_ONE_GROUP':
            var index = 0;
            var group = state.get('classgroup_data').toJS();
            for(var i=0;i<group.length;i++){
                if(group[i].stu_group_id === action.groupid){
                    index = i;
                }
            }
            return state.update('classgroup_data', classgroup => classgroup.splice(index,1));
        case 'GET_GROUPDATA_START':
            return state.set('isFetching', true);
        case 'GET_GROUPDATA_SUCESS':
            return state.set('groupstu_data', Immutable.fromJS(action.json)).set('isFetching', false);
        case 'DEL_ONE_STUDENT':
            return state.update('groupstu_data', groupstu => groupstu.splice(action.index,1));
        case 'ADD_ONE_STUDENT':
            var newstu = {'stu_group_id':action.groupid,
                          'student_name':action.values.stuname,
                          'student_id':action.values.stuid,
                          'phone_num':action.values.phonenum};
            return state.update('groupstu_data', groupstu => groupstu.push(Immutable.fromJS(newstu)));
        default:
            return state;
    }
}

export const selMenuData = (state = defaultSelMenuData, action = {}) => {
    switch(action.type){
        case 'GET_SELECTMENU_START':
            return state.set('isFetching', true);
        case 'GET_SELECTMENU_SUCESS':
            return state.set('selmenu_data', Immutable.fromJS(action.json)).set('isFetching', false);
        default:
            return state;
    }
}

export const basketDataMonitor = (state = defaultbasketData, action = {}) => {
    switch(action.type){
        case 'ADD_BASKET_DATA':
            return state.update('basket_data', basket => basket.push(Immutable.fromJS(action.data)));
        case 'DEL_BASKET_DATA':
            var index = 0;
            var basket = state.get('basket_data').toJS();
            for(var i=0;i<basket.length;i++){
                if(basket[i].exercise_id === action.exerciseid){
                    index = i;
                }
            }
            return state.update('basket_data', data => data.splice(index,1));
        case 'CLEAR_BASKET_DATA':
            var newstate = {
                basket_data: [],
            };
            return Immutable.fromJS(newstate);
        default:
            return state;
    }
}

export const studentData = (state = defaultStudentData , action = {}) => {
    switch(action.type){
        case 'GET_STU_INFO_SUCESS':
			return state.set('student_info', Immutable.fromJS(action.json));
		case 'GET_STU_ABILITY_SUCESS':
			return state.set('capatity', Immutable.fromJS(action.json));
		case 'GET_STU_LADDER_SUCESS':
			return state.set('ladder', Immutable.fromJS(action.json));
		case 'GET_STU_COMUSEDKP_SUCESS':
			return state.set('used_data', Immutable.fromJS(action.json));
		case 'GET_STU_RECENTKP_SUCESS':
			return state.set('recent_data', Immutable.fromJS(action.json));
		case 'GET_KP_SCORE_SUCESS':
			return state.set('kp_data', Immutable.fromJS(action.json));
        default:
            return state;
    }
}