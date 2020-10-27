import React, { FormEvent, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import Input from '../../components/input'
import SuccessCheck from '../../components/SuccessCheck'
import logoImg from '../../assets/images/logo.svg'
import backIcon from '../../assets/images/icons/back.svg'
import eyeLogo from '../../assets/images/icons/visibility.svg'
import eyeCutLogo from '../../assets/images/icons/hide.svg'

import api from '../../services/api'

//import './styles.css' this page is using the same css as the create account page.

export default function RecoverPassword(){
    const location = useLocation()
    const existsLocation = location.search
    const userEmail = existsLocation.slice(1, existsLocation.length)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [clicked, setClicked] = useState(false)
    const [visible, setVisible] = useState(false)

    function turnVisibility(){
        visible === false ? setVisible(true) : setVisible(false)
    }

    function handleFinishPasswordRecovery(){
        if(clicked) return true
    }

    async function handleSendPasswordRecovery(event: FormEvent){
        event.preventDefault()

        const userExists = await api.get('/user-exists', {headers: {'email': email}})
            
        if(!userExists.data[0]){
            return alert('Email não registrado no banco de dados.')
        }

        api.post('/email-recovery', {email})
            .then(response => setClicked(true))
            .catch(error => console.log(error))
    }

    async function handleUpdatePassword(event: FormEvent){
        event.preventDefault()

        if(password !== password2){
            return alert('Os dois campos de senha devem ser iguais. ')
        }

        api.put('/update-password', {password}, {headers: {'email': userEmail}})
            .then(res => setClicked(true))
    }

    return (
        <main id="create-account-page">
           
            {!existsLocation ? (
                <>
                    <section className="form-create">

                        <div className="content-create">

                            <div className="goback">
                                <Link to="/">
                                    <img src={backIcon} alt="Voltar"/>
                                </Link>
                            </div>

                            <form action="" onSubmit={handleSendPasswordRecovery}>
                                <div className="box-create">
                                    <h3>Eita, esqueceu sua senha ?</h3>
                                    <p>Não esquenta, vamos dar um jeito nisso.</p>
                                </div>

                                <section className="">
                                    <Input 
                                        type="email"
                                        name="email" 
                                        placeholder="E-mail"
                                        value={email}
                                        onChange={event => setEmail(event.target.value)}
                                        required
                                    />
                                </section>

                                <button
                                    disabled={!email}
                                    className={email ? '' : 'button-disabled'}
                                >
                                    Enviar
                                </button>

                            </form>

                        </div>

                    </section>

                    <div className="logo-create">
                        <img className="logoimage-create" src={logoImg} alt="proffy logo"/>
                        <p>Sua plataforma de ensino online</p>
                    </div>

                    {handleFinishPasswordRecovery() && 
                        <SuccessCheck 
                            mainText="Redefinição enviada." 
                            subText="Agora basta você checar seu email e redefinir sua senha !" 
                            buttonText="Voltar ao login"
                        /> 
                    }

                </>
            ) : 

            <>
                <section className="form-create">

                    <div className="content-create">

                        <div className="goback">
                            <Link to="/">
                                <img src={backIcon} alt="Voltar"/>
                            </Link>
                        </div>

                        <form action="" onSubmit={handleUpdatePassword}>
                            <div className="box-create">
                                <h3>Vamos redefinir sua senha !</h3>
                                <p>Digite sua nova senha</p>
                            </div>

                            <section className="">
                                <Input 
                                    type={visible === false ? "password" : "text"}
                                    name="password" 
                                    placeholder="Senha"
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    required
                                >
                                    <img onClick={turnVisibility} className="eye" src={visible === false ? eyeCutLogo : eyeLogo} alt=""/>
                                </Input>

                                <Input 
                                    type={visible === false ? "password" : "text"}
                                    name="password2" 
                                    placeholder="Digite novamente a senha"
                                    value={password2}
                                    onChange={event => setPassword2(event.target.value)}
                                    required
                                />
                                    
                            </section>

                            <button
                                disabled={!password2}
                                className={password && password2 ? '' : 'button-disabled'}
                            >
                                Enviar
                            </button>

                        </form>

                    </div>

                </section>

                <div className="logo-create">
                <img className="logoimage-create" src={logoImg} alt="proffy logo"/>
                <p>Sua plataforma de ensino online</p>
                </div>

                {handleFinishPasswordRecovery() && 
                    <SuccessCheck 
                        mainText="Senha redefinida com sucesso." 
                        subText="Basta se logar novamente e aproveitar a plataforma!" 
                        buttonText="Voltar ao login"
                    /> 
                }
            </>
        }

        </main>
    )
}