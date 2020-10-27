import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import MainPage from './pages/MainPage'
import CreateAccont from './pages/CreateAccount'
import Landing from './pages/LandingPage'
import TeacherList from './pages/TeacherList'
import TeacherForm from './pages/TeacherForm'
import Protected from './pages/Protected'
import LoggedUser from './pages/Protected/LoggedUser'
import RecoverPassword from './pages/RecoverPassword'
import UserProfile from './pages/UserProfile'


function Routes(){
    return (
        <BrowserRouter >
            <Switch>
                <LoggedUser path="/" exact component={MainPage} />
                <Route path="/create-account" component={CreateAccont} />
                <Route path="/recover-password" component={RecoverPassword}/>
                <Route path="/recovery/" component={RecoverPassword}/>
                <Protected path="/landing" component={Landing}/>
                <Protected path="/study" component={TeacherList} />
                <Protected path="/give-classes" component={TeacherForm} />
                <Protected path="/user-profile" component={UserProfile} />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes