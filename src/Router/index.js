import React from 'react';

import App from '../Component/index.js'
import TestCenter from '../Component/TestCenter.js'
import StuManager from '../Component/StuManager.js'
import LessonManager from '../Component/LessonManager.js'
import StuCapacity from '../Component/stu_capacity.js'
import KpExerciseView from '../Component/exercise_select.js'
import TestResult from '../Component/TestResult.js'


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

export default (
    <Route path='teacher-zq'>
      <Route path="root" component={requireAuthentication(App)}>
      {/* <Route path="root" component={App}> */}
        <IndexRoute component={TestCenter} />
        <Route path="testcenter" component={TestCenter}/>
        <Route path="stu_manager" component={StuManager}/>
        <Route path="lesson-manager" component={LessonManager}/>
      </Route>

      <Route path="stu_capacity/:id" component={StuCapacity}/>
      <Route path="exerview" component={KpExerciseView}/>
      <Route path="testresult/:id" component={TestResult}/>
    </Route>
);
