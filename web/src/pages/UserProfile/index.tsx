import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import emptyUserIcon from '../../assets/images/icons/user.svg'
import camera from '../../assets/images/icons/camera.svg'
import warningIcon from '../../assets/images/icons/warning.svg'

import PageHeader from '../../components/PageHeader'
import Input from '../../components/input'
import Textarea from '../../components/Textarea'
import Select from '../../components/Select'
import api from '../../services/api'

import './styles.css'
import { setupMaster } from 'cluster'


export default function UserProfile(){
    const history = useHistory()

    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [bio, setBio] = useState('')
    const [email, setEmail] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [image, setImage] = useState('')
    const [previewImage, setPreviewImage] = useState('')
    const [updatedImage, setUpdatedImage] = useState<File>()

    useEffect(() => {
        api.get('user', {headers: {'auth-token': localStorage.getItem('auth-token'), 'email': localStorage.getItem('email')}})
            .then(response => {
                setName(response.data[0].name)
                setSurname(response.data[0].surname)
                setBio(response.data[0].bio || '')
                setEmail(response.data[0].email)
                setWhatsapp(response.data[0].whatsapp || '')
                setImage(response.data[0].path === 'http://localhost:3333/uploads/' ? '' : response.data[0].path)
            })
    } ,[])

    function handleSelectedImage(event: ChangeEvent<HTMLInputElement>){
        if(!event.target.files) return  

        const previewImage = URL.createObjectURL(event.target.files[0])

        setPreviewImage(previewImage)

        setUpdatedImage(event.target.files[0])
    }

    function handleUpdateUser(event: FormEvent){
        event.preventDefault()

        const data = new FormData()

        data.append('path', updatedImage!)
        data.append('name', name)
        data.append('surname', surname)
        data.append('bio', bio)
        data.append('whatsapp', whatsapp)

        api.patch('user', data, {headers: {'auth-token': localStorage.getItem('auth-token'), 'email': email}})
            .then(res => console.log(res))
            .catch(err => console.log(err))

        alert('Perfil atualizado.')

        history.push('/')
    }

    return (
        <main id="user-profile">
            <PageHeader  title="Meu perfil"/>

            <section>
                <article className="user-info">

                    <div className="user-upper-info">
                        <img className="profile-photo" src={previewImage || (!image ? emptyUserIcon : image)} alt=""/>

                        <label htmlFor="image">
                            <img className="camera-picture" src={camera} alt=""/>
                        </label>
                        
                    </div>

                    <input 
                        type="file" 
                        id="image" 
                        onChange={handleSelectedImage}
                    />

                    <span>{localStorage.getItem('username')}</span>

                </article>

                <form onSubmit={handleUpdateUser}>
                    <fieldset>
                        <legend>Seus dados</legend>

                        <div className="inputs">
                            <Input 
                                name="Nome" 
                                label="Nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                
                            />

                            <Input 
                                name="Sobrenome" 
                                label="Sobrenome"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                
                            />
                        </div>

                        <div className="inputs">
                            <Input 
                                name="Email" 
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                disabled
                            />

                            <Input 
                                name="Whatsapp" 
                                label="Whatsapp"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                placeholder="Exemplo: 61 9 99991111"
                            />
                        </div>

                        <Textarea 
                            name="biografia" 
                            label="biografia"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Escreva brevemente sobre você."
                        />
                    </fieldset>

                    { /*} <fieldset>
                        <legend>Sobre a aula</legend>

                        <section className="inputs">

                            <Select
                                name="subject" 
                                label="Matéria"
                                value={0}
                                onChange={(e) => {}}
                                options={[
                                    {  value: 'Artes', label: 'Artes'},
                                    {  value: 'Biologia', label: 'Biologia'},
                                    {  value: 'Ciências', label: 'Ciências'},
                                    {  value: 'Matemática', label: 'Matemática'},
                                    {  value: 'Geografia', label: 'Geografia'},
                                    {  value: 'História', label: 'História'},
                                    {  value: 'Física', label: 'Física'},
                                    {  value: 'Filosofia', label: 'Filosofia'}
                                ]}
                            />
                            <Input 
                                name="cost" 
                                label="Custo da sua hora por aula"
                                value={0}
                                onChange={(e) => {}}
                                placeholder="R$"
                            />
                        </section>
                        
                    </fieldset>

                    <fieldset>
                        <legend>
                            Horários disponíveis
                            <button type="button" onClick={addNewHorary}>+ Novo horário</button>
                        </legend>

                        {scheduleItems.map((scheduleItem, index) => {
                            return (
                                <section key={scheduleItem.week_day} className="schedule_item">
                                    <Select 
                                        name="week_day" 
                                        label="Dia da semana"
                                        value={scheduleItem.week_day}
                                        onChange={e => {}}
                                        options={[
                                            {  value: '0', label: 'Domingo'},
                                            {  value: '1', label: 'Segunda'},
                                            {  value: '2', label: 'Terça'},
                                            {  value: '3', label: 'Quarta'},
                                            {  value: '4', label: 'Quinta'},
                                            {  value: '5', label: 'Sexta'},
                                            {  value: '6', label: 'Sábado'},
                                        ]}
                                    />

                                    <Input 
                                        name="from" 
                                        label="Das" 
                                        type="time"
                                        value={}
                                        onChange={e => {}}
                                    />
                                    <Input 
                                        name="to" 
                                        label="Até" 
                                        type="time"
                                        value={}
                                        onChange={e => {}}
                                    />
                                </section>
                            )
                        })}
                    </fieldset> */}

                    <footer>
                        <p>
                            <img src={warningIcon} alt="aviso importante"/>
                            Importante! <br/>
                            Preencher todos os dados
                        </p>

                        <button type="submit">
                            Salvar cadastro
                        </button>
                    </footer>
                </form>
            </section>
            
        </main>
    )
}