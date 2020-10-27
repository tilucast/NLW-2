import React, { useState, FormEvent } from 'react'

import './styles.css'
import Input from '../../components/input'
import logoImg from '../../assets/images/logo.svg'
import eyeLogo from '../../assets/images/icons/visibility.svg'
import eyeCutLogo from '../../assets/images/icons/hide.svg'
import backIcon from '../../assets/images/icons/back.svg'
import { Link, useHistory } from 'react-router-dom'
import api from '../../services/api'
import SuccessCheck from '../../components/SuccessCheck'

function CreateAccount(){

    const [visible, setVisible] = useState(false)

    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [clicked, setClicked] = useState(false)

    function turnVisibility(){
        visible === false ? setVisible(true) : setVisible(false)
    }

    function handleFinishLogin(){
        if(name && surname && email && password && clicked){
            return true
        }
    }

    function handleDisabledButton(){
        if(!name || !email || !password || !surname){
            return true
        }
    }

    function handleCreateAccount(e: FormEvent){
        e.preventDefault()

        api.post('/create-user', {
            name, surname, email, password
        }).then(res => {
            setClicked(true)
           
        }).catch(err => alert(err.response.data))
    }

    return (
        <main id="create-account-page">
           
            <section className="form-create">

                <div className="content-create">

                    <div className="goback">
                        <Link to="/">
                            <img src={backIcon} alt="Voltar"/>
                        </Link>
                    </div>

                    

                    <form action="" onSubmit={handleCreateAccount}>
                        <div className="box-create">
                            <h3>Cadastro</h3>
                            <p>Preencha os dados abaixo para começar</p>
                        </div>

                        <section>
                            <Input 
                                name="Nome"
                                label="Nome"
                                placeholder="Seu nome"
                                value={name}
                                onChange={e => { setName(e.target.value) }}
                                required
                            />
                            <Input 
                                name="Sobrenome"
                                label="Sobrenome"
                                placeholder="Seu sobrenome"
                                value={surname}
                                onChange={e => { setSurname(e.target.value) }}
                                required
                            />
                            <Input 
                                type="email"
                                name="E-mail"
                                label="Email"
                                placeholder="E-mail"
                                value={email}
                                onChange={e => { setEmail(e.target.value) }}
                                required
                            />
                            <Input 
                                name="Senha"
                                label="Senha"
                                type={visible === false ? "password" : "text"} 
                                placeholder="Senha"
                                value={password}
                                onChange={e => { setPassword(e.target.value) }}
                                required
                            >
                                <img onClick={turnVisibility} className="eye" src={visible === false ? eyeCutLogo : eyeLogo} alt=""/>
                            </Input>
                        </section>

                        <button 
                            disabled={handleDisabledButton()}
                            className={handleDisabledButton() ? 'button-disabled' : ''}
                        >
                            Concluir cadastro
                        </button>

                    </form>

                </div>

            </section>

            <div className="logo-create">
                <img className="logoimage-create" src={logoImg} alt="proffy logo"/>
                <p>Sua plataforma de ensino online</p>
            </div>

            {handleFinishLogin() && 
                <SuccessCheck 
                    mainText="Cadastrado com sucesso." 
                    subText="Agora você faz parte da plataforma Proffy. Tenha uma ótima experiência." 
                    buttonText="Fazer login"
                /> 
            }

        </main>
    )
}

export default CreateAccount