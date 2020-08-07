import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'
import landingImg from '../../assets/images/landing.svg'
import studyIcon from '../../assets/images/icons/study.svg'
import giveClasses from '../../assets/images/icons/give-classes.svg'
import purpleHeartIcon from '../../assets/images/icons/purple-heart.svg'

import './styles.css'
import api from '../../services/api'

function Landing(){
    const [ totalConnections, setTotalConnections] = useState(0)

    useEffect(() => {
        api.get('connections').then(res => setTotalConnections(res.data.total))
    }, [])

    return (
        <div id="page-landing">
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