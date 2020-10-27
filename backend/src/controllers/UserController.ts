import {Request, Response} from 'express'
import db from '../database/connection'
import {hashPassword, compareHashPassword} from '../utils/hashPasswords'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import api from '../services/api'

dotenv.config()

export default class UserController{
    async index(request: Request, response: Response){
        const {email} = request.headers
        
        try{
            const loggedUser = await db('user').select('*').where('email', email as string)

            loggedUser.forEach(item => item.path = `http://localhost:3333/uploads/${item.path}`)

            return response.status(200).json(loggedUser)

        }catch(err){
            console.error(err)

            return response.status(401).json(err)
        }

    }

    async create(request: Request, response: Response){
        const {name, surname, bio, email, password, whatsapp} = request.body

        const hashedPassword = await hashPassword(password)

        try{
            const path = request.file as Express.Multer.File

            let filename = ''

            if(path) filename = path.filename

            await db('user').insert({name, surname, bio, email, password: hashedPassword, whatsapp, path: filename})

            return response.status(200).json('Usuário criado com sucesso.')
        }catch(err){
            console.log(err)

            return response.status(500).json('Email já em uso. Por favor, cadastre outro.')
        }
    }

    async update(request: Request, response: Response){
        const {name, surname, bio, whatsapp} = request.body

        const user = await api.get('/user', {
            headers: {'auth-token': request.headers['auth-token'] ,
            'email': request.headers.email}
        })

        const userImagePath = user.data[0].path
        const patternIsPresent = userImagePath.match('uploads/\?(.*)')
        const regexp = /\-(.*)/
        const actualImageName = regexp.exec(userImagePath) || ''

        try{
            
            const {filename} = request.file as Express.Multer.File || actualImageName![0] || ''

            const fileNameRegexp = regexp.exec(filename)
    
            if(filename && (actualImageName![0] || '' !== fileNameRegexp![0])) {
    
                fs.unlink(patternIsPresent[0], (error) => {
                    if(error){
                        console.error(error)
                    }
                    
                })
            }
    
            await db('user').update({name, surname, bio, whatsapp, path: filename}).where('email', request.headers.email)
    
            return response.status(200).json('Informações atualizadas.')

        }catch(error){
            console.log(error)

            return response.status(401).json(error)
        }
    }

    login(request: Request, response: Response){
        const { email, password} = request.body

        db.select('*').from('user').whereRaw('user.email = ?', [email]).then(async result => {
            const match = await compareHashPassword(password, result[0].password)

            if(!match){
                return response.status(401).json({error: 'Senha inválida.'})
            }

            const token = jwt.sign({_email: email, }, process.env.TOKEN!)
            const [{name}] = await db.select('name').from('user').where('email', '=' ,email)

            return response.status(200).header('auth-token', token).json([token, name])
            
        }).catch(err => {
            console.log(err)
            return response.status(401).json({error: 'Email inválido.'})
        })

    }

    async userDoExists(request: Request, response: Response){
        const {email} = request.headers

        const user = await db.select('email').from('user').where('email', email)

        return response.status(200).json(user)
    }
}