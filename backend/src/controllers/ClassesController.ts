import {Request, Response} from 'express'
import db from '../database/connection'
import api from '../services/api'
import convertHourToMinutes from '../utils/convertHoursToMinutes'

interface ScheduleItem {
    week_day : number,
    from: string,
    to: string
}

export default class ClassesController{
    async index(request: Request, response: Response){
        const filters = request.query
        if(!filters.subject || !filters.week_day || !filters.time){
            return response.status(400).json({error: 'Missing filters to search for classes.'})
        }

        const subject = filters.subject as string
        const week_day = filters.week_day as string
        const time = filters.time as string

        const timeInMinutes = convertHourToMinutes(time)

        const classes = await db('classes')
        .whereExists(function (){
            this.select('class_schedule.*')
                .from('class_schedule')
                .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                .whereRaw('`class_schedule`.`week_day` = ??', Number([week_day]))
                .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
        })
        .where('classes.subject', '=', subject)
        .join('users', 'classes.user_id', '=', 'users.id')
        .join('user', 'users.email', '=', 'user.email')
        
        return response.json(classes)
        
    }

    async create(req: Request, res: Response)  {
        const {
            subject, cost, schedule
        } = req.body

        const email = req.headers.email

        /*const {data} = await api.get('/user', {
            headers: {'auth-token': req.headers['auth-token'] ,
            'email': email}
        }) */

        const trx = await db.transaction()

        try{

           const insertedUsersIds = await trx('users').insert({
               email
                //name: data[0].name, avatar: data[0].path, whatsapp: data[0].whatsapp, bio: data[0].bio
            })
        
            const user_id  = insertedUsersIds[0]
        
            const insertedClassesIds = await trx('classes').insert({
                subject, cost, user_id
            })
        
            const class_id = insertedClassesIds[0]
        
            const classSchedule = schedule.map((schedule:  ScheduleItem) => {
                return {
                    week_day: schedule.week_day,
                    from: convertHourToMinutes(schedule.from),
                    to: convertHourToMinutes(schedule.to),
                    class_id
                }
            })
        
            await trx('class_schedule').insert(classSchedule)
        
            await trx.commit()
        
            return res.status(201).json('Classe criada com sucesso.')

        }catch(err){
            await trx.rollback()

            console.error(err)
    
            return res.status(400).json({
                error: 'Unexpected error while creating new class'
            })
        }
    }
}