import React, { useState, FormEvent, useEffect } from 'react'

import './styles.css'
import Input from '../../components/input'
import logoImg from '../../assets/images/logo.svg'
import eyeLogo from '../../assets/images/icons/visibility.svg'
import eyeCutLogo from '../../assets/images/icons/hide.svg'
import { Link, useHistory } from 'react-router-dom'
import api from '../../services/api'

function MainPage(){
    const history = useHistory()

    const storeEmail = localStorage.getItem('email') !
    const storePassword = localStorage.getItem('password') !

    const [visible, setVisible] = useState(false)
    const [rememberLoginInfo, setRememberLoginInfo] = useState(true)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function turnVisibility(){
        visible === false ? setVisible(true) : setVisible(false)
    }

    function handleRememberLoginInfo(){
        if(rememberLoginInfo === true) {
            setRememberLoginInfo(false)
            localStorage.setItem('email', "")
            localStorage.setItem('password', "")
            localStorage.setItem('checked', 'false')

        } else{
            setRememberLoginInfo(true)
            localStorage.setItem('email', email)
            localStorage.setItem('password', password)
            localStorage.setItem('checked', 'true')
        }
        
    }

    function handleAuthentication(e: FormEvent){
        e.preventDefault()
        
        api.post('/login', {
            email, password
        }).then(res => {
            localStorage.setItem('auth-token', res.data[0])
            localStorage.setItem('username', res.data[1])
            localStorage.setItem('email', email)
            history.push('/landing')
        })
        .catch(err => {
            console.error(err.response.data)
            alert(err.response.data.error)
        })
    }

    useEffect(() =>{
        setEmail(storeEmail === null ? '' : storeEmail)
        setPassword(storePassword === null ? '' : storePassword)
    }, [])

    return (
        <main id="main-page">

            <div className="logo">
                <img className="logoimage" src={logoImg} alt="proffy logo"/>
                <p>Sua plataforma de ensino online</p>
            </div>

            <section className="form">

                <div className="content">

                    <div className="box">
                        <h3>Fazer Login</h3>
                        <Link to="/create-account">
                            <p>criar uma conta</p>
                        </Link>
                    </div>
                    <form onSubmit={handleAuthentication} action="">
                        <Input 
                            name="E-mail" 
                            placeholder="E-mail"
                            value={email}
                            onChange={e => { setEmail(e.target.value); localStorage.setItem('email', e.target.value)}}
                        />
                        <Input 
                            name="Senha" 
                            type={visible === false ? "password" : "text"}
                            placeholder="Senha"
                            value={password}
                            onChange={e => { setPassword(e.target.value); localStorage.setItem('password', e.target.value)}}
                        >
                            <img onClick={turnVisibility} className="eye" src={visible === false ? eyeCutLogo : eyeLogo} alt=""/>
                        </Input>

                        <div className="box">

                            <div className="container-checkbox">
                                <input 
                                    onClick={handleRememberLoginInfo} type="checkbox" name="Lembrar-me" id="lembrar" 
                                    defaultChecked={localStorage.getItem('checked') === 'true' ? true : false}
                                />
                                <label htmlFor="lembrar">Lembrar-me</label>
                            </div>

                            <Link to="/recover-password">
                                <p>Esqueci minha senha</p>
                            </Link>



                        </div>

                        <button>Entrar</button>
                    </form>
                    
                </div>
            </section>
        </main>
    )
}

export default MainPage