import React from 'react';

import App from '../Component/index.js'
import TestCenter from '../Component/TestCenter.js'
import StuManager from '../Component/ClassManager.js'
import ClasshourManager from '../Component/ClasshourManager.js'
import LessonManager from '../Component/LessonManager.js'
import TaskManager from '../Component/TaskManager.js'
import PathManager from '../Component/PathManager.js'
import StuCapacity from '../Component/stu_capacity.js'
import KpExerciseView from '../Component/exercise_select.js'
import TestResult from '../Component/TestResult.js'
import TestCorrect from '../Component/TestCorrect.js'
import StuEvaluation from '../Component/stuEvaluation.js'
import StuPath from '../Component/stuPath.js'
import GroupPath from '../Component/groupPath.js'
import TaskResult from '../Component/TaskResult.js'
import LessonPrint from '../Component/LessonPrint.js'
import StudentCenter from '../Component/StudentManager.js'
import StudentInfo from '../Component/StudentInfo.js'

import { Route, IndexRoute } from 'react-router';
import { requireAuthentication } from '../utils';


const isReactComponent = (obj) => Boolean(obj && obj.prototype && Boolean(obj.prototype.isReactComponent));

const component = (component) => {
  return isReactComponent(component)
    ? {component}
    : {getComponent: (loc, cb)=> component(
         comp=> cb(null, comp.default || comp))}
};
//独立编译
//        <Route path="Question" {...component(Question)} />
      /*<Route path="root" component={requireAuthentication(App)}>*/
      // <Route path="root" component={requireAuthentication(App)}>
export default (
    <Route path='teacher-zq'>

      <Route path="root" component={requireAuthentication(App)}> 
      {/* <Route path="root" component={App}>  */}
        <IndexRoute component={TestCenter} />
        <Route path="stu_manager" component={StudentCenter}/>
        <Route path="testcenter" component={TestCenter}/>
        <Route path="classhour_manager" component={ClasshourManager}/>
        <Route path="class_manager" component={StuManager}/>
        <Route path="lesson-manager" component={LessonManager}/>
        <Route path="task-manager" component={TaskManager}/>
        <Route path="path-manager" component={PathManager}/>
      </Route>
      <Route path="stu_evaluation" component={StuEvaluation}/>
      <Route path="stu_path" component={StuPath}/>
      <Route path="test_correct/:id" component={TestCorrect}/>
      <Route path="lesson_print/:lesson_id" component={LessonPrint}/>
      <Route path="student_info/:id" component={StudentInfo}/>     
      <Route path="stu_capacity/:id" component={StuCapacity}/>
      <Route path="exerview" component={KpExerciseView}/>
      <Route path="testresult/:id" component={TestResult}/>
      <Route path="group_path" component={GroupPath}/>
      <Route path="task_result/:id" component={TaskResult}/>
      
    </Route>
    
);
