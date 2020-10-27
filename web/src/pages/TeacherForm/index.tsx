import React, {useState, FormEvent, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

import PageHeader from '../../components/PageHeader'
import Input from '../../components/input'
import warningIcon from '../../assets/images/icons/warning.svg'
import Textarea from '../../components/Textarea'
import Select from '../../components/Select'
import api from '../../services/api'

import emptyUserIcon from '../../assets/images/icons/user.svg'

import './styles.css'

function TeacherForm(){
    const history = useHistory()
    const email = localStorage.getItem('email')

    const [whatsapp, setWhatsapp] = useState("")
    const [bio, setBio] = useState("")
    const [profileImage, setProfileImage] = useState('')

    const [subject, setSubject] = useState("")
    const [cost, setCost] = useState("")

    const [scheduleItems, setScheduleItems] = useState([
        {week_day: 0, from: '', to: ''}
    ])

    function addNewHorary(){
        setScheduleItems([
            ...scheduleItems,
            {week_day: 0, from: '', to: ''}
        ])
    }

    function handleCreateClass(e: FormEvent){
        e.preventDefault()

        api.post('classes', {
            subject, cost: Number(cost), schedule: scheduleItems
        }, {
            headers: {'auth-token': localStorage.getItem('auth-token'), 'email': email}
        }).then(() => {
            alert('Cadastro realizado com sucesso.')
            history.push('/')
        }).catch((error) => {
            console.log(error.response)
            alert('Erro no cadastro.')
        })
    }

    function setScheduleItemValue(index: number, field: string, value: string){
        const updatedScheduleItems = scheduleItems.map((scheduleItem, position) => {
            if(index === position){
                return {...scheduleItem , [field]: value}
            }

            return scheduleItem
        })

        setScheduleItems(updatedScheduleItems)
    }

    useEffect(() => {
        api.get('user', {headers: {'auth-token': localStorage.getItem('auth-token'), 
        'email': localStorage.getItem('email')}})
            .then(response => {
                setWhatsapp(response.data[0].whatsapp)
                setBio(response.data[0].bio)
                setProfileImage(response.data[0].path === 'http://localhost:3333/uploads/' ? '' : response.data[0].path)
            })
    }, [])

    return (
        <div id="page-teacher-form" className="container">
            <PageHeader 
            title="Que incrível que você quer dar aulas!"
            description="O primeiro passo, é preencher esse formulário de inscrição."
            />

            <main>
                <form onSubmit={handleCreateClass}>
                    <fieldset>
                        <legend>Seus dados</legend>

                        <span>
                            <img src={!profileImage ? emptyUserIcon : profileImage} alt=""/>
                            <p>{localStorage.getItem('username')}</p>
                        </span>

                        {/* <Input 
                            name="name" 
                            label="Nome completo" 
                            value={name} 
                            onChange={(e) => { setName(e.target.value) }}
                        />
                        <Input 
                            name="avatar" 
                            label="Avatar"
                            value={avatar}
                            onChange={(e) => { setAvatar(e.target.value) }}
                        /> */}
                        <Input 
                            name="whatsapp" 
                            label="Whatsapp"
                            value={whatsapp}
                            placeholder="Exemplo: 61 9 99991111"
                            readOnly
                        />
                        <Textarea 
                            name="bio" 
                            label="biografia"
                            value={bio}
                            placeholder="Escreva brevemente sobre você."
                            readOnly
                            
                        />
                    </fieldset>

                    <fieldset>
                        <legend>Sobre a aula</legend>

                        <section className="inputs">

                            <Select
                                name="subject" 
                                label="Matéria"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
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
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
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
                                        onChange={e => setScheduleItemValue(index, 'week_day', e.target.value)}
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
                                        value={scheduleItem.from}
                                        onChange={e => setScheduleItemValue(index, 'from', e.target.value)}
                                    />
                                    <Input 
                                        name="to" 
                                        label="Até" 
                                        type="time"
                                        value={scheduleItem.to}
                                        onChange={e => setScheduleItemValue(index, 'to', e.target.value)}
                                    />
                                </section>
                            )
                        })}
                    </fieldset>

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
            </main>
        </div>
    )
}

export default TeacherForm