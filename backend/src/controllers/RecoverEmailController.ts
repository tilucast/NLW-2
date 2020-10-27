import {Request, Response} from 'express'
import nodemailer from 'nodemailer'

export default class RecoverEmailController{

    static async sendRecoveryEmail(request: Request, response: Response){
        const email = request.body.email

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'proffy.atproffyland@gmail.com',
                pass: ''
            }
            });
            
        const mailOptions = {
            from: 'Plataforma Proffy - proffy.atproffyland@gmail.com',
            to: email,
            subject: 'Recuperaçao de senha Proffy',
            text: `Olá seu diabo ${email}, você solicitou recuperação de senha de sua conta na plataforma Proffy.
                Clique aqui http://localhost:3000/recovery/?${email} para proceder com a recuperação.
            `
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);

                return response.status(401).json({error})
            } else {
                console.log('Email sent: ' + info.response);
                return response.status(200).json({message: 'Email enviado com sucesso.'})
            }
        });
        
    }
}