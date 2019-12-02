import express from 'express'
import { authorization } from '../middleware/auth-middleware'
import * as user_Services from '../services/user-service'

export const userRouter = express.Router()

userRouter.get('', [authorization(['Finance Manager'])], async (req, res) =>{
    try{
        let allUsers = await user_Services.getAllUsers()

        res.status(200).json(allUsers)
    }
    catch(e){
        
        res.status(e.status).send(e.message)
    }
})

userRouter.get('/:id', [authorization(['Finance Manager', 'Admin', 'User'])] ,async (req, res) =>{
    const id = +req.params.id
    if(isNaN(id)){
        res.status(400).send('Invalid ID')
    }
    else if(req.session.user.role.role === 'Finance Manager'){
        try{
            let user = await user_Services.getUserById(id)
            res.status(200).json(user)
        }
        catch(e){
            res.status(e.status).send(e.message)
        }
    }
    else{
        try{
            let user = await user_Services.getUserById(id)
            if(req.session.user.userId === user.userId){
                res.status(200).json(user)
            }
            else{
                res.status(404).send('Unable to find user')
            }
        }
        catch(e){
            res.status(e.status).send(e.message)
        }
    }
})

userRouter.patch('', [authorization(['Admin'])], async (req, res) =>{
    try{
        let {body} = req

        let user = user_Services.updateUser(body)
        
        if(user){

            res.status(200).json(user)
        }
        else{
            
            res.status(400).send('Unable to find user')
        }
    }
    catch(e){
        res.status(e.status).send(e.message)
    }
})