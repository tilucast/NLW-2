import jwt from 'jsonwebtoken'
import {Request, Response, NextFunction, RequestHandler} from 'express'

interface RequestProps extends Request, RequestHandler{
    user: Object
}

export default function Auth (request: RequestProps, response: Response, next: NextFunction){
    const token = request.header('auth-token')

    if(!token) return response.status(401).json({error: 'Access denied.'})

    try{
        const verify = jwt.verify(token, process.env.TOKEN as string)

        request.user = verify
        
        next()
    }catch(err){
        response.status(401).json('Invalid token.')
    }
}