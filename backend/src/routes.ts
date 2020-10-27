import express from 'express'
import multer from 'multer'

import ClassesController from './controllers/ClassesController'
import ConnectionsController from './controllers/ConnectionsController'
import ProfessorController from './controllers/ProfessorController'
import UserController from './controllers/UserController'
import RecoverEmailController from './controllers/RecoverEmailController'
import PasswordController from './controllers/PasswordController'

import Auth from './middlewares/Auth'
import uploadConfig from './config/upload'

const classesController = new ClassesController()
const connectionsController = new ConnectionsController()
const userController = new UserController()
const professorController = new ProfessorController()

const routes = express.Router()
const upload = multer(uploadConfig)

routes.post('/classes', Auth ,classesController.create)
routes.get('/classes', Auth ,classesController.index)

routes.get('/connections', Auth ,connectionsController.index)
routes.post('/connections', Auth ,connectionsController.create)

routes.get('/user', Auth, userController.index)
routes.get('/user-exists', userController.userDoExists)
routes.post('/create-user', upload.single('path') ,userController.create)
routes.patch('/user', Auth, upload.single('path'), userController.update)

routes.post('/login', userController.login)

routes.get('/professors', professorController.index)

routes.post('/email-recovery', RecoverEmailController.sendRecoveryEmail)

routes.put('/update-password', PasswordController.update)

export default routes