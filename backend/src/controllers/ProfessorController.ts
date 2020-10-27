import {Request, Response} from 'express'
import db from '../database/connection'

export default class ProfessorController{
    async index(request: Request, response: Response){
        const amountOfProfessors = await db('users').countDistinct('email as total')

        const {total} = amountOfProfessors[0]

        return response.status(200).json({total})
    }
}