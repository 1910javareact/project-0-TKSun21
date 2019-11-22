import express from 'express'
import { Users } from '../models/model-user'
import { getAllUsers, saveOneUser, getUserById } from '../services/user-service'
import { authorization } from '../middleware/auth-middleware'

export const userRouter = express.Router()

function controllerGetUsers(req, res){
    let users = getAllUsers()
    if(users){
        res.json(users)
    } else {
        res.sendStatus(500)
    }
}

userRouter.get('', [authorization(['Admin']), controllerGetUsers])

userRouter.get('/:id', (req,res)=>{
    let id = +req.params.id
    if(isNaN(id)){
        res.sendStatus(400)
    } else {
        try{
            let user = getUserById(id)
            res.json(user)
        } catch(e){
            res.status(e.status).send(e.message)
        }
    }
})

userRouter.post('', [authorization(['Admin', 'Moderator']),
    (req,res)=>{
        let {body} = req
        let newU = new Users(0,'','','','','',[])
        for (let key in newU){
            console.log(body[key]);

            if(body[key] === undefined){
                res.status(400).send('Please include all user fields')
                break;
            } else {
                newU[key] = body[key]
            }
        }
        if(saveOneUser(newU)){
            res.sendStatus(201)
        } else {
            res.sendStatus(500)
        }
    }
])