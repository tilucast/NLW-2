import {Request, Response} from 'express'
import db from '../database/connection'
import {hashPassword} from '../utils/hashPasswords'

export default class PasswordController{
    static async update(request: Request, response: Response){
        const {password} = request.body
        const {email} = request.headers

        const hashedPassword = await hashPassword(password)

        await db('user').update({password: hashedPassword}).where('email', email)

        return response.status(200).json('Senha atualizada com sucesso.')
    }
}