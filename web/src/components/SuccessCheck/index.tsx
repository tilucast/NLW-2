import React from 'react'
import { Link } from 'react-router-dom'

import SuccessIcon from '../../assets/images/icons/success-check-icon.svg'

import './styles.css'

interface SuccessCheckProps{
    mainText: string,
    subText: string,
    buttonText: string
}

export default function SuccessCheck(props: SuccessCheckProps){
    return  (
        <main id="success-page">  
            <section>
                <img src={SuccessIcon} alt=""/>
                <h1>{props.mainText}</h1>
                <p>{props.subText}</p>
                
                <Link to="/">
                    <button>{props.buttonText}</button>
                </Link>
            </section>
        </main>
    )
}