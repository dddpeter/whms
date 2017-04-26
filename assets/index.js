/**
 * Created by dddpeter on 17-2-23.
 */
import React from 'react';
import {render} from 'react-dom';
import { Router,browserHistory } from 'react-router';
import App from './components/App.js';
import DashBoard from './components/dashboard/DashBoard.js';
import Project from './components/project/Project.js';
import NotFound from './components/NotFound.js'
import Login from './components/login/Login'
import EditDialog from './components/dashboard/EditDialog'

const routerConfig = [
    {
        path: '/',
        component: App,
        indexRoute: { component: DashBoard },
        childRoutes: [
            { path: 'dashboard', component: DashBoard},
            { path: 'project', component: Project}
        ]
    },
    {
        path: '/login*',
        component: Login,
    },
    {
        path: '*',
        component: NotFound,
    }
];

render((
    <Router history={browserHistory} routes={routerConfig} />
), document.getElementById('root'));