import React, { useState, useEffect } from 'react'
import {Link, useHistory} from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'
import landingImg from '../../assets/images/landing.svg'
import studyIcon from '../../assets/images/icons/study.svg'
import giveClasses from '../../assets/images/icons/give-classes.svg'
import purpleHeartIcon from '../../assets/images/icons/purple-heart.svg'
import logoutIcon from '../../assets/images/icons/logout 1.svg'
import emptyUserIcon from '../../assets/images/icons/user.svg'

import './styles.css'
import api from '../../services/api'

interface UserProps{
    name: string,
    surname: string,
    bio: string,
    password: string,
    path: string,
    whatsapp: string
}

function Landing(){
    const history = useHistory()

    const [ totalConnections, setTotalConnections] = useState(0)
    const [user, setUser] = useState<UserProps>()

    useEffect(() => {
        api.get('connections', {headers: {'auth-token': localStorage.getItem('auth-token')}})
            .then(res => setTotalConnections(res.data.total))

        api.get('/user', {headers: {'auth-token': localStorage.getItem('auth-token'), 'email': localStorage.getItem('email')}})
            .then(response => {

                response.data.forEach((item: any) => {
                    if(item.path === 'http://localhost:3333/uploads/') item.path = ''
                })

                setUser(response.data[0])
            })
    }, [])

    function handleUserLogout(){
        localStorage.removeItem('auth-token')
        localStorage.removeItem('username')
        
        if(localStorage.getItem('checked') === 'false'){
            localStorage.removeItem('email')
            localStorage.removeItem('password')
        }
        history.push('/')
    }

    return (
        <div id="page-landing">

            <div className="user-info-logout">
                <span>
                    <Link to="/user-profile">
                        <img src={!user?.path ? emptyUserIcon : user?.path} alt=""/>
                    </Link>
                    {localStorage.getItem('username')}
                </span>

                <div onClick={handleUserLogout} className="logout-icon">
                    <img src={logoutIcon} alt="logout icon"/>
                </div>
            </div>

            <div className="container" id="page-landing-content">
                <div className="logo-container">
                    <img src={logoImg} alt="logo proffy"/>
                    <h2>Sua plataforma de estudos online</h2>
                </div>

                <img src={landingImg} alt="landing img" className="hero-image"/>

                <div className="buttons-container">
                    <Link to="/study" className="study">
                        <img src={studyIcon} alt="study icon"/>
                        Estudar
                    </Link>

                    <Link to="/give-classes" className="give-classes">
                        <img src={giveClasses} alt="give classes icon"/>
                        Dar aulas
                    </Link>
                </div>

                <span className="total-connections">
                    Total de {totalConnections} conexões já realizadas
                    <img src={purpleHeartIcon} alt="coracao conexoes"/>
                </span>
            </div>
        </div>
    )
}

export default Landing