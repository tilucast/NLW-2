import React, { useState, useEffect } from 'react'
import { View, Text, TextInput } from 'react-native'

import styles from './styles'
import PageHeader from '../../components/PageHeader'
import TeacherItem, { Teacher } from '../../components/TeacherItem'
import { ScrollView, BorderlessButton, RectButton } from 'react-native-gesture-handler'
import {Feather} from '@expo/vector-icons'
import api from '../../services/api'
import AsyncStorage from '@react-native-community/async-storage'
import { useFocusEffect } from '@react-navigation/native'

function TeacherList(){

    const [teachers, setTeachers] = useState([])
    const [favorites, setFavorites] = useState<number[]>([])

    const [subject, setSubject] = useState("")
    const [week_day, setWeekDay] = useState("")
    const [time, setTime] = useState("")

    const [filtersVisible, setFiltersVisible] = useState(false)

    function loadFavorites(){
        AsyncStorage.getItem('favorites').then(res => {
            if(res){
                const favorited = JSON.parse(res)
                const favoritedIds = favorited.map((teacher: Teacher) => {
                    return teacher.id
                })

                setFavorites(favoritedIds)
            }
        })
    }

    function handleVisibleFilters(){
        setFiltersVisible(!filtersVisible)
    }

    useFocusEffect(() =>{
        loadFavorites()
    })

    async function handleFiltersSubmit(){
        loadFavorites()

        const response = await api.get('classes', {
            params: {
                subject, week_day, time
            }
        })
        
        setTeachers(response.data)
        setFiltersVisible(false)
    }

    return (
        <View style={styles.container}>
            <PageHeader 
                title="Proffys disponíveis" 
                headerRight={(
                    <BorderlessButton onPress={handleVisibleFilters}>
                        <Feather name="filter" size={20} color="#fff"/>
                    </BorderlessButton>
                )}
            >
                {filtersVisible && (
                    <View style={styles.searchForm}>

                        <Text style={styles.label}>Matéria</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="Qual a matéria?"
                            placeholderTextColor="#c1bccc"
                            value={subject}
                            onChangeText={text => setSubject(text)}
                        />

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Qual o dia"
                                    placeholderTextColor="#c1bccc"
                                    value={week_day}
                                    onChangeText={text => setWeekDay(text)}
                                />
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Qual o horário?"
                                    placeholderTextColor="#c1bccc"
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                />
                            </View>
                        </View>

                        <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>

                    </View>
                )}
                
            </PageHeader>

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
            {teachers.map((teacher: Teacher) => {
                return (
                    <TeacherItem 
                        key={teacher.id} 
                        teacher={teacher}
                        favorited={favorites.includes(teacher.id)}
                    />
                )
            })}
            </ScrollView>
        </View>
    )
}

export default TeacherList